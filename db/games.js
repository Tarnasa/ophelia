'use strict'

const knex = require('./connect').knex

/**
 * Queries for all relevant games for a specified team name. Only retrieves
 * games for the highest submission version
 * @param teamName String, name of the team to grab submissions for
 * @return {Promise} resolves when there are no errors, rejects if there is a
 *  problem
 */
function getGamesByTeamName (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    const gameIDs = []
    const gamesQuery = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .where('version', '=', knex('submissions').max('version'))
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .where('teams.name', '=', teamName)
      .select('games.id', 'games.created_at', 'games.updated_at')
    gamesQuery.then((rows) => {
      // This gets the IDs for each game that the user is in
      rows.forEach((row) => { gameIDs.push(row.id) })
      const submissions = knex('submissions')
        .join('games_submissions',
          'games_submissions.submission_id', '=', 'submissions.id')
        .where('version', '=', knex('submissions').max('version'))
        .join('games', 'games_submissions.game_id', '=', 'games.id')
        .where('games.id', 'in', gameIDs)
        .join('teams', 'teams.id', '=', 'submissions.team_id')
        .select('submissions.team_id',
          'games.id',
          'teams.name',
          'games.status',
          'games.win_reason',
          'games.lose_reason',
          'games.winner_id',
          'games.log_url',
          'games.created_at',
          'games.updated_at')
      submissions.then((subRows) => {
        subRows.sort(sortGames)
        const games = []
        for (const row of subRows) {
          let game = row
          if (row.name !== teamName) {
            game.opponent = row.name
            delete game.name
            if (game.team_id === game.winner_id) {
              game.winner = game.opponent
            } else {
              game.winner = teamName
            }
            delete game.winner_id
            delete game.team_id
            games.push(game)
          }
        }
        return resolve(games)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getGameById (gameId) {
  return new Promise((resolve, reject) => {
    if (gameId === null || typeof gameId === 'undefined') {
      return reject(new Error('gameId is null or undefined'))
    }
    knex
    .select('status', 'win_reason', 'lose_reason', 'winner_id', 'log_url')
    .from('games')
    .where('id', '=', gameId)
    .then((res) => {
      return resolve(res)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function sortGames (gameA, gameB) {
  console.log(gameA)
  const dateA = new Date(gameA.created_at)
  const dateB = new Date(gameB.created_at)
  console.log(dateA, dateB)
  if (dateA > dateB) {
    return -1
  }
  if (dateA < dateB) {
    return 1
  }
  return 0
}

module.exports = {
  getGamesByTeamName,
  getGameById
}

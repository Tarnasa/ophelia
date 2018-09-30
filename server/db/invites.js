'use strict'

const knex = require('./connect').knex
const ALREADY_ON_A_TEAM = 'User is already on a team.'

/**
 * Gets an invite by the given invite id
 * @param inviteId id of the invite
 * @returns {Promise}
 */
function getInviteById (inviteId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      id: inviteId
    }).then((res) => {
      resolve(res[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Gets all invites for a team
 * @param teamId id of the team the invites belong to
 * @returns {Promise}
 */
function getInvitesForTeam (teamId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      team_id: teamId
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Gets all invites for a user
 * @param userId id of the user the invites belong to
 * @returns {Promise}
 */
function getInvitesForUser (userId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      user_id: userId
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Creates a new invite with the given user and team id
 * @param teamId team id the invite originated from
 * @param userId user id that the invite is for
 * @returns {Promise}
 */
function createInvite (teamId, userId) {
  return new Promise((resolve, reject) => {
    knex('teams_users').select().where('user_id', '=', userId).then((data) => {
      if (data.length > 0) {
        return reject(new Error(ALREADY_ON_A_TEAM))
      }
      knex('invites').insert({
        team_id: teamId,
        user_id: userId,
        is_completed: false
      }).then(() => {
        return resolve()
      }).catch((err) => {
        return reject(err)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

/**
 * todo; this is probably a bad function, might need to change
 * Update an invite for a team and user
 * @param inviteId id of invite to update
 * @param teamId team id the invite belongs to
 * @param userId user id the invite belongs to
 * @param accepted whether or not the invite was accepted or rejected
 * @returns {Promise}
 */
function updateInvite (teamId, userId, accepted) {
  return new Promise((resolve, reject) => {
    knex('teams_users').select().where('user_id', '=', userId).then((data) => {
      if (data.length > 0) {
        return reject(new Error(ALREADY_ON_A_TEAM))
      }
      knex('invites').where({
        user_id: userId,
        team_id: teamId
      }).update({
        is_completed: true
      }).then(() => {
        if (accepted) {
          knex('teams_users').insert({
            team_id: teamId,
            user_id: userId
          }).then(() => {
            return resolve()
          }).catch((err) => {
            return reject(err)
          })
        } else {
          resolve()
        }
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

module.exports = {
  getInviteById: getInviteById,
  getInvitesForTeam: getInvitesForTeam,
  getInvitesForUser: getInvitesForUser,
  createInvite: createInvite,
  updateInvite: updateInvite
}

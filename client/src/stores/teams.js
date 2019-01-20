import { observable, action, runInAction, reaction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

// TODO: Create cache of teams
export class TeamStore {
  @observable team = undefined
  @observable teams = []
  @observable teammates = []
  @observable numPages = 5
  @observable pageSize = 3
  @observable isLoading = false
  @observable isStale = false
  @observable lastUpdated = null
  @observable teamSortId = []
  @observable kickError = ''

  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadAllTeams = this.loadAllTeams.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    reaction(
      () => this.isStale,
      () => {
        if(this.isStale) {
          this.loadAllTeams()
        }
      }
    )
  }

  @action async loadTeam (teamID) {
    try {
      const response = await this.requestLayer.getTeamByName(teamID)
      runInAction(() => {
        this.team = response.data.team
      })
    } catch (err) {
      console.log(err)
    }
  }

  @action makeDataStale() {
    this.isStale = true
  }

  @action async getName(teamId) {
    return new Promise((resolve, reject) => {
      this.requestLayer.getTeamName(teamId).then((response) => {
        return resolve(response.data.team.name)
      }).catch((err) => {
        return err
      })
    })
    // try {
    //   const response = await this.requestLayer.getTeamName(teamId);
    //   runInAction(() => {
    //     var item = response.data.team.name
    //     console.log(item)
    //     return item
    //   })
    // } catch(err) {
    //   console.log(err)
    // }
  }

  @action async getAllTeams() {
    try {
      const response = await this.requestLayer.getAllTeams();
      runInAction(() => {
        this.teams = response.data.names
      })
    } catch (err) {
      console.log(err)
    }
  }


  @action async getAllTeamMates() {
    try {
      const response = await this.requestLayer.getAllTeamMates();
      runInAction(() => {
        this.teammates = response.data.teammates
      })
    } catch (err) {
      console.log(err)
    }
  }

  @action async kickUser(name) {
    return new Promise((resolve, reject) => {
      this.kickError = ''
      this.requestLayer.kickUser(name).then((response) => {
        this.makeDataStale()
        return resolve(response)
      }).catch((err) => {
        this.makeDataStale();
        this.kickError = 'Failed to remove user from team! Are you a captain?'
        return reject(err)
      })
    })
  }

  @action async getCurrentTeam() {
    try {
      const response = await this.requestLayer.getCurrentTeam();
      runInAction(() => {
        this.team = response.data.onTeam;
      })
    } catch (err) {
      throw err;
    }
  }

  @action async removeSelfFromTeam() {

    try { 
      const response = await this.requestLayer.removeSelfFromTeam();
      return response
    } catch (err) {
      throw err;
    }
  }

  @action loadAllTeams(pageNum = 1, filter = {}){
    this.isLoading = true
    this.requestLayer.fetchTeams(pageNum, this.pageSize, filter).then(action('loadTeams-callback', (data) => {
      this.teams = []
      this.numPages = data.numPages
      data.teams.forEach((json) => { 
        this.teams.push(json)
      })
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    })).catch((err) => {
      console.log("Error Loading Teams", err.message)
    })
  }

}
export default new TeamStore()

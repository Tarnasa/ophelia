import { action, observable, reaction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

/**
 * MobX store for invites 
 * @export 
 * @class invitesStore
 */


 export class InvitesStore {
     @observable invites = [];
     @observable isLoading = false;
     @observable isStale = false;
     @observable lastUpdated = null;
     @observable inviteError = ''


     /**
      * Creates an instance of InvitesStore
      * @memberof InvitesStore
      */

      constructor() {
        this.requestlayer = new RequestLayer();
        this.loadInvites = this.loadInvites.bind(this);
        this.makeDataStale = this.makeDataStale.bind(this);

        reaction(
            () => this.isStale,
            () => {
                if(this.isStale) {
                    this.loadInvites()
                }
            }
        )
      }

      @action loadInvites() {
          this.isLoading = true;
          this.requestlayer.fetchInvites().then(action('loadInvites-callback', (data) => {
              this.invites = []
              data.invites.forEach((json) => {
                  this.invites.push(json)
              })
              this.isLoading = false;
              this.isStale = false;
              this.lastUpdated = new Date()
          })).catch((err) => {
              console.log('Error loading invites', err.messasge)
          })
      }

      @action makeDataStale() {
          this.isStale = true
      }

      @action sendInvite(teamName, userName) {
          return new Promise((resolve, reject) => {
            this.inviteError = ''
            this.isLoading = true;
            this.requestlayer.sendInvite(teamName, userName).then((response) => {
                this.isLoading = false;
                this.makeDataStale()
                return resolve()
            }).catch((err) => {
                this.isLoading = false;
                this.makeDataStale()
                this.inviteError = 'Failed to send invite!'
            })
          })
      }

      //TODO: Need logic to accept invite
 }

 export default new InvitesStore()
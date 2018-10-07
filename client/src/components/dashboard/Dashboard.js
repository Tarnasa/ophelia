import React from 'react'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionContainer from '../../containers/SubmissionContainer'
import ShowTeams from '../teams/ShowTeams';

export default class Dashboard extends React.Component {
  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <GamesContainer />
            <ShowTeams />
          </div>
          <div className='col-md-6'>
            <div className='submission'>
              <SubmissionContainer />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

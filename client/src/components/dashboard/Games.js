import { inject, observer } from 'mobx-react'
import React from 'react'

import GameBadge from '../../components/GameBadge'

@inject('gameStore')
@observer
export default class Games extends React.Component {
  render () {
    // Remove this once we have actual data coming in.
    let games = this.props.gameStore.games
    let gamesList = games.map((data) => {
      return <GameBadge opponent={data.opponent} status={data.status} description={data.description} logUrl={data.logUrl} key={data.id} />
    })

    return (
      <div>
        <div className='btn btn-default' onClick={this.props.gameStore.makeDataStale}>Refresh</div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        {gamesList}
      </div>
    )
  }
}

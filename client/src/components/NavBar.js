import { inject } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

@inject('authStore')
export default class NavBar extends React.Component {
  render () {
    let rightSection = (
      <ul className='nav navbar-nav navbar-right'>
        <li><Link to='/register'>Register</Link></li>
        <li><Link className='login-button' to='/login'>Log In</Link></li>
      </ul>
    )

    if (this.props.authStore.isUserLoggedIn) {
      // If the user is logged in, they should have different buttons over on the right side.
      rightSection = (
        <ul className='nav navbar-nav navbar-right'>
          <li><Link to={`/profile/${this.props.authStore.username}`}>Profile</Link></li>
          <li><Link to='/teams'>Invites</Link></li>
          <li><Link to='/create-team'>Teams</Link></li>
          <li><Link to='/logout'>Log Out</Link></li>
        </ul>
      )
    }

    return (
      <nav className='navbar navbar-default mainnavbar'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
            <Link className='navbar-brand' to='/'>MegaminerAI</Link>
          </div>
          <div id='navbar' className='collapse navbar-collapse'>
            <ul className='nav navbar-nav navbar-left'>
              <li><Link className='dashboard' to='/dashboard'>Dashboard</Link></li>
              <li><Link className='leaderboard' to='/leaderboard'>Leaderboard</Link></li>
              <li><a href={process.env.REACT_APP_DOCS_URL}>Docs</a></li>
              <li><a href="http://status.megaminerai.com">Status</a></li>
            </ul>
            {rightSection}
          </div>
        </div>
      </nav>
    )
  }
}

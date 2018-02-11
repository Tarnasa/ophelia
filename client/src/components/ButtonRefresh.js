import React from 'react'

/**
 * ButtonRefresh - used to refresh the current game status
 *
 * Props:
 * buttonOnClick - Prop is called when the refresh button is clicked on
 * disabled - Prop is called if button disabled = true
 */

export default class ButtonRefresh extends React.Component {
  render () {
    if (this.props.disabled) {
      return (
        <button className='btn btn-success' disabled='disabled'>Refresh</button>
      )
    }
    return (
      <a onClick={this.props.buttonOnClick}>{refreshimage}</a>
    )
  }
}

ButtonRefresh.defaultProps = {
  buttonOnClick: alert.bind(null, 'Make me do something!'),
  disabled: false
}

const refreshimage = (
  <svg xmlns='http://www.w3.org/2000/svg' xlinkHref='http://www.w3.org/1999/xlink' viewBox='0 0 26 26' version='1.1' width='52px' height='52px'>
    <g id='surface1'>
      <path d='M 12 0 L 12 2.25 C 6.503906 2.761719 2.1875 7.371094 2.1875 13 C 2.1875 15.933594 3.351563 18.582031 5.25 20.53125 L 7.96875 18.09375 C 6.660156 16.792969 5.84375 14.988281 5.84375 13 C 5.84375 9.390625 8.523438 6.398438 12 5.90625 L 12 8 L 18.40625 4 Z M 20.75 5.46875 L 18.0625 7.90625 C 19.371094 9.207031 20.15625 11.015625 20.15625 13 C 20.15625 16.613281 17.480469 19.574219 14 20.0625 L 14 18 L 7.59375 22 L 14 26 L 14 23.75 C 19.496094 23.238281 23.8125 18.628906 23.8125 13 C 23.8125 10.066406 22.648438 7.417969 20.75 5.46875 Z ' />
    </g>
  </svg>
)

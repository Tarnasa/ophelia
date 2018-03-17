import { distanceInWords } from 'date-fns'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Alert } from 'react-bootstrap'

import UploadButton from '../UploadButton'
import ButtonRefresh from '../ButtonRefresh'

@inject('submissionStore')
@observer
export default class SubmissionInfo extends React.Component {
  render () {
    const statusStyle = {}
    let uploadError
    if (this.props.submissionStore.uploadError) {
      uploadError = (
        <Alert bsStyle='danger' onDismiss={() => { this.props.submissionStore.uploadError = '' }}>
          <p>{this.props.submissionStore.uploadError}</p>
        </Alert>
      )
    }

    if (!this.props.submissionStore.submissions.length) {
      return (
        <div>
          <div className='row'>
            <div className='col-xs-10'>
              <h2>Latest Submission</h2>
            </div>
            <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}>
              <ButtonRefresh buttonOnClick={this.props.submissionStore.makeDataStale} />
            </div>
          </div>
          <div style={{ marginLeft: 10 }}>
            {uploadError}
            <p>
              You haven't uploaded any code. Click the button below to submit some to the Arena.
            </p>
            <UploadButton />
          </div>
        </div>
      )
    }

    let latestSubmission = this.props.submissionStore.submissions[0]
    const uploadedDate = new Date(latestSubmission.createdAt)
    const uploadedTime = distanceInWords(new Date(), uploadedDate, {addSuffix: true})
    let logUrl = (
      <a tabIndex={0} style={{fontWeight: 'bold', cursor: 'not-allowed', color: '#dddddd'}}>
      Build Log
      </a>
    )
    console.log(latestSubmission.logUrl)
    if (latestSubmission.logUrl !== null) {
      logUrl = (
        <a href={latestSubmission.logUrl} style={{ fontWeight: 'bold' }} download>
          Build Log
        </a>
      )

    }

    return (
      <div>
        <div className='row'>
          <div className='col-xs-10'>
            <h2>Latest Submission</h2>
          </div>
          <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}>
            <ButtonRefresh buttonOnClick={this.props.submissionStore.makeDataStale} />
          </div>
        </div>
        
        <div style={{ marginLeft: 10 }} className='row' >
          {uploadError}
          <div>
            <span>Uploaded:</span> ({uploadedTime})  {uploadedDate.toDateString() + ' ' +  uploadedDate.toLocaleTimeString('en-US') }
          </div>
          <div className='row'>
            <div className='col-md-4'>{logUrl}</div>
            <div className='col-md-4'><span style={{ fontWeight: 'bold' }}>Version:</span> {latestSubmission.version}</div>
          </div>
          <p>
            <span style={{ fontWeight: 'bold' }}>Status:</span> <span style={statusStyle} >{latestSubmission.status}</span>
          </p>
          <UploadButton />
        </div>
      </div>
    )
  }
}

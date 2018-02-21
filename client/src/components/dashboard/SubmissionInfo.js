import { distanceInWords } from 'date-fns'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Alert } from 'react-bootstrap'

import UploadButton from '../UploadButton'

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
          <h2>Latest Submission:</h2>
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

    return (
      <div>
        <h1>Latest Submission:</h1>
        <div style={{ marginLeft: 10 }} >
          {uploadError}
          <p>
            <span>Uploaded:</span> ({uploadedTime})  {uploadedDate.toDateString() + ' ' +  uploadedDate.toLocaleTimeString('en-US') }
          </p>
          <p>
            Status: <span style={statusStyle} >{latestSubmission.status}</span>
          </p>
          <UploadButton />
        </div>
      </div>
    )
  }
}

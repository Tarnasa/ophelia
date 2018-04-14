import { distanceInWords } from 'date-fns'
import { Formik } from 'formik'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Alert } from 'react-bootstrap'

import UploadButton from '../UploadButton'
import ButtonRefresh from '../ButtonRefresh'
import { langs } from '../../vars'

// TODO: There might be an argument for not having this here - but I'm just not sure. Should do some research into that. - RD
const langOptions = langs.map(data => <option key={data.slug} value={data.slug}>{data.name}</option>)

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

    const uploadForm = (
      
    )

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
            <div className='col-md-4'><a href={latestSubmission.logUrl} style={{ fontWeight: 'bold' }} download>Build Log</a></div>
            <div className='col-md-4'><span style={{ fontWeight: 'bold' }}>Version:</span> {latestSubmission.version}</div>
          </div>
          <p>
            <span style={{ fontWeight: 'bold' }}>Status:</span> <span style={statusStyle} >{latestSubmission.status}</span>
          </p>
        </div>
      </div>
    )
  }
}

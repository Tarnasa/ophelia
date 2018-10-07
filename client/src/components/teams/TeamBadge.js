import React from 'react'
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns'

export default class TeamBadge extends React.Component {
    render () {
        let updatedDate = new Date(this.props.updatedAt);
        let updatedTime = distanceInWords(new Date(), updatedDate, { addSuffix: true})
        let teamName = this.props
        console.log(JSON.stringify(teamName))

        // Colors of tabled
        let bgColor = "#ccc"

        return(
            <div style={{
                border: '1px solid' + bgColor,
                borderBottom: '2px solid',
                borderBottomColor: bgColor,
                margin: 10,
                marginRight: 0,
                minWidth: '320px',
                paddingRight: 10
            }}>
                <div>
                    <div className='row'>
                        <div className='col-xs-4 col-sm-4 text-center' style={{ height: '100%' }}>
                            <div className='row'>
                                <div style={{ paddingTop: '10px', fontSize: 16 }}>
                                    Team Name:
                                </div>
                                <div className='col-xs-12 text-center' style={{ height: '80%' }}>
                                    <div className='ellipsis' style={{ marginTop: '9%', marginLeft: '20px', fontSize: 18, fontWeight: 'bold'}} >{}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
            </div>
        )
    }
}
import React, { Component, useReducer } from 'react'

export class ApplicationsList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let listOfApplications = this.props.listOfApplications
    let xCorrelator = this.props.xCorrelator
    return (
      <>
        {
          (() => {
            if (typeof listOfApplications !== 'undefined' && listOfApplications.length > 0) {
              let listApplicationsTableBody = [];
              listOfApplications.forEach((applicationDetails, applicationDetailsKey) => {
                listApplicationsTableBody.push(<tbody><tr key = {applicationDetailsKey}>
                  <td> {applicationDetails['application-name']} </td>
                  <td> {applicationDetails['release-number']}</td>
                  <td> {applicationDetails['approval-status']}</td>
                  <td> {applicationDetails['embedding-status']}</td>
                  <td> {applicationDetails['reason-of-failure']}</td>
                  <td> {xCorrelator}</td>
                </tr></tbody>)
              });
              return <table id="table-section" className='mr-top-30'>
                <thead><tr key="listApplicationsTableBody">
                <th>ApplicationName</th>
                <th>ReleaseNumber</th>
                <th>Approval Status</th>
                <th>Embedding Status</th>
                <th>Reason Of Failure Status</th>
                <th>X-Correlator</th>
              </tr></thead>
              {listApplicationsTableBody}</table>
            } else {
              return ""
            }
          })()
        }
      </>
    )
  }
}
export default ApplicationsList;
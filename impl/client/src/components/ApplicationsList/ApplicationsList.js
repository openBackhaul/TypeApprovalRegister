import React, { Component, useReducer } from 'react'

export class ApplicationsList extends Component {

  constructor(props) {
    super(props);
  }

  getTableRowData = (event)=>{
    let tableRow = event.target.closest('tr')
    let tableRowData = tableRow.innerText.split("\t")
    this.props.fillDataOnTableRowClickParentCallback(tableRowData);
  }

  render() {
    let listOfApplications = this.props.listOfApplications
    return (
      <>
        {
          (() => {
            if (typeof listOfApplications !== 'undefined' && listOfApplications.length > 0) {
              let listApplicationsTableBody = [];
              listOfApplications.forEach((applicationDetails, applicationDetailsKey) => {
                listApplicationsTableBody.push(<tbody><tr key = {applicationDetailsKey} className = "applicationListTr" onClick={(event) => this.getTableRowData(event)}>
                  <td> {applicationDetails['application-name']} </td>
                  <td> {applicationDetails['release-number']}</td>
                  <td> {applicationDetails['approval-status']}</td>
                  <td> {applicationDetails['embedding-status']}</td>
                  <td> {applicationDetails['reason-of-failure']}</td>
                  <td> {applicationDetails['x-correlator']}</td>
                </tr></tbody>)
              });
              return <>
              <table id="table-section" className='mr-top-30 application-list'>
                <thead><tr key="listApplicationsTableBody">
                <th>Application Name</th>
                <th>Release Number</th>
                <th>Approval Status</th>
                <th>Embedding Status</th>
                <th>Reason Of Failure</th>
                <th>X-Correlator</th>
              </tr></thead>
              {listApplicationsTableBody}</table>
              <span className='information'>Note: Click on table row to automatically fill the below forms fields with relevant values</span>
              </>
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
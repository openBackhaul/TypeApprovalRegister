import React, { Component, useReducer } from 'react'
import axios from 'axios';
import randExp from 'randexp';

export class UpdateApprovalStatus extends Component {

  constructor(props) {
    super(props);
    this.listApplicationFromUpdatedApprovalStatus = ""
    this.state = {
      applicationName: '',
      releaseNumber: '',
      approvalStatus: '',
      loader: false
    };
    this.Authorization = this.props.authorization
    this.handleSubmitForUpdateApprovalStatus = this.handleSubmitForUpdateApprovalStatus.bind(this);
    this.ERROR_MESSAGES = {
      "401": "Username or Password is incorrect",
      "404": "No data found",
      "500": "Error in Updating Approval Status",
      "other": "Error in Updating Approval Status"
    }
    this.ERROR_STYLING = {
      "warning": "alert alert-warning",
      "danger": "alert alert-danger"
    }
  }

  handleSubmitForUpdateApprovalStatus(event) {
    event.preventDefault();
    this.props.loaderParentCallback(true)
    let requestBody = {}
    requestBody["application-name"] = this.state.applicationName;
    requestBody["release-number"] = this.state.releaseNumber;
    requestBody["approval-status"] = this.state.approvalStatus;

    this.requestforUpdateApprovalStatus(requestBody).then((applicationList) => {
      let message;
      let classname
      let applicationListLength;
      let errorMessage

      if (applicationList.catch) {
        applicationListLength = 0;
        message = applicationList.message
        errorMessage = true
        classname = this.ERROR_STYLING.danger
      } else {
        if (applicationList.data !== undefined) {
          applicationListLength = applicationList.data.length
        } else {
          applicationListLength = applicationList.length
        }

        if (applicationListLength == 0) {
          errorMessage = true
          if (applicationList.status == 200) {
            message = this.ERROR_MESSAGES[404]
            classname = this.ERROR_STYLING.warning
          }
          else if (applicationList.status != 200) {
            message = this.ERROR_MESSAGES[401]
            classname = this.ERROR_STYLING.danger
          }
        }
      }

      let listOfApplications = {
        "applicationList": applicationList,
        "errorMessage": errorMessage,
        "message": message,
        "css": classname,
        "update-approval-status": true
      }

      this.props.loaderParentCallback(false)
      this.props.parentCallback(listOfApplications);
    })
  }

  async requestforUpdateApprovalStatus(requestBody) {
    try {
      let xCorrelator = this.getRandomXCorrelator();
      let requestHeader = {
        'accept': 'application/json',
        'user': 'tar-x-gui-path',
        'originator': 'tar-x-gui-path',
        'x-correlator': xCorrelator,
        'trace-indicator': '1',
        'customer-journey': 'Unknown value',
        'Authorization': this.Authorization,
        'Content-Type': 'application/json'
      }
      let request = {
        method: "post",
        url: origin + "/v1/approve-application-in-gui",
        headers: requestHeader,
        data: requestBody
      }
      let listOfApplications = (await axios(request));
      return (listOfApplications);
    } catch (error) {
      let errorMessage;
      let message
      if (error.toString().includes("401")) {
        message = this.ERROR_MESSAGES[401]
      } else if (error.toString().includes("500")) {
        message = this.ERROR_MESSAGES[500]
      } else {
        message = this.ERROR_MESSAGES.other
      }

      errorMessage = {
        "message": message,
        "catch": true
      }

      return (errorMessage);
    }
  }

  getRandomXCorrelator() {
    let randomXCorrelatorString;
    try {
      randomXCorrelatorString = new randExp(/^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/).gen();
    } catch (error) {
      console.log(error);
    }
    return randomXCorrelatorString;
  }

  render() {
    return (
      <>
        <div className="flex form-container">
          <div className="form section mr-top-30 remove-flex">
            <span className='form-heading'>Update Approval Status</span>
            <div className='mr-top-30'>
              {(this.props.listApplicationsErrorHandling) ? <div className={this.props.listApplicationsErrorHandling.css}>{this.props.listApplicationsErrorHandling.message}</div> : ''}
              <form onSubmit={this.handleSubmitForUpdateApprovalStatus} className="form-section">
                <label>Application Name</label>
                <input type="text" value={this.state.applicationName} onChange={(event) => this.setState({ 'applicationName': event.target.value })} required />
                <label>Release Number </label>
                <input type="text" value={this.state.releaseNumber} onChange={(event) => this.setState({ 'releaseNumber': event.target.value })} required />
                <label>Approval Status</label>
                <select onChange={(event) => this.setState({ 'approvalStatus': event.target.value })}>
                  <option required value="">Please Select Approval Status</option>
                  <option value="REGISTERED">REGISTERED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="BARRED">BARRED</option>
                  <option value="NOT_YET_DEFINED">NOT_YET_DEFINED</option>
                </select>
                <button type="submit">Update Approval Status</button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default UpdateApprovalStatus;
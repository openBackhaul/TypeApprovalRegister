import React, { Component, useReducer } from 'react'
import axios from 'axios';

export class UpdateApprovalStatus extends Component {

  constructor(props) {
    super(props);
    this.listApplicationFromUpdatedApprovalStatus = ""
    this.state = { applicationName: '', releaseNumber: '', approvalStatus: '', listApplicationsForUpdatedApprovalStatus: '' };
    this.Authorization = this.props.authorization
    this.handleSubmitForUpdateApprovalStatus = this.handleSubmitForUpdateApprovalStatus.bind(this);
    this.ERROR_MESSAGES = {
      "401": "Username or Password is incorrect",
      "404": "No data found",
      "500": "Error in fetching data",
      "other": "Error in fetching data"
    }
    const ERROR_STYLING = {
      "warning": "alert alert-warning",
      "danger": "alert alert-danger"
    }
  }

  handleSubmitForUpdateApprovalStatus(event) {
    event.preventDefault();
    let requestBody = {}
    requestBody["application-name"] = this.state.applicationName;
    requestBody["release-number"] = this.state.releaseNumber;
    requestBody["approval-status"] = this.state.approvalStatus;

    this.requestforUpdateApprovalStatus(requestBody).then((applicationList) => {
      this.props.parentCallback(applicationList);
    })
  }

  async requestforUpdateApprovalStatus(requestBody) {
    try {
      let requestHeader = {
        'accept': 'application/json',
        'user': 'tar-x-gui-path',
        'originator': 'tar-x-gui-path',
        'x-correlator': this.props.xCorrelator,
        'trace-indicator': '1',
        'customer-journey': 'Unknown value',
        'Authorization': this.Authorization,
        'Content-Type': 'application/json'
      }
      let request = {
        method: "post",
        url: "http://localhost:3025/v1/approve-application-in-gui",//origin + "/v1/approve-application-in-gui",
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

  render() {
    return (
      <>
        <div className="flex form-container">
          <div className="form section mr-top-30 remove-flex">
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
      </>
    )
  }
}
export default UpdateApprovalStatus;
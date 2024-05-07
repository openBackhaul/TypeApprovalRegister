import React, { Component, useReducer } from 'react'
import axios from 'axios';

export class UpdateEmbeddginStatus extends Component {

  constructor(props) {
    super(props);
    this.listApplicationFromUpdatedApprovalStatus = ""
    this.state = { applicationName: '', releaseNumber: '', documentEmbeddingStatus: '', reasonOfFailure: '', listApplicationsForEmbeddingStatus: '' };
    this.Authorization = this.props.authorization
    this.handleSubmitForEmbeddingStatus = this.handleSubmitForEmbeddingStatus.bind(this);
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

  handleSubmitForEmbeddingStatus(event) {
    event.preventDefault();
    let requestBody = {}
    requestBody["application-name"] = this.state.applicationName;
    requestBody["release-number"] = this.state.releaseNumber;
    
    if((this.state.documentEmbeddingStatus == "true")){
      requestBody["successfully-embedded"] = true
      requestBody["reason-of-failure"] = ""
    }else{
      requestBody["successfully-embedded"] = false
      requestBody["reason-of-failure"] = this.state.reasonOfFailure;
    }


console.log(requestBody, requestBody["successfully-embedded"])
    this.requestforUpdateEmbeddingStatus(requestBody).then((applicationList) => {
      this.props.parentCallback(applicationList);
    })
  }

  async requestforUpdateEmbeddingStatus(requestBody) {
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
        url: "http://localhost:3025/v1/document-embedding-status-in-gui",//origin + "/v1/approve-application-in-gui",
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
            <form onSubmit={this.handleSubmitForEmbeddingStatus} className="form-section">
              <label>Application Name</label>
              <input type="text" value={this.state.applicationName} onChange={(event) => this.setState({ 'applicationName': event.target.value })} required />
              <label>Release Number </label>
              <input type="text" value={this.state.releaseNumber} onChange={(event) => this.setState({ 'releaseNumber': event.target.value })} required />
              <label>Embedding Status</label>
              <select required onChange={(event) => this.setState({ 'documentEmbeddingStatus': event.target.value })}>
              <option value="">Please Select Embedding Status</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              {
                (this.state.documentEmbeddingStatus == 'false') ? [<label>Reason Of Failure</label>, <input type="text" value={this.state.reasonOfFailure} onChange={(event) => this.setState({ 'reasonOfFailure': event.target.value })} /> ]: ""
              }
              <button type="submit">Update Embedding Status</button>
            </form>
          </div>
        </div>
      </>
    )
  }
}
export default UpdateEmbeddginStatus;
import React, { Component, useReducer } from 'react'
import axios from 'axios';
import randExp from 'randexp';

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
      "500": "Error in Updateing Embedding Status",
      "other": "Error in Updateing Embedding Status"
    }
    this.ERROR_STYLING = {
      "warning": "alert alert-warning",
      "danger": "alert alert-danger"
    }
  }

  handleSubmitForEmbeddingStatus(event) {
    event.preventDefault();
    this.props.loaderParentCallback(true)
    let requestBody = {}
    requestBody["application-name"] = this.state.applicationName;
    requestBody["release-number"] = this.state.releaseNumber;

    if ((this.state.documentEmbeddingStatus == "true")) {
      requestBody["successfully-embedded"] = true
      requestBody["reason-of-failure"] = ""
    } else {
      requestBody["successfully-embedded"] = false
      requestBody["reason-of-failure"] = this.state.reasonOfFailure;
    }

    this.requestforUpdateEmbeddingStatus(requestBody).then((applicationList) => {
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
        "update-embedding-status": true
      }
      this.props.loaderParentCallback(false)
      this.props.parentCallback(listOfApplications);
    })
  }

  async requestforUpdateEmbeddingStatus(requestBody) {
    try {
      let xCorrelator = this.getRandomXCorrelator();
      this.props.xCorrelatorrParentCallback(xCorrelator)
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
        url: origin + "/v1/document-embedding-status-in-gui",
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
    if (this.props.tableRowClicked) {
      if (this.props.dataOnTableRowClick != undefined && this.props.dataOnTableRowClick.length > 0) {
        this.state.applicationName = this.props.dataOnTableRowClick[0]
        this.state.releaseNumber = this.props.dataOnTableRowClick[1]
        this.state.documentEmbeddingStatus = this.props.dataOnTableRowClick[3]
        this.state.reasonOfFailure = this.props.dataOnTableRowClick[4]
      }
    }
    return (
      <>
        <div className="flex form-container">
          <div className="form section mr-top-30 remove-flex">
            <span className='form-heading'>Update Document Embedding Status</span>
            <div className='mr-top-30'>
              {(this.props.listApplicationsErrorHandling) ? <div className={this.props.listApplicationsErrorHandling.css}>{this.props.listApplicationsErrorHandling.message}</div> : ''}
              <form onSubmit={this.handleSubmitForEmbeddingStatus} className="form-section">
                <label>Application Name</label>
                <input type="text" value={this.state.applicationName} onChange={(event) => {this.props.fillDataOnTableRowClickParentCallback(false); this.setState({ 'applicationName': event.target.value })}} required />
                <label>Release Number </label>
                <input type="text" value={this.state.releaseNumber} onChange={(event) => {this.props.fillDataOnTableRowClickParentCallback(false); this.setState({ 'releaseNumber': event.target.value })}} required />
                <label>Embedding Status</label>
                <select required onChange={(event) => {this.props.fillDataOnTableRowClickParentCallback(false); this.setState({ 'documentEmbeddingStatus': event.target.value })}} value={this.state.documentEmbeddingStatus}>
                  <option value="">Please Select Embedding Status</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
                {
                  (this.state.documentEmbeddingStatus == 'false') ? [<label>Reason Of Failure</label>, <input type="text" value={this.state.reasonOfFailure} onChange={(event) => {this.props.fillDataOnTableRowClickParentCallback(false); this.setState({ 'reasonOfFailure': event.target.value })}} />] : ""
                }
                <button type="submit">Update Embedding Status</button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default UpdateEmbeddginStatus;
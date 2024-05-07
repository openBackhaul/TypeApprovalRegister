import React, { Component, useReducer } from 'react'
import axios from 'axios';
import randExp from 'randexp';
import { Buffer } from 'buffer';
import ApplicationsList from "../ApplicationsList/ApplicationsList"
import UpdateApprovalStatus from "../UpdateApprovalStatus/UpdateApprovalStatus"
import UpdateEmbeddginStatus from "../UpdateEmbeddginStatus/UpdateEmbeddginStatus"
import './GetUpdatedApplicationList.css';

export class GetUpdatedApplicationList extends Component {

  constructor(props) {
    super(props);
    this.Authorization = ""
    this.state = {
      username: '',
      password: '',
      xCorrelator: '',
      listApplications: '',
      listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus: ''
    };
    this.handleSubmitForListApplicationForm = this.handleSubmitForListApplicationForm.bind(this);
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

  handleSubmitForListApplicationForm(event) {
    event.preventDefault();
    let userName = this.state.username;
    let password = this.state.password;
    let basicAuth = "Basic " + Buffer.from(userName + ":" + password).toString('base64');
    this.Authorization = basicAuth
    this.getchListOfApplications().then((applicationList) => {
      this.setListApplicationData(applicationList)
    })
  }

  setListApplicationData(applicationList) {
    this.setState({ 'listApplications': applicationList })
  }

  async getchListOfApplications() {
    try {
      let xCorrelator = this.getRandomXCorrelator();
      this.setState({ "xCorrelator": xCorrelator })
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
      let requestBody = {}
      let request = {
        method: "post",
        url: "http://localhost:3025/v1/list-applications-in-gui",//origin + "/v1/list-applications-in-gui",
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

  handleCallback = (childData) => {
    this.setState({ listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus: childData });
  }

  render() {
    return (
      <>
        <div className="flex form-container">
          <div className="form section">
            <form onSubmit={this.handleSubmitForListApplicationForm} className="form-section">
              <label>Username</label>
              <input type="text" value={this.state.username} onChange={(event) => this.setState({ 'username': event.target.value })} required />
              <label>Password </label>
              <input type="password" value={this.state.password} onChange={(event) => this.setState({ 'password': event.target.value })} required />
              <button type="submit">Update List</button>
            </form>
          </div>
        </div>
        {
          (() => {
            let xCorrelator = this.state.xCorrelator
            let UpdatedApprovalStatusAndEmbeddingStatus = false

            if (typeof this.state.listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus.data !== 'undefined' && this.state.listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus.data.length > 0) {
              UpdatedApprovalStatusAndEmbeddingStatus = true
            }
            if (!UpdatedApprovalStatusAndEmbeddingStatus) {
              if (typeof this.state.listApplications.data !== 'undefined' && this.state.listApplications.data.length > 0) {
                let listApplications = this.state.listApplications.data
                return <ApplicationsList listOfApplications={listApplications} xCorrelator={xCorrelator} />
              }
            }
            
            if (typeof this.state.listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus.data !== 'undefined' && this.state.listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus.data.length > 0) {
              let listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus = this.state.listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus.data
             return <ApplicationsList listOfApplications={listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus} xCorrelator={xCorrelator} />
            }

          })()
        }
        <div className='flex-section'>
        {
          (() => {
            if (typeof this.state.listApplications.data !== 'undefined' && this.state.listApplications.data.length > 0) {
              return [
              <UpdateApprovalStatus authorization={this.Authorization} listOfApplications={this.state.listApplications.data} xCorrelator={this.state.xCorrelator} parentCallback={this.handleCallback} />,
              <UpdateEmbeddginStatus authorization={this.Authorization} listOfApplications={this.state.listApplications.data} xCorrelator={this.state.xCorrelator} parentCallback={this.handleCallback} />
              ]
            }

          })()
        }
        </div>
      </>
    )
  }
}
export default GetUpdatedApplicationList;
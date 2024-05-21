import React, { Component, useReducer } from 'react'
import axios from 'axios';
import randExp from 'randexp';
import { Buffer } from 'buffer';
import ApplicationsList from "../ApplicationsList/ApplicationsList"
import UpdateApprovalStatus from "../UpdateApprovalStatus/UpdateApprovalStatus"
import UpdateEmbeddginStatus from "../UpdateEmbeddginStatus/UpdateEmbeddginStatus"
import Spinner from '../Spinner/Spinner'
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
      listApplicationsFromUpdatedApprovalStatusAndEmbeddingStatus: '',
      loader: false,
      listApplicationsErrorHandlingForUpdateApprovalStatus: '',
      listApplicationsErrorHandlingForUpdateEmbeddingStatus: ''
    };
    this.handleSubmitForListApplicationForm = this.handleSubmitForListApplicationForm.bind(this);
    this.ERROR_MESSAGES = {
      "401": "Username or Password is incorrect",
      "404": "No data found",
      "500": "Error in fetching data",
      "other": "Error in fetching data"
    }
    this.ERROR_STYLING = {
      "warning": "alert alert-warning",
      "danger": "alert alert-danger"
    }
  }

  handleSubmitForListApplicationForm(event) {
    event.preventDefault();
    this.setState({ "loader": true })
    let userName = this.state.username;
    let password = this.state.password;
    let basicAuth = "Basic " + Buffer.from(userName + ":" + password).toString('base64');
    this.Authorization = basicAuth
    this.getchListOfApplications().then((applicationList) => {
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
        "css": classname
      }

      this.setListApplicationData(listOfApplications)
    })
  }

  setListApplicationData(applicationList) {
    this.setState({ 'listApplications': applicationList, 'loader': false })
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
        url: origin + "/v1/list-applications-in-gui",
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
    if (!childData.applicationList.catch) {
      this.setState({ listApplications: childData });
      this.setState({ listApplicationsErrorHandlingForUpdateApprovalStatus: "" })
      this.setState({ listApplicationsErrorHandlingForUpdateEmbeddingStatus: "" })
    } else {
      if (childData["update-approval-status"]) {
        this.setState({ listApplicationsErrorHandlingForUpdateApprovalStatus: childData })
      }
      if (childData["update-embedding-status"]) {
        this.setState({ listApplicationsErrorHandlingForUpdateEmbeddingStatus: childData })
      }
    }
  }

  loaderHandleCallback = (childData) => {
    this.setState({ loader: childData });
  }

  xCorrelatorHandleCallback = (childData) => {
    this.setState({ xCorrelator: childData });
  }

  render() {
    if (this.state.loader) {
      return <Spinner />
    } else {
      return (
        <>
          <div className="flex form-container">
            <div className="form section">
              {(this.state.listApplications.errorMessage) ? <div className={this.state.listApplications.css}>{this.state.listApplications.message}</div> : ''}
              <form onSubmit={this.handleSubmitForListApplicationForm} className="form-section">
                <label>Username</label>
                <input type="text" value={this.state.username} onChange={(event) => this.setState({ 'username': event.target.value })} required />
                <label>Password </label>
                <input type="password" value={this.state.password} onChange={(event) => this.setState({ 'password': event.target.value })} required />
                <button type="submit">Fetch Updated List</button>
              </form>
            </div>
          </div>
          {
            (() => {
              if (this.state.listApplications.applicationList != undefined) {
                let applicationListData = this.state.listApplications.applicationList
                let xCorrelator = this.state.xCorrelator
                if (typeof applicationListData.data !== 'undefined' && applicationListData.data.length > 0) {
                  let listApplications = applicationListData.data
                  return <ApplicationsList listOfApplications={listApplications} isLoading={this.state.loader} />
                }
              }
            })()
          }
          <div className='flex-section'>
            {
              (() => {
                if (this.state.listApplications.applicationList != undefined) {
                  let applicationListData = this.state.listApplications.applicationList
                  if (typeof applicationListData.data !== 'undefined' && applicationListData.data.length > 0) {
                    return [
                      <UpdateApprovalStatus authorization={this.Authorization} parentCallback={this.handleCallback} loaderParentCallback={this.loaderHandleCallback} xCorrelatorrParentCallback={this.xCorrelatorHandleCallback} listApplicationsErrorHandling={this.state.listApplicationsErrorHandlingForUpdateApprovalStatus} />,
                      <UpdateEmbeddginStatus authorization={this.Authorization} parentCallback={this.handleCallback} loaderParentCallback={this.loaderHandleCallback} xCorrelatorrParentCallback={this.xCorrelatorHandleCallback} listApplicationsErrorHandling={this.state.listApplicationsErrorHandlingForUpdateEmbeddingStatus} />
                    ]
                  }
                }
              })()
            }
          </div>
        </>
      )
    }
  }
}
export default GetUpdatedApplicationList;
'use strict';
var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

/**
 * Returns the name of the application
 *
 * uuid String 
 * returns inline_response_200_9
 **/
exports.getApplicationProfileApplicationName = function(url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "application-profile-1-0:application-name": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {}
    reject();
  });
}


/**
 * Returns the configured value of the approval status
 *
 * uuid String 
 * returns inline_response_200_11
 **/
exports.getApplicationProfileApprovalStatus = function(url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "application-profile-1-0:approval-status": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {}
    reject();
  });
}


/**
 * Returns the release number of the application
 *
 * uuid String 
 * returns inline_response_200_10
 **/
exports.getApplicationProfileReleaseNumber = function(url) {
 return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "application-profile-1-0:release-number": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {}
    reject();
  });
}


/**
 * Configures the approval status
 *
 * body Applicationprofileconfiguration_approvalstatus_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putApplicationProfileApprovalStatus = function(body,url) {
  return new Promise(async function (resolve, reject) {
    try {
      await fileOperation.writeToDatabaseAsync(url, body, false);
      resolve();
    } catch (error) {}
    reject();
  });
}


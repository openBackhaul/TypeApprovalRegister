'use strict';

const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

/**
 * Returns the name of the application
 *
 * url String 
 * returns inline_response_200_9
 **/
exports.getApplicationProfileApplicationName = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "application-profile-1-0:application-name": value
  };
}

/**
 * Returns the configured value of the approval status
 *
 * url String 
 * returns inline_response_200_11
 **/
exports.getApplicationProfileApprovalStatus = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "application-profile-1-0:approval-status": value
  };
}

/**
 * Returns the release number of the application
 *
 * url String 
 * returns inline_response_200_10
 **/
exports.getApplicationProfileReleaseNumber = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "application-profile-1-0:release-number": value
  };
}

/**
 * Configures the approval status
 *
 * body Applicationprofileconfiguration_approvalstatus_body 
 * url String 
 * no response value expected for this operation
 **/
exports.putApplicationProfileApprovalStatus = async function (body, url) {
  await fileOperation.writeToDatabaseAsync(url, body, false);
}

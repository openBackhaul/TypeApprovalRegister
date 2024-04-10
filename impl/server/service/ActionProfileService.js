'use strict';

const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

/**
 * Returns Consequent Operation Reference
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getActionProfileConsequentOperationReference = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "action-profile-1-0:consequent-operation-reference": value
  };
}

/**
 * Returns Display in new browser window
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getActionProfileDisplayInNewBrowserWindow = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "action-profile-1-0:display-in-new-browser-window": value
  };
}

/**
 * Returns Consequent Operation Reference
 *
 * url String 
 * returns inline_response_200_28
 **/
exports.getActionProfileInputValueListt = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "action-profile-1-0:input-value-list": value
  };
}

/**
 * Returns Profile Label
 *
 * url String 
 * returns inline_response_200_28
 **/
exports.getActionProfileLabel = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "action-profile-1-0:label": value
  };
}

/**
 * Returns Profile Operartion Name
 *
 * url String 
 * returns inline_response_200_28
 **/
exports.getActionProfileOperationName = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "action-profile-1-0:operation-name": value
  };
}

/**
 * Configures Profile Consequent Operation Reference
 * no response value expected for this operation
 **/
exports.putActionProfileConsequentOperationReference = async function (url, body) {
  await fileOperation.writeToDatabaseAsync(url, body, false);
}

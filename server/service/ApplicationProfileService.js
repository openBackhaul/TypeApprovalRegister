'use strict';


/**
 * Returns the name of the application
 *
 * uuid String 
 * returns inline_response_200_9
 **/
exports.getApplicationProfileApplicationName = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "application-profile-1-0:application-name" : "RegistryOffice"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns the configured value of the approval status
 *
 * uuid String 
 * returns inline_response_200_11
 **/
exports.getApplicationProfileApprovalStatus = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "application-profile-1-0:approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns the release number of the application
 *
 * uuid String 
 * returns inline_response_200_10
 **/
exports.getApplicationProfileReleaseNumber = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "application-profile-1-0:release-number" : "0.0.1"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Configures the approval status
 *
 * body Applicationprofileconfiguration_approvalstatus_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putApplicationProfileApprovalStatus = function(body,uuid) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


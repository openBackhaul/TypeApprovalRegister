'use strict';

var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

/**
 * Returns profile Datatype
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getGenericResponseProfileDatatype = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "response-profile-1-0:datatype": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

/**
 * Returns Description
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getGenericResponseProfileDescription = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "response-profile-1-0:description": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

/**
 * Returns Field Name
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getGenericResponseProfileFieldName = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "response-profile-1-0:field-name": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

/**
 * Returns Operation Name
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getGenericResponseProfileOperationName = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "response-profile-1-0:operation-name": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

/**
 * Returns  Profile Value=
 *
 * uuid String 
 * returns inline_response_200_28
 **/
exports.getGenericResponseProfileValue = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      var value = await fileOperation.readFromDatabaseAsync(url);
      var response = {};
      response['application/json'] = {
        "response-profile-1-0:value": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject();
    }
  });
}

/**
 * Configures the Value of the Field
 *
 * body Responseprofileconfiguration_value_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putGenericResponseProfileValue = function (url, body) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log(typeof body)
      await fileOperation.writeToDatabaseAsync(url, body, false);
      resolve();
    } catch (error) {
      reject();
    }
  });
}
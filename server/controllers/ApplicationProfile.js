'use strict';

var utils = require('../utils/writer.js');
var ApplicationProfile = require('../service/ApplicationProfileService');

module.exports.getApplicationProfileApplicationName = function getApplicationProfileApplicationName (req, res, next, uuid) {
  ApplicationProfile.getApplicationProfileApplicationName(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getApplicationProfileApprovalStatus = function getApplicationProfileApprovalStatus (req, res, next, uuid) {
  ApplicationProfile.getApplicationProfileApprovalStatus(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getApplicationProfileReleaseNumber = function getApplicationProfileReleaseNumber (req, res, next, uuid) {
  ApplicationProfile.getApplicationProfileReleaseNumber(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putApplicationProfileApprovalStatus = function putApplicationProfileApprovalStatus (req, res, next, body, uuid) {
  ApplicationProfile.putApplicationProfileApprovalStatus(body, uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

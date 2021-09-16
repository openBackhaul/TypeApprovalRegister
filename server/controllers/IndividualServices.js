'use strict';

var utils = require('../utils/writer.js');
var IndividualServices = require('../service/IndividualServicesService');

module.exports.disregardApplication = function disregardApplication (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.disregardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.documentApprovalStatus = function documentApprovalStatus (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.documentApprovalStatus(body, user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listApplications = function listApplications (req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.listApplications(user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listApprovedApplicationsInGenericRepresentation = function listApprovedApplicationsInGenericRepresentation (req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.listApprovedApplicationsInGenericRepresentation(user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.notifyDocumentationOfAnApprovalStatus = function notifyDocumentationOfAnApprovalStatus (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.notifyDocumentationOfAnApprovalStatus(body, user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.regardApplication = function regardApplication (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  IndividualServices.regardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

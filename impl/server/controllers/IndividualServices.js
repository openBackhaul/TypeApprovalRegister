'use strict';

var responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
var restResponseHeader = require('onf-core-model-ap/applicationPattern/rest/server/ResponseHeader');
var restResponseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
var ExecutionAndTraceService = require('onf-core-model-ap/applicationPattern/services/ExecutionAndTraceService');
var IndividualServices = require('../service/IndividualServicesService');

module.exports.approveApplicationInGui = async function approveApplicationInGui(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await IndividualServices.approveApplicationInGui(body, user, xCorrelator, traceIndicator, customerJourney)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.bequeathYourDataAndDie = async function bequeathYourDataAndDie(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.bequeathYourDataAndDie(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.disregardApplication = async function disregardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.disregardApplication(body)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.documentApprovalStatus = async function documentApprovalStatus(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.documentApprovalStatus(body, user, xCorrelator, traceIndicator, customerJourney)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.documentEmbeddingStatus = async function documentEmbeddingStatus(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.documentEmbeddingStatus(body, req)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.documentEmbeddingStatusInGui = async function documentEmbeddingStatusInGui(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await IndividualServices.documentEmbeddingStatusInGui(body, user, xCorrelator, traceIndicator, customerJourney)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.listApplications = async function listApplications(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await IndividualServices.listApplications(user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.listApplicationsInGui = async function listApplicationsInGui(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await IndividualServices.listApplicationsInGui(user, xCorrelator, traceIndicator, customerJourney)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
}

module.exports.listApprovedApplicationsInGenericRepresentation = async function listApprovedApplicationsInGenericRepresentation(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await IndividualServices.listApprovedApplicationsInGenericRepresentation(req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.redirectInfoAboutApprovalStatusChanges = async function redirectInfoAboutApprovalStatusChanges(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.redirectInfoAboutApprovalStatusChanges(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};

module.exports.regardApplication = async function regardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await IndividualServices.regardApplication(body, user, xCorrelator, traceIndicator, customerJourney)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, -1);
      let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  let execTime = await restResponseHeader.executionTimeInMilliseconds(startTime);
  if (!execTime) execTime = 0;
  else execTime = Math.round(execTime);
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument, execTime);
};
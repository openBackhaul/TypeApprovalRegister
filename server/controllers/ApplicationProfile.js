'use strict';

var ApplicationProfile = require('../service/ApplicationProfileService');
var authorizingService = require('onf-core-model-ap-bs/basicServices/AuthorizingService');
var responseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
var responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
var oamLogService = require('onf-core-model-ap-bs/basicServices/OamLogService');

module.exports.getApplicationProfileApplicationName = async function getApplicationProfileApplicationName(req, res, next, uuid) {
  let responseCode = responseCodeEnum.code.OK;
  await ApplicationProfile.getApplicationProfileApplicationName(req.url)
      .then(function (response) {
        responseBuilder.buildResponse(res, responseCode, response);
      })
      .catch(function (response) {
        responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
        responseBuilder.buildResponse(res, responseCode, response);
      });
  oamLogService.recordOamRequest(req.url, req.body, responseCode, req.headers.authorization, req.method);
};

module.exports.getApplicationProfileApprovalStatus = async function getApplicationProfileApprovalStatus(req, res, next, uuid) {
  let responseCode = responseCodeEnum.code.OK;
  await ApplicationProfile.getApplicationProfileApprovalStatus(req.url)
      .then(function (response) {
        responseBuilder.buildResponse(res, responseCode, response);
      })
      .catch(function (response) {
        responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
        responseBuilder.buildResponse(res, responseCode, response);
      });
  oamLogService.recordOamRequest(req.url, req.body, responseCode, req.headers.authorization, req.method);
};

module.exports.getApplicationProfileReleaseNumber = async function getApplicationProfileReleaseNumber(req, res, next, uuid) {
  let responseCode = responseCodeEnum.code.OK;
  await ApplicationProfile.getApplicationProfileReleaseNumber(req.url)
      .then(function (response) {
        responseBuilder.buildResponse(res, responseCode, response);
      })
      .catch(function (response) {
        responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
        responseBuilder.buildResponse(res, responseCode, response);
      });
  oamLogService.recordOamRequest(req.url, req.body, responseCode, req.headers.authorization, req.method);
};

module.exports.putApplicationProfileApprovalStatus = async function putApplicationProfileApprovalStatus(req, res, next, body, uuid) {
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  await ApplicationProfile.putApplicationProfileApprovalStatus(body, req.url)
      .then(function (response) {
        responseBuilder.buildResponse(res, responseCode, response);
      })
      .catch(function (response) {
        responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
        responseBuilder.buildResponse(res, responseCode, response);
      });
  oamLogService.recordOamRequest(req.url, req.body, responseCode, req.headers.authorization, req.method);
};
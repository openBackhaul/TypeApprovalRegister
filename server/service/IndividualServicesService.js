'use strict';

const profile = require('../applicationPattern/onfModel/models/Profile');
const applicationProfile = require('../applicationPattern/onfModel/models/profile/ApplicationProfile');
const ProfileCollection = require('../applicationPattern/onfModel/models/ProfileCollection');
const consequentAction = require('../applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('../applicationPattern/rest/server/responseBody/ResponseValue');
const onfAttributeFormatter = require('../applicationPattern/onfModel/utility/OnfAttributeFormatter');
const httpClientInterface = require('../applicationPattern/onfModel/models/layerprotocols/HttpClientInterface');
const logicalTerminationPoint = require('../applicationPattern/OnfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('../applicationPattern/OnfModel/models/layerprotocols/TcpClientInterface');
const operationServerInterface = require('../applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const softwareUpgrade = require('../applicationPattern/softwareUpgrade/BequeathYourDataAndDie');
const forwardingConstructService = require('../applicationPattern/onfModel/services/ForwardingConstructService');
const logicalTerminationPointService = require('../applicationPattern/onfModel/services/LogicalTerminationPointService');
const tcpServerInterface = require('../applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const httpServerInterface = require('../applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');

const serviceType = "Individual";
const protocol = "http";
const applicationPrefix = "tar";
/**
 * Initiates process of embedding a new release
 *
 * body V1_bequeathyourdataanddie_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.bequeathYourDataAndDie = function (body, user, originator, xCorrelator, traceIndicator, customerJourney,originalUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let newApplicationName = body["new-application-name"];
      let newReleaseNumber = body["new-application-release"];
      let newApplicationAddress = body["new-application-address"];
      let newApplicationPort = body["new-application-port"];
      /*********************************************************************************************************
       * Prepare attributes and configure logical-termination-point
       * 1. Check if the new-application-name is same as the application-name in the http-server/capability
       * 2. If the new-application-name is not equals to application-name , then return 500 response code
       * 3. configure the newRelease http and tcp client
       *********************************************************************************************************/
      let currentApplicationName = await httpServerInterface.getApplicationName();
      if (currentApplicationName != newApplicationName) {
        throw 500;
      }
      let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidForTheApplicationName("NewRelease");
      let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpList(newReleaseHttpClientUuid))[0];
      await httpClientInterface.setReleaseNumber(newReleaseHttpClientUuid, newReleaseNumber);
      await tcpClientInterface.setTcpRemoteAddressAndPortForTheUuid(newReleaseTcpClientUuid, newApplicationAddress, newApplicationPort);

      /*********************************************************************************************************************************
       * Prepare attributes to configure forwarding-construct
       *********************************************************************************************************************************/
      let forwardingConstructConfigurationList = [];

      /*********************************************************************************************************************************
       * Prepare attributes to automate forwarding-construct
       * 1. Prepare object for newReleaseHttpClientUuid and update it to Application layer topology using /update-ltp
       * 2. Prepare object for newReleaseTcpClientUuid and update it to Application layer topology using /update-ltp
       ********************************************************************************************************************************/
      let attributeList = [];

      /********************************************************************************************************************************
       * Configure and automate forwarding construct
       *******************************************************************************************************************************/
      let operationServerUuid = await operationServerInterface.getOperationServerUuidForTheOperationName(originalUrl);
      await forwardingConstructService.configureAndAutomateForwardingConstruct(true, serviceType, operationServerUuid,
        forwardingConstructConfigurationList, attributeList, user, xCorrelator, traceIndicator, customerJourney);
      softwareUpgrade.upgradeSoftwareVersion(user, xCorrelator, traceIndicator, customerJourney);
      resolve();
    } catch (error) {
      reject();
    }
  });
}


/**
 * Deletes the record of an application
 *
 * body V1_disregardapplication_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.disregardApplication = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, originalUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["application-name"];
      let releaseNumber = body["application-release-number"];

      /****************************************************************************************
       * configure application profile with the new application if it is not already exist
       ****************************************************************************************/
      let isApplicationExists = await applicationProfile.isProfileExists(applicationName, releaseNumber);
      if (isApplicationExists) {
        let profileUuid = await applicationProfile.getProfileUuid(applicationName, releaseNumber);
        await ProfileCollection.deleteProfile(profileUuid);
      }
      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/
      let forwardingConstructConfigurationList = [];

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let attributeList = [];

      /****************************************************************************************
       * Configure and automate forwarding construct
       ****************************************************************************************/
      let operationServerUuid = await operationServerInterface.getOperationServerUuidForTheOperationName(originalUrl);
      forwardingConstructService.configureAndAutomateForwardingConstruct(true, serviceType, operationServerUuid,
        forwardingConstructConfigurationList, attributeList,
        user, xCorrelator, traceIndicator, customerJourney);
      resolve();
    } catch (error) {
      reject();
    }
  });
}


/**
 * Creates or updates the approval status of an application
 *
 * body V1_documentapprovalstatus_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.documentApprovalStatus = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, originalUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["application-name"];
      let releaseNumber = body["application-release-number"];
      let approvalStatus = body["approval-status"];
      /****************************************************************************************
       * configure application profile with the new application if it is not already exist
       ****************************************************************************************/
      let isApplicationExists = await applicationProfile.isProfileExists(applicationName, releaseNumber);
      approvalStatus = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum[approvalStatus];
      if (isApplicationExists) {
        await applicationProfile.setApprovalStatus(applicationName, releaseNumber, approvalStatus);
      } else {
        let profileAttributes = {
          "application-name": applicationName,
          "application-release-number": releaseNumber,
          "approval-status": approvalStatus
        };
        await applicationProfile.createProfile(profileAttributes);
      }
      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/
      let forwardingConstructConfigurationList = [];

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let approvalStatusJsonObject = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
      for (let approvalStatusKey in approvalStatusJsonObject) {
        if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
          approvalStatus = approvalStatusKey;
        }
      }
      let attributeList = [{
          "name": "application-name",
          "value": applicationName
        },
        {
          "name": "application-release-number",
          "value": releaseNumber
        },
        {
          "name": "approval-status",
          "value": approvalStatus
        }
      ];
      /****************************************************************************************
       * Configure and automate forwarding construct
       ****************************************************************************************/
      let operationServerUuid = await operationServerInterface.getOperationServerUuidForTheOperationName(originalUrl);
      forwardingConstructService.configureAndAutomateForwardingConstruct(true, serviceType, operationServerUuid,
        forwardingConstructConfigurationList, attributeList,
        user, xCorrelator, traceIndicator, customerJourney);
      resolve();
    } catch (error) {
      reject();
    }
  });
}


/**
 * Provides list of applications
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns List
 **/
exports.listApplications = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    var response = {};
    try {
      /****************************************************************************************
       * Preparing response body
       ****************************************************************************************/
      let applicationList = [];
      let applicationProfileList = await profile.getUuidListForTheProfileName(applicationProfile.profileNameEnum.APPLICATION_PROFILE);
      for (let i = 0; i < applicationProfileList.length; i++) {
        let uuid = applicationProfileList[i];
        let applicationName = await applicationProfile.getApplicationNameForTheUuid(uuid);
        let releaseNumber = await applicationProfile.getApplicationReleaseNumberForTheUuid(uuid);
        let approvalStatus = await applicationProfile.getApprovalStatusForTheUuid(uuid);
        let approvalStatusJsonObject = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
        for (let approvalStatusKey in approvalStatusJsonObject) {
          if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
            approvalStatus = approvalStatusKey;
          }
        }
        let application = {
          "application-name": applicationName,
          "application-release-number": releaseNumber,
          "approval-status": approvalStatus
        };
        applicationList.push(application);
      }
      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = applicationList;
    } catch (error) {
      reject();
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Provides list of approved applications in generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200_2
 **/
exports.listApprovedApplicationsInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = [];

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = [];
      let applicationProfileList = await profile.getUuidListForTheProfileName(applicationProfile.profileNameEnum.APPLICATION_PROFILE);
      for (let i = 0; i < applicationProfileList.length; i++) {
        let uuid = applicationProfileList[i];
        let approvalStatus = await applicationProfile.getApprovalStatusForTheUuid(uuid);
        if (approvalStatus == applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum.APPROVED) {
          let applicationName = await applicationProfile.getApplicationNameForTheUuid(uuid);
          let releaseNumber = await applicationProfile.getApplicationReleaseNumberForTheUuid(uuid);
          let reponseValue = new responseValue(applicationName, releaseNumber, typeof applicationName);
          responseValueList.push(reponseValue);
        }
      }

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Offers subscribing to notifications about documentation of an approval status
 *
 * body V1_redirectinfoaboutapprovalstatuschanges_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.redirectInfoAboutApprovalStatusChanges = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, originalUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["subscriber-application"];
      let releaseNumber = body["subscriber-release-number"];
      let subscriberAddress = body["subscriber-address"];
      let subscriberPort = body["subscriber-port"];
      let subscriberOperation = body["subscriber-operation"];

      /****************************************************************************************
       * Prepare attributes and configure logical-termination-point
       ****************************************************************************************/
      let operationList = [subscriberOperation];
      let createdOperationInstanceInformationList = await logicalTerminationPointService.updateLogicalTerminationPointInstanceGroup(applicationName, releaseNumber, subscriberAddress,
        subscriberPort, operationList);

      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/
      let forwardingConstructConfigurationList = [];
      if (createdOperationInstanceInformationList.length > 0) {
        let requestApplicationApprovalUuid = createdOperationInstanceInformationList[0].uuid;
        forwardingConstructConfigurationList = [{
            "forwardingName": "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice",
            "OperationClientUuid": requestApplicationApprovalUuid
          },
          {
            "forwardingName": "UpdateOfApprovalStatusCausesInfoToRegistryOffice",
            "OperationClientUuid": requestApplicationApprovalUuid
          }
        ];
        /****************************************************************************************
         * Prepare attributes to automate forwarding-construct
         ****************************************************************************************/
        let attributeList = [];

        /****************************************************************************************
         * Configure and automate forwarding construct
         ****************************************************************************************/
        let operationServerUuid = await operationServerInterface.getOperationServerUuidForTheOperationName(originalUrl);
        forwardingConstructService.configureAndAutomateForwardingConstruct(true, serviceType, operationServerUuid,
          forwardingConstructConfigurationList, attributeList,
          user, xCorrelator, traceIndicator, customerJourney);
      }
      resolve();
    } catch (error) {
      reject();
    }
  });
}


/**
 * Adds to the list of applications
 *
 * body V1_regardapplication_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.regardApplication = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, originalUrl) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["application-name"];
      let releaseNumber = body["application-release-number"];

      /****************************************************************************************
       * configure application profile with the new application if it is not already exist
       ****************************************************************************************/
      let isApplicationExists = await applicationProfile.isProfileExists(applicationName, releaseNumber);
      let profileUuid;
      let approvalStatus;
      if (!isApplicationExists) {
        approvalStatus = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum.REGISTERED;
        let profileAttributes = {
          "application-name": applicationName,
          "application-release-number": releaseNumber,
          "approval-status": approvalStatus
        };
        profileUuid = await applicationProfile.createProfile(profileAttributes);
      } else {
        profileUuid = await applicationProfile.getProfileUuid(applicationName, releaseNumber);
        approvalStatus = await applicationProfile.getApprovalStatus(applicationName, releaseNumber);
      }
      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/
      let forwardingConstructConfigurationList = [];

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let approvalStatusJsonObject = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
      for (let approvalStatusKey in approvalStatusJsonObject) {
        if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
          approvalStatus = approvalStatusKey;
        }
      }
      let attributeList = [{
          "name": "application-name",
          "value": applicationName
        },
        {
          "name": "application-release-number",
          "value": releaseNumber
        },
        {
          "name": "approval-status",
          "value": approvalStatus
        }
      ];

      /****************************************************************************************
       * Configure and automate forwarding construct
       ****************************************************************************************/
      let operationServerUuid = await operationServerInterface.getOperationServerUuidForTheOperationName(originalUrl);
      forwardingConstructService.configureAndAutomateForwardingConstruct(true, serviceType, operationServerUuid,
        forwardingConstructConfigurationList, attributeList,
        user, xCorrelator, traceIndicator, customerJourney);
      resolve();
    } catch (error) {
      reject();
    }
  });
}


/**
 * Starts application in generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200
 **/
exports.startApplicationInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = [];
      let baseUrl = protocol + "://" + await tcpServerInterface.getLocalAddress() + ":" + await tcpServerInterface.getLocalPort();
      let LabelForListApprovedApplication = "List Approved Applications";
      let LabelForInformAboutApplication = "Inform about Application";
      let requestForListApprovedApplication = baseUrl + await operationServerInterface.getOperationName("tar-0-0-1-op-s-3005");
      let requestForInformAboutApplication = baseUrl + await operationServerInterface.getOperationName("tar-0-0-1-op-s-2002");
      let consequentActionForListApprovedApplication = new consequentAction(LabelForListApprovedApplication, requestForListApprovedApplication);
      let consequentActionForInformAboutApplication = new consequentAction(LabelForInformAboutApplication, requestForInformAboutApplication);
      consequentActionList.push(consequentActionForListApprovedApplication);
      consequentActionList.push(consequentActionForInformAboutApplication);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = [];
      let applicationName = await httpServerInterface.getApplicationName();
      let reponseValue = new responseValue("applicationName", applicationName, typeof applicationName);
      responseValueList.push(reponseValue);

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
    } catch (error) {
      console.log(error);
    }
    if (Object.keys(response).length > 0) {
      resolve(response[Object.keys(response)[0]]);
    } else {
      resolve();
    }
  });
}
'use strict';

const LogicalTerminatinPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInputWithMapping');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointWithMappingServices');
const ForwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const prepareForwardingConfiguration = require('./individualServices/PrepareForwardingConfiguration');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const ResponseValue = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ResponseValue');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const applicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const softwareUpgrade = require('./individualServices/SoftwareUpgrade');
const individualServicesOperationsMapping = require('./individualServices/IndividualServicesOperationsMapping');
const FileProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/FileProfile');
const prepareApplicationData = require('./individualServices/PrepareApplicationData')
const createHttpError = require('http-errors');

/**
 * Initiates process of embedding a new releasefv
 *
 * body V1_bequeathyourdataanddie_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.bequeathYourDataAndDie = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["new-application-name"];
      let releaseNumber = body["new-application-release"];
      let applicationProtocol = body["new-application-protocol"];
      let applicationAddress = body["new-application-address"];
      let applicationPort = body["new-application-port"];

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      const HttpClientLtpUuidFromForwarding = await resolveHttpClient('PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals');
      if (HttpClientLtpUuidFromForwarding == undefined) {
        reject(new createHttpError.BadRequest(`The NewRelease ${applicationName} was not found.`));
        return;
      }

      let isReleaseUpdated = false;
      let isApplicationNameUpdated = false;
      let isProtocolUpdated = false;
      let isAddressUpdated = false;
      let isPortUpdated = false;

      let logicalTerminationPointConfigurationStatus = {};
      let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
      if (newReleaseHttpClientLtpUuid != undefined) {

        let currentReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid)
        let currentApplicationName = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientLtpUuid)

        if (currentReleaseNumber != releaseNumber) {
          isReleaseUpdated = await httpClientInterface.setReleaseNumberAsync(newReleaseHttpClientLtpUuid, releaseNumber);
        }

        if (currentApplicationName != applicationName) {
          isApplicationNameUpdated = await httpClientInterface.setApplicationNameAsync(newReleaseHttpClientLtpUuid, applicationName);
        }

        if (isReleaseUpdated || isApplicationNameUpdated) {
          let configurationStatus = new ConfigurationStatus(
            newReleaseHttpClientLtpUuid,
            undefined,
            true);
          logicalTerminationPointConfigurationStatus.httpClientConfigurationStatus = configurationStatus;
        }

        let newReleaseTcpClientUuidList = await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid);
        let newReleaseTcpClientUuid = newReleaseTcpClientUuidList[0];

        let currentRemoteProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid)
        let currentRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid)
        let currentRemotePort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid)

        if (currentRemoteProtocol != applicationProtocol) {
          isProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(newReleaseTcpClientUuid, applicationProtocol);
        }

        if (JSON.stringify(currentRemoteAddress) != JSON.stringify(applicationAddress)) {
          isAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(newReleaseTcpClientUuid, applicationAddress);
        }

        if (currentRemotePort != applicationPort) {
          isPortUpdated = await tcpClientInterface.setRemotePortAsync(newReleaseTcpClientUuid, applicationPort);
        }

        if (isProtocolUpdated || isAddressUpdated || isPortUpdated) {
          let configurationStatus = new ConfigurationStatus(
            newReleaseTcpClientUuid,
            undefined,
            true);
          logicalTerminationPointConfigurationStatus.tcpClientConfigurationStatusList = [configurationStatus];
        }

        if (logicalTerminationPointConfigurationStatus != undefined) {
          /****************************************************************************************
           * Prepare attributes to automate forwarding-construct
           ****************************************************************************************/
          let forwardingAutomationInputList = await prepareForwardingAutomation.bequeathYourDataAndDie(
            logicalTerminationPointConfigurationStatus
          );
          ForwardingAutomationService.automateForwardingConstructAsync(
            operationServerName,
            forwardingAutomationInputList,
            user,
            xCorrelator,
            traceIndicator,
            customerJourney
          );
        }
        softwareUpgrade.upgradeSoftwareVersion(user, xCorrelator, traceIndicator, customerJourney, forwardingAutomationInputList.length)
          .catch(err => console.log(`upgradeSoftwareVersion failed with error: ${err}`));
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/*
  function to get Http Client LTP UUID using forwarding name
*/
var resolveHttpClient = exports.resolveHttpClientLtpUuidFromForwardingName = function (forwardingName) {
  return new Promise(async function (resolve, reject) {
    try {
      let ForwardConstructName = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingName)
      if (ForwardConstructName === undefined) {
        return null;
      }
      let LogicalTerminationPointlist;
      let httpClientUuidList = [];
      let ForwardConstructUuid = ForwardConstructName[onfAttributes.GLOBAL_CLASS.UUID]
      let ListofUuid = await ForwardingConstruct.getFcPortListAsync(ForwardConstructUuid)
      for (let i = 0; i < ListofUuid.length; i++) {
        let PortDirection = ListofUuid[i][[onfAttributes.FC_PORT.PORT_DIRECTION]]
        if (PortDirection === FcPort.portDirectionEnum.OUTPUT) {
          LogicalTerminationPointlist = ListofUuid[i][onfAttributes.CONTROL_CONSTRUCT.LOGICAL_TERMINATION_POINT]
          let httpClientUuid = await logicalTerminationPoint.getServerLtpListAsync(LogicalTerminationPointlist)
          let tcpClientUuid = await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid[0])
          httpClientUuidList.push(httpClientUuid[0], LogicalTerminationPointlist, tcpClientUuid[0]);
        }
      }
      resolve(httpClientUuidList)
    } catch (error) {
      console.log(error)
    }
  })
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
      let applicationData = []
      let filePath
      let applicationNameRequestBody = body["application-name"];
      let releaseNumberRequestBody = body["release-number"];
      let applicationDetails

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      filePath = await FileProfile.getApplicationDataFileContent()
      applicationData = await prepareApplicationData.readApplicationData(filePath)
      if (applicationData == undefined) {
        throw new createHttpError.InternalServerError("Application data does not exist")
      }
      applicationDetails = await prepareApplicationData.getApplicationDetails(applicationData, applicationNameRequestBody, releaseNumberRequestBody)
      if (applicationDetails['is-application-exist']) {
        prepareApplicationData.deleteApplication(applicationData["applications"], applicationDetails['application-name'], applicationDetails["application-release-number"])
        let applicationDataToJson = {
          "applications": applicationData["applications"]
        }
        prepareApplicationData.addAndUpdateApplicationData(filePath, applicationDataToJson)
      }
      resolve();
    } catch (error) {
      reject(error);
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
exports.documentApprovalStatus = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationData = []
      let filePath
      let applicationNameFromRequestBody = body["application-name"];
      let releaseNumberFromRequestBody = body["release-number"];
      let approvalStatusFromRequestBody = body["approval-status"];
      let applicationDetails

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      filePath = await FileProfile.getApplicationDataFileContent()
      applicationData = await prepareApplicationData.readApplicationData(filePath)
      if (applicationData == undefined) {
        throw new createHttpError.InternalServerError("Application data does not exist")
      }
      applicationDetails = await prepareApplicationData.getApplicationDetails(applicationData, applicationNameFromRequestBody, releaseNumberFromRequestBody)
      if (applicationDetails['is-application-exist']) {
        // If there is instance available for this application + release-number combination, update the “approval-status” of the instance
        if (approvalStatusFromRequestBody != applicationDetails['approval-status']) {
          let applicationDetailsIndex = applicationDetails['index']
          applicationData["applications"][applicationDetailsIndex]["approval-status"] = approvalStatusFromRequestBody
          prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData)
        }
      } else {
        // If there is no instance available for this application + release-number combination, create a instances
        let newApplicationData = {
          "application-name": applicationNameFromRequestBody,
          "application-release-number": releaseNumberFromRequestBody,
          "approval-status": approvalStatusFromRequestBody
        }
        applicationData["applications"].push(newApplicationData)
        prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData)
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.documentApprovalStatus(
        applicationNameFromRequestBody,
        releaseNumberFromRequestBody,
        approvalStatusFromRequestBody
      );
      ForwardingAutomationService.automateForwardingConstructAsync(
        operationServerName,
        forwardingAutomationInputList,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );

      resolve();
    } catch (error) {
      reject(error);
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
      let applicationData = []
      let filePath
      let applicationDataUpdateReleaseNumberKey

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      filePath = await FileProfile.getApplicationDataFileContent()
      applicationData = await prepareApplicationData.readApplicationData(filePath)
      if (applicationData != undefined) {
        applicationDataUpdateReleaseNumberKey = applicationData['applications'].map(function (applicationDataItem) {
          applicationDataItem['release-number'] = applicationDataItem['application-release-number']; // Assign new key
          delete applicationDataItem['application-release-number']; // Delete old key
          return applicationDataItem;
        });
      } else {
        throw new createHttpError.InternalServerError("Application data does not exist")
      }

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
      response['application/json'] = applicationDataUpdateReleaseNumberKey;
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Provides list of approved applications in generic representation
 *
 * returns inline_response_200_2
 **/
exports.listApprovedApplicationsInGenericRepresentation = async function (operationServerName) {
  let consequentActionList = [];
  let responseValueList = [];
  let operationServerDataType = '';
  let profiles = await ProfileCollection.getProfileListForProfileNameAsync(applicationProfile.profileNameEnum.RESPONSE_PROFILE);
  for (let profile of profiles) {
      let capability = profile["response-profile-1-0:response-profile-pac"]["response-profile-capability"];
      if (operationServerName === capability["operation-name"]) {
          // get data type when operation name is equal to ​/v1​/list-approved-applications-in-generic-representation
          operationServerDataType = capability["datatype"];
          break;
      }
  }
  let filePath = await FileProfile.getApplicationDataFileContent();
  let applicationData = await prepareApplicationData.readApplicationData(filePath);
  if (applicationData !== undefined) {
    applicationData["applications"].forEach(applicationDataItem => {
      if ("APPROVED" === applicationDataItem["approval-status"]) {
        let applicationName = applicationDataItem["application-name"]
        let releaseNumber = applicationDataItem["application-release-number"]
        responseValueList.push(new ResponseValue(applicationName, releaseNumber, operationServerDataType));
      }
    });
  }
  return onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
    consequentActionList,
    responseValueList
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
exports.redirectInfoAboutApprovalStatusChanges = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["subscriber-application"];
      let releaseNumber = body["subscriber-release-number"];
      let applicationAddress = body["subscriber-address"];
      let applicationPort = body["subscriber-port"];
      let subscriberOperation = body["subscriber-operation"];
      let applicationProtocol = body["subscriber-protocol"];

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let forwardingName = "UpdateOfApprovalStatusCausesInfoToRegistryOffice"
      const HttpClientLtpUuidFromForwarding = await resolveHttpClient(forwardingName);
      let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
      let applicatioNameFromForwarding = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientLtpUuid)
      if (applicationName !== applicatioNameFromForwarding) {
        reject(new createHttpError.BadRequest(`The subscriber-application ${applicationName} was not found.`));
        return;
      }

      let operationNamesByAttributes = new Map();
      operationNamesByAttributes.set("subscriber-operation", subscriberOperation);

      let tcpObjectList = [
        {
          "protocol": applicationProtocol,
          "address": applicationAddress,
          "port": applicationPort
        }
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        tcpObjectList,
        operationServerName,
        operationNamesByAttributes,
        individualServicesOperationsMapping.individualServicesOperationsMapping
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.findAndUpdateApplicationInformationAsync(
        logicalTerminatinPointConfigurationInput
      );


      /****************************************************************************************
       * Prepare attributes to configure forwarding-construct
       ****************************************************************************************/

      let forwardingConfigurationInputList = [];
      let forwardingConstructConfigurationStatus;
      let operationClientConfigurationStatusList = logicalTerminationPointconfigurationStatus.operationClientConfigurationStatusList;

      if (operationClientConfigurationStatusList) {
        forwardingConfigurationInputList = await prepareForwardingConfiguration.redirectInfoAboutApprovalStatusChanges(
          operationClientConfigurationStatusList,
          subscriberOperation
        );
        forwardingConstructConfigurationStatus = await ForwardingConfigurationService.
          configureForwardingConstructAsync(
            operationServerName,
            forwardingConfigurationInputList
          );
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.redirectInfoAboutApprovalStatusChanges(
        logicalTerminationPointconfigurationStatus,
        forwardingConstructConfigurationStatus
      );
      ForwardingAutomationService.automateForwardingConstructAsync(
        operationServerName,
        forwardingAutomationInputList,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );

      resolve();
    } catch (error) {
      reject(error);
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
exports.regardApplication = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {
      let applicationData = []
      let filePath
      let applicationDetails = false
      let approvalStatus

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationNameRequestBody = body["application-name"]
      let releaseNumberRequestBody = body["release-number"]

      filePath = await FileProfile.getApplicationDataFileContent()
      applicationData = await prepareApplicationData.readApplicationData(filePath)
      if (applicationData == undefined) {
        throw new createHttpError.InternalServerError("Application data does not exist")
      }
      applicationDetails = await prepareApplicationData.getApplicationDetails(applicationData, applicationNameRequestBody, releaseNumberRequestBody)
      if (!applicationDetails['is-application-exist']) {
        approvalStatus = "REGISTERED"
        let newApplicationData = {
          "application-name": applicationNameRequestBody,
          "application-release-number": releaseNumberRequestBody,
          "approval-status": approvalStatus
        }
        // Add new application data from request body
        applicationData["applications"].push(newApplicationData)
        await prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData)
      } else {
        approvalStatus = applicationDetails['approval-status']
      }

      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.regardApplication(
        applicationNameRequestBody,
        releaseNumberRequestBody,
        approvalStatus
      );
      ForwardingAutomationService.automateForwardingConstructAsync(
        operationServerName,
        forwardingAutomationInputList,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

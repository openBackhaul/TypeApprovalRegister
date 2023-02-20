'use strict';

const LogicalTerminatinPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServices');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
const layerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');

const ForwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const prepareForwardingConfiguration = require('./individualServices/PrepareForwardingConfiguration');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');

const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const consequentAction = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ConsequentAction');
const responseValue = require('onf-core-model-ap/applicationPattern/rest/server/responseBody/ResponseValue');

const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');


const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');

const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const applicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const responseProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ResponseProfile');

const softwareUpgrade = require('./individualServices/SoftwareUpgrade');
const TcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const fileProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/FileProfile');
const prepareApplicationData = require('./individualServices/PrepareApplicationData')
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
        reject(new Error(`The NewRelease ${applicationName} was not found.`));
        return;
      }

      let isdataTransferRequired = true;
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
        
        if(currentReleaseNumber != releaseNumber){
          isReleaseUpdated = await httpClientInterface.setReleaseNumberAsync(newReleaseHttpClientLtpUuid, releaseNumber);
        }

        if(currentApplicationName != applicationName){
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

        if(currentRemoteProtocol != applicationProtocol){
          isProtocolUpdated = await tcpClientInterface.setRemoteProtocolAsync(newReleaseTcpClientUuid, applicationProtocol);
        }

        if(JSON.stringify(currentRemoteAddress) != JSON.stringify(applicationAddress)){
          isAddressUpdated = await tcpClientInterface.setRemoteAddressAsync(newReleaseTcpClientUuid, applicationAddress);
        }

        if(currentRemotePort != applicationPort){
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
         softwareUpgrade.upgradeSoftwareVersion(isdataTransferRequired, user, xCorrelator, traceIndicator, customerJourney)
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
      let uuid
      let filePath
      let applicationNameRequestBody = body["application-name"];
      let releaseNumberRequestBody = body["release-number"];
      let checkApplicationExists

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/      
      let profileUuid = await profile.getUuidListAsync(profile.profileNameEnum.FILE_PROFILE);
      for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
        uuid = profileUuid[profileUuidIndex];
        filePath = await fileProfile.getFilePath(uuid)        
        applicationData = await prepareApplicationData.readApplicationData(filePath)
        checkApplicationExists = await prepareApplicationData.isApplicationExist(applicationData, applicationNameRequestBody, releaseNumberRequestBody)
        if(checkApplicationExists['is-application-exist']){
          prepareApplicationData.deleteApplication(applicationData["applications"], checkApplicationExists['application-name'])
          let applicationDataToJson = {
            "applications": applicationData["applications"]
          }
          prepareApplicationData.addAndUpdateApplicationData(filePath,applicationDataToJson)
        }
      }
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
exports.documentApprovalStatus = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {
      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationData = []
      let uuid
      let filePath
      let applicationNameFromRequestBody = body["application-name"];
      let releaseNumberFromRequestBody = body["release-number"];
      let approvalStatusFromRequestBody = body["approval-status"];
      let applicationStatus

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/      
      let profileUuid = await profile.getUuidListAsync(profile.profileNameEnum.FILE_PROFILE);
      for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
        uuid = profileUuid[profileUuidIndex];
        filePath = await fileProfile.getFilePath(uuid)     
        
        applicationData = await prepareApplicationData.readApplicationData(filePath)
        applicationStatus = await prepareApplicationData.isApplicationExist(applicationData, applicationNameFromRequestBody, releaseNumberFromRequestBody)


        if(applicationStatus['is-application-exist']){
          // If there is instance available for this application + release-number combination, update the “approval-status” of the instance
          if(approvalStatusFromRequestBody != applicationStatus['approval-status']){
            let applicationStatusIndex = applicationStatus['index']
            applicationData["applications"][applicationStatusIndex]["approval-status"] = approvalStatusFromRequestBody
            prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData)
          }
        }else{
          // If there is no instance available for this application + release-number combination, create a instances
          let newApplicationData = {
            "application-name": applicationNameFromRequestBody,
            "application-release-number": releaseNumberFromRequestBody,
            "approval-status": approvalStatusFromRequestBody
          }
          applicationData["applications"].push(newApplicationData)
          prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData)
        }
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
      let uuid
      let filePath
      let applicationDataUpdateReleaseNumberKey

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/      
      let profileUuid = await profile.getUuidListAsync(profile.profileNameEnum.FILE_PROFILE);
      for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
        uuid = profileUuid[profileUuidIndex];
        filePath = await fileProfile.getFilePath(uuid)
        applicationData = await prepareApplicationData.readApplicationData(filePath)

        applicationDataUpdateReleaseNumberKey = applicationData['applications'].map(function(applicationDataItem) {
          applicationDataItem['release-number'] = applicationDataItem['application-release-number']; // Assign new key
          delete applicationDataItem['application-release-number']; // Delete old key
          return applicationDataItem;
        });
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
      reject();
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
exports.listApprovedApplicationsInGenericRepresentation = function (user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    let response = {};
    try {
      /****************************************************************************************
       * Preparing consequent-action-list for response body
       ****************************************************************************************/
      let consequentActionList = []
      let responseValueList = []
      let applicationData = []
      let filePath
      let approvalStatus
      let applicationName
      let releaseNumber
      let reponseValue
      let getOperation
      let getDataType
 
      getDataType = await prepareApplicationData.getDataType(operationServerName)

      // get profile uuid
      let profileUuid = await profile.getUuidListAsync(applicationProfile.profileNameEnum.FILE_PROFILE);
      for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
        let uuid = profileUuid[profileUuidIndex];
        filePath = await fileProfile.getFilePath(uuid)        
        applicationData = await prepareApplicationData.readApplicationData(filePath)

        // Preparing response-value-list for response body
        applicationData["applications"].forEach(applicationDataItem => {
          approvalStatus = applicationDataItem["approval-status"];
          if (approvalStatus == "APPROVED") {
            applicationName = applicationDataItem["application-name"]
            releaseNumber = applicationDataItem["application-release-number"]
            reponseValue = new responseValue(applicationName, releaseNumber, getDataType);
            responseValueList.push(reponseValue);            }
        });
      }

      /****************************************************************************************
       * Setting 'application/json' response body
       ****************************************************************************************/
        response['application/json'] = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase({
        consequentActionList,
        responseValueList
      });
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (error) {
      console.log(error);
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

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/

      let operationList = [
        subscriberOperation
      ];
      let logicalTerminatinPointConfigurationInput = new LogicalTerminatinPointConfigurationInput(
        applicationName,
        releaseNumber,
        applicationAddress,
        applicationPort,
        operationList
      );
      let logicalTerminationPointconfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationInformationAsync(
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
      let uuid
      let filePath
      let checkApplicationExists = false
      let approvalStatus

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationNameRequestBody = body["application-name"]
      let releaseNumberRequestBody = body["release-number"]

      let profileUuid = await profile.getUuidListAsync(profile.profileNameEnum.FILE_PROFILE);
      for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
        uuid = profileUuid[profileUuidIndex];
        filePath =  await fileProfile.getFilePath(uuid)

        applicationData = await prepareApplicationData.readApplicationData(filePath)
        checkApplicationExists = await prepareApplicationData.isApplicationExist(applicationData, applicationNameRequestBody, releaseNumberRequestBody)
        if(!checkApplicationExists['is-application-exist']){
          approvalStatus = "REGISTERED"
          let newApplicationData = {
            "application-name": applicationNameRequestBody,
            "application-release-number": releaseNumberRequestBody,
            "approval-status": approvalStatus
          }
          // Add new application data from request body
          applicationData["applications"].push(newApplicationData)
          await prepareApplicationData.addAndUpdateApplicationData(filePath, applicationData) 
        }else{
          approvalStatus = checkApplicationExists['approval-status']
        }
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
      reject();
    }
  });
}
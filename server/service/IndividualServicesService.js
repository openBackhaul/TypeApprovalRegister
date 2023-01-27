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

const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const applicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');

const softwareUpgrade = require('./individualServices/SoftwareUpgrade');
const TcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const fileProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile/FileProfile');
const prepareApplicationData = require('./individualServices/PrepareApplicationData')
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
exports.bequeathYourDataAndDie = function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  return new Promise(async function (resolve, reject) {
    try {

      /****************************************************************************************
       * Setting up required local variables from the request body
       ****************************************************************************************/
      let applicationName = body["new-application-name"];
      let releaseNumber = body["new-application-release"];
      let applicationAddress = body["new-application-address"];
      let applicationPort = body["new-application-port"];

      /****************************************************************************************
       * Prepare logicalTerminatinPointConfigurationInput object to 
       * configure logical-termination-point
       ****************************************************************************************/
      let isdataTransferRequired = true;
      let newReleaseUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
      let currentApplicationName = await httpServerInterface.getApplicationNameAsync();
      if (currentApplicationName == applicationName) {
        let isUpdated = await httpClientInterface.setReleaseNumberAsync(newReleaseUuid, releaseNumber);
        let currentApplicationRemoteAddress = await TcpServerInterface.getLocalAddress();
        let currentApplicationRemotePort = await TcpServerInterface.getLocalPort();
        if((applicationAddress == currentApplicationRemoteAddress) && 
        (applicationPort == currentApplicationRemotePort)){
          isdataTransferRequired = false;
        }
        if (isUpdated) {
          applicationName = await httpClientInterface.getApplicationNameAsync(newReleaseUuid);
          let operationList = [];
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
           * Prepare attributes to automate forwarding-construct
           ****************************************************************************************/
          let forwardingAutomationInputList = await prepareForwardingAutomation.bequeathYourDataAndDie(
            logicalTerminationPointconfigurationStatus
          );
          ForwardingAutomationService.automateForwardingConstructAsync(
            operationServerName,
            forwardingAutomationInputList,
            user,
            xCorrelator,
            traceIndicator,
            customerJourney
          );
          softwareUpgrade.upgradeSoftwareVersion(isdataTransferRequired, user, xCorrelator, traceIndicator, customerJourney)
            .catch(err => console.log(`upgradeSoftwareVersion failed with error: ${err}`)); 
        }        
      } 
      resolve();
    } catch (error) {
      reject(error);
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
      let isApplicationExists = await applicationProfile.isProfileExistsAsync(applicationName, releaseNumber);
      if (isApplicationExists) {
        let profileUuid = await applicationProfile.getProfileUuidAsync(applicationName, releaseNumber);
        await ProfileCollection.deleteProfileAsync(profileUuid);
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
      let applicationName = body["application-name"];
      let releaseNumber = body["application-release-number"];
      let approvalStatus = body["approval-status"];

      /****************************************************************************************
       * configure application profile with the new application if it is not already exist
       ****************************************************************************************/
      let isApplicationExists = await applicationProfile.isProfileExistsAsync(
        applicationName,
        releaseNumber
      );
      approvalStatus = applicationProfile.ApplicationProfilePac.
      ApplicationProfileConfiguration.approvalStatusEnum[approvalStatus];

      if (isApplicationExists) {
        await applicationProfile.setApprovalStatusAsync(
          applicationName,
          releaseNumber,
          approvalStatus
        );
      } else {
      let profile = await applicationProfile.createProfileAsync(
          applicationName,
          releaseNumber,
          approvalStatus
        );
        if(profile){
          await ProfileCollection.addProfileAsync(profile);
          }
      }
     
      
      /****************************************************************************************
       * Prepare attributes to automate forwarding-construct
       ****************************************************************************************/
      let forwardingAutomationInputList = await prepareForwardingAutomation.documentApprovalStatus(
        applicationName,
        releaseNumber,
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
      let applicationProfileList = await profile.getUuidListAsync(applicationProfile.profileNameEnum.APPLICATION_PROFILE);
      for (let i = 0; i < applicationProfileList.length; i++) {
        let uuid = applicationProfileList[i];
        let applicationName = await applicationProfile.getApplicationNameAsync(uuid);
        let releaseNumber = await applicationProfile.getApplicationReleaseNumberAsync(uuid);
        let approvalStatus = await applicationProfile.getApprovalStatusAsync(uuid);
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
      let applicationProfileList = await profile.getUuidListAsync(applicationProfile.profileNameEnum.APPLICATION_PROFILE);
      for (let i = 0; i < applicationProfileList.length; i++) {
        let uuid = applicationProfileList[i];
        let approvalStatus = await applicationProfile.getApprovalStatusAsync(uuid);
        if (approvalStatus == applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum.APPROVED) {
          let applicationName = await applicationProfile.getApplicationNameAsync(uuid);
          let releaseNumber = await applicationProfile.getApplicationReleaseNumberAsync(uuid);
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

      let protocol = "http";
      let applicationAddress = await tcpServerInterface.getLocalAddress();
      let applicationPort = await tcpServerInterface.getLocalPort();
      let baseUrl = protocol + "://" + applicationAddress + ":" + applicationPort;

      let LabelForListApprovedApplication = "List Approved Applications";
      let requestForListApprovedApplication = baseUrl + await operationServerInterface.getOperationNameAsync("tar-0-0-1-op-s-3005");
      let consequentActionForListApprovedApplication = new consequentAction(
        LabelForListApprovedApplication,
        requestForListApprovedApplication,
        false
      );
      consequentActionList.push(consequentActionForListApprovedApplication);

      let LabelForInformAboutApplication = "Inform about Application";
      let requestForInformAboutApplication = baseUrl + await operationServerInterface.getOperationNameAsync("tar-0-0-1-op-s-2002");
      let consequentActionForInformAboutApplication = new consequentAction(
        LabelForInformAboutApplication,
        requestForInformAboutApplication,
        false
      );
      consequentActionList.push(consequentActionForInformAboutApplication);

      /****************************************************************************************
       * Preparing response-value-list for response body
       ****************************************************************************************/
      let responseValueList = [];
      let applicationName = await httpServerInterface.getApplicationNameAsync();
      let reponseValue = new responseValue(
        "applicationName",
        applicationName,
        typeof applicationName
      );
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
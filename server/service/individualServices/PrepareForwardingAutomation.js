const forwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const LayerProtocol = require('onf-core-model-ap/applicationPattern/onfModel/models/LayerProtocol');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');


const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const ApplicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');

exports.regardApplication = function (applicationName, releaseNumber, approvalStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * RegisteringCausesInfoAboutApprovalStatusToRegistryOffice /v1/update-approval-status
             ************************************************************************************/
            let approvalStatusForwardingName = "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice";
            let approvalStatusContext;
            let approvalStatusRequestBody = {};
            approvalStatusRequestBody.applicationName = applicationName;
            approvalStatusRequestBody.applicationReleaseNumber = releaseNumber;

            let approvalStatusJsonObject = ApplicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
            for (let approvalStatusKey in approvalStatusJsonObject) {
                if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
                    approvalStatus = approvalStatusKey;
                }
            }
            
            approvalStatusRequestBody.approvalStatus = approvalStatus;
            approvalStatusRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(approvalStatusRequestBody);
            let forwardingAutomation = new forwardingConstructAutomationInput(
                approvalStatusForwardingName,
                approvalStatusRequestBody,
                approvalStatusContext
            );
            forwardingConstructAutomationList.push(forwardingAutomation);

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.redirectInfoAboutApprovalStatusChanges = function (logicalTerminationPointconfigurationStatus, forwardingConstructConfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                forwardingConstructConfigurationStatus
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.documentApprovalStatus = function (applicationName, releaseNumber, approvalStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * UpdateOfApprovalStatusCausesInfoToRegistryOffice /v1/regard-updated-approval-status
             ************************************************************************************/
            let approvalStatusForwardingName = "UpdateOfApprovalStatusCausesInfoToRegistryOffice";
            let approvalStatusContext;
            let approvalStatusRequestBody = {};
            approvalStatusRequestBody.applicationName = applicationName;
            approvalStatusRequestBody.applicationReleaseNumber = releaseNumber;

            let approvalStatusJsonObject = ApplicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
            for (let approvalStatusKey in approvalStatusJsonObject) {
                if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
                    approvalStatus = approvalStatusKey;
                }
            }

            approvalStatusRequestBody.approvalStatus = approvalStatus;

            approvalStatusRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(approvalStatusRequestBody);
            let forwardingAutomation = new forwardingConstructAutomationInput(
                approvalStatusForwardingName,
                approvalStatusRequestBody,
                approvalStatusContext
            );
            forwardingConstructAutomationList.push(forwardingAutomation);

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.bequeathYourDataAndDie = function (logicalTerminationPointconfigurationStatus) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {

            /***********************************************************************************
             * forwardings for application layer topology
             ************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
                logicalTerminationPointconfigurationStatus,
                undefined
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }

            resolve(forwardingConstructAutomationList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.OAMLayerRequest = function (uuid) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************         
                        forwardings for application layer topology            
             *************************************************************************************/
            let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
                uuid
            );

            if (applicationLayerTopologyForwardingInputList) {
                for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
                    let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
                    forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
                }
            }
            resolve(forwardingConstructAutomationList);
        }
        catch (error) {
            reject(error);
        }
    });
}
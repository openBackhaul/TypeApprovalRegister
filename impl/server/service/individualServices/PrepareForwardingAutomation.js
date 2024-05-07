const forwardingConstructAutomationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/AutomationInput');
const onfFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const ForwardingProcessingInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ForwardingProcessingInput');
const ForwardingConstructProcessingService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructProcessingServices');

const approvalStatusEnum = {
    REGISTERED: "application-profile-1-0:APPROVAL_STATUS_TYPE_REGISTERED",
    APPROVED: "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED",
    BARRED: "application-profile-1-0:APPROVAL_STATUS_TYPE_BARRED",
    NOT_YET_DEFINED: "application-profile-1-0:APPROVAL_STATUS_TYPE_NOT_YET_DEFINED"
}

exports.regardApplication = function (applicationName, releaseNumber, approvalStatus, operationServerName, headerRequest) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * RegisteringCausesInfoAboutApprovalStatusToRegistryOffice /v1/update-approval-status
             ************************************************************************************/
            let approvalStatusForwardingName = "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice";
            let approvalStatusRequestBody = {};
            approvalStatusRequestBody.applicationName = applicationName;
            approvalStatusRequestBody.releaseNumber = releaseNumber;
            approvalStatusRequestBody.responseReceiverOperation = operationServerName;

            for (let approvalStatusKey in approvalStatusEnum) {
                if (approvalStatusEnum[approvalStatusKey] == approvalStatus) {
                    approvalStatus = approvalStatusKey;
                }
            }
            
            approvalStatusRequestBody.approvalStatus = approvalStatus;
            approvalStatusRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(approvalStatusRequestBody);

            let forwardingAutomation = new ForwardingProcessingInput(
                approvalStatusForwardingName,
                approvalStatusRequestBody
            );
            let response = await ForwardingConstructProcessingService.processForwardingConstructAsync(
                forwardingAutomation,
                headerRequest.user,
                headerRequest.xCorrelator,
                headerRequest.traceIndicator,
                headerRequest.customerJourney
            )

            resolve(response);
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
            approvalStatusRequestBody.releaseNumber = releaseNumber;

            for (let approvalStatusKey in approvalStatusEnum) {
                if (approvalStatusEnum[approvalStatusKey] == approvalStatus) {
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

exports.updateDocumentEmbeddingStatusInGui = function ( applicationName, releaseNumber, successfullyEmbedded, reasonOfFailure, headerRequest) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * GuiRequestForDocumentingAnEmbeddingStatusChangeCauses.DocumentingEmbeddingStatus TAR://v1/document-embedding-status
             * GuiRequestForDocumentingAnEmbeddingStatusChangeCauses.RetrievingListOfApplications TAR://v1/list-applications
             ************************************************************************************/
            let documentingEmbeddingStatusForwardingName = "GuiRequestForDocumentingAnEmbeddingStatusChangeCauses.DocumentingEmbeddingStatus";
            let documentingEmbeddingStatusRequestBody = {};
            documentingEmbeddingStatusRequestBody.applicationName = applicationName;
            documentingEmbeddingStatusRequestBody.releaseNumber = releaseNumber;
            documentingEmbeddingStatusRequestBody.successfullyEmbedded = successfullyEmbedded;
            documentingEmbeddingStatusRequestBody.reasonOfFailure = reasonOfFailure;
            documentingEmbeddingStatusRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(documentingEmbeddingStatusRequestBody);
            let forwardingAutomation = new ForwardingProcessingInput(
                documentingEmbeddingStatusForwardingName,
                documentingEmbeddingStatusRequestBody
            );
            let response = await ForwardingConstructProcessingService.processForwardingConstructAsync(
                forwardingAutomation,
                headerRequest.user,
                headerRequest.xCorrelator,
                headerRequest.traceIndicator,
                headerRequest.customerJourney
            )

            if(response.status.toString().startsWith("2")){
                let retrievingListOfApplicationsForwardingName = "GuiRequestForDocumentingAnEmbeddingStatusChangeCauses.RetrievingListOfApplications";
                let listOfApplications = await exports.retrievingListOfApplications(retrievingListOfApplicationsForwardingName, headerRequest);          
                resolve(listOfApplications)
            }else{
                throw new createHttpError.InternalServerError("Documenting Approval Status Failed")
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

exports.retrievingListOfApplications = function (retrievingListOfApplicationsForwardingName,headerRequest) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * RetrievingListOfApplications TAR://v1/list-applications
             ************************************************************************************/
            let retrievingListOfApplicationsRequestBody = {};
            let forwardingAutomation = new ForwardingProcessingInput(
                retrievingListOfApplicationsForwardingName,
                retrievingListOfApplicationsRequestBody
            );
            let response = await ForwardingConstructProcessingService.processForwardingConstructAsync(
                forwardingAutomation,
                headerRequest.user,
                headerRequest.xCorrelator,
                headerRequest.traceIndicator,
                headerRequest.customerJourney
            )
            resolve(response.data);
        }
        catch (error) {
            reject(error);
        }
    });
}

exports.guiRequestForDocumentingAnApprovalStatusChangeCausesDocumentingApprovalStatus = function (applicationName, releaseNumber, approvalStatus, headerRequest) {
    return new Promise(async function (resolve, reject) {
        let forwardingConstructAutomationList = [];
        try {
            /***********************************************************************************
             * GuiRequestForDocumentingAnApprovalStatusChangeCauses.DocumentingApprovalStatus TAR://v1/document-approval-status
             * GuiRequestForDocumentingAnApprovalStatusChangeCauses.RetrievingListOfApplication TAR://v1/list-applications
             ************************************************************************************/
            let documentingApprovalStatusForwardingName = "GuiRequestForDocumentingAnApprovalStatusChangeCauses.DocumentingApprovalStatus";
            let documentingApprovalStatusRequestBody = {};
            documentingApprovalStatusRequestBody.applicationName = applicationName;
            documentingApprovalStatusRequestBody.releaseNumber = releaseNumber;
            documentingApprovalStatusRequestBody.approvalStatus = approvalStatus;
            documentingApprovalStatusRequestBody = onfFormatter.modifyJsonObjectKeysToKebabCase(documentingApprovalStatusRequestBody);
            let forwardingAutomation = new ForwardingProcessingInput(
                documentingApprovalStatusForwardingName,
                documentingApprovalStatusRequestBody
            );
            let response = await ForwardingConstructProcessingService.processForwardingConstructAsync(
                forwardingAutomation,
                headerRequest.user,
                headerRequest.xCorrelator,
                headerRequest.traceIndicator,
                headerRequest.customerJourney
            )

            if(response.status.toString().startsWith("2")){
                let retrievingListOfApplicationsForwardingName = "GuiRequestForDocumentingAnApprovalStatusChangeCauses.RetrievingListOfApplications";
                let listOfApplications = await exports.retrievingListOfApplications(retrievingListOfApplicationsForwardingName, headerRequest);          
                resolve(listOfApplications)
            }else{
                throw new createHttpError.InternalServerError("Documenting Approval Status Failed")
            }

        }
        catch (error) {
            reject(error);
        }
    });
}

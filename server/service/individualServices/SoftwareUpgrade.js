/**
 * @file This module provides functionality to migrate the data from the current version to the next version. 
 * @module SoftwareUpgrade
 **/

const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const OperationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const applicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const OperationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const eventDispatcher = require('onf-core-model-ap/applicationPattern/rest/client/eventDispatcher');
const individualServices = require('../IndividualServicesService')
const forwardingKindNameForBequeathingDataCausesNewTAR= "PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals"
const fileProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/FileProfile');
const prepareApplicationData = require('./PrepareApplicationData')

/**
 * This method performs the set of procedure to transfer the data from this version to next version 
 * of the application and bring the new release official
 * @param {boolean} isdataTransferRequired represents true if data transfer is required
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {Promise} Promise is resolved if the operation succeeded else the Promise is rejected
 * **/
exports.upgradeSoftwareVersion = async function (isdataTransferRequired, user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            if (isdataTransferRequired) {
                await transferDataToTheNewRelease(user, xCorrelator, traceIndicator, customerJourney);
            }
            await redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney);
            await replaceOldReleaseWithNewRelease(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * This method performs the data transfer from the current instance to the new instance
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * The following are the list of forwarding-construct that will be automated to transfer the data from this current release to next release
 * 1. PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals
 * 2. PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals
 */
async function transferDataToTheNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            await PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals(user, xCorrelator, traceIndicator, customerJourney);
            await PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * This method performs the set of procedure to redirect the notification to the new release
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * The following are the list of forwarding-construct that will be automated to redirect the notification 
 * to the new release and to end the existing subscription
 * 1. PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR
 * 2. PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications
 * 3. PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease
 */
async function redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            await PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR(user, xCorrelator, traceIndicator, customerJourney);
            await PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications(user, xCorrelator, traceIndicator, customerJourney);
            await PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * This method performs the set of procedure to replace the old release with the new release
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * The following are the list of forwarding-construct that will be automated to replace the old release with the new release
 * 1. PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
 * 2. PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease
 */
async function replaceOldReleaseWithNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            await promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals<br>
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            /***********************************************************************************
             * Preparing requestBody and transfering the data one by one
             ************************************************************************************/

            let inquiryForApplicationTypeApprovalFCName = "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice";
            let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(inquiryForApplicationTypeApprovalFCName);
            let operationClientUuidList = getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance);

            for (let i = 0; i < operationClientUuidList.length; i++) {
                try {
                    let operationClientUuid = operationClientUuidList[i];
                    let httpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid))[0];
                    let tcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid))[0];

                    let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
                    let releaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
                    let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
                    let applicationPort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
                    let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuid);
                    let regardUpdatedApprovalOperation = await operationClientInterface.getOperationNameAsync(operationClientUuid);
                    /***********************************************************************************
                     * PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals
                     *   /v1/redirect-info-about-approval-status-changes
                     ************************************************************************************/
                    let requestBody = {};
                    requestBody.subscriberApplication = applicationName;
                    requestBody.subscriberReleaseNumber = releaseNumber;
                    requestBody.subscriberOperation = regardUpdatedApprovalOperation;
                    requestBody.subscriberAddress = applicationAddress;
                    requestBody.subscriberPort = applicationPort;
                    requestBody.subscriberProtocol = applicationProtocol
                    requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                    result = await forwardRequest(
                        forwardingKindNameOfTheBequeathOperation,
                        requestBody,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                    if (!result) {
                        throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                    }

                } catch (error) {
                    console.log(error);
                    throw "operation is not success";
                }
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals<br>
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let applicationName 
            let releaseNumber
            let approvalStatus
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals";

            /***********************************************************************************
             * Preparing requestBody and transfering the data one by one
             ************************************************************************************/
            
            let profileUuid = await profile.getUuidListAsync(profile.profileNameEnum.FILE_PROFILE);

            for (let profileUuidIndex = 0; profileUuidIndex < profileUuid.length; profileUuidIndex++) {
                uuid = profileUuid[profileUuidIndex];
                filePath = await fileProfile.getFilePath(uuid)
                applicationData = await prepareApplicationData.readApplicationData(filePath)
                
                applicationDataUpdateReleaseNumberKey = applicationData['applications'].map(async function(applicationDataItem) {
                    applicationName = applicationDataItem['application-name']; 
                    releaseNumber = applicationDataItem['application-release-number'];
                    approvalStatus = applicationDataItem['approval-status'];     

                    /***********************************************************************************
                     * PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals
                     *   /v1/document-approval-status
                     ************************************************************************************/
                    let requestBody = {};
                    requestBody.applicationName = applicationName;
                    requestBody.releaseNumber = releaseNumber;
                    requestBody.approvalStatus = approvalStatus;
                    requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                    result = await forwardRequest(
                        forwardingKindNameOfTheBequeathOperation,
                        requestBody,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                    if (!result) {
                        throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                    }
                });

            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR";
            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {
                let HttpClientLtpUuidFromForwarding  = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameForBequeathingDataCausesNewTAR)
                if (HttpClientLtpUuidFromForwarding == undefined) {
                    reject(new Error(`The NewRelease ${applicationName} was not found.`));
                    return;
                }
                let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
                let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid))[0];

                let applicationName = await httpServerInterface.getApplicationNameAsync();
                let releaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid);
                let regardApplicationOperation = await OperationServerInterface.getOperationNameAsync("tar-2-0-1-op-s-is-001");
                let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);

                /***********************************************************************************
                 * PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR
                 *   /v1/inquire-application-type-approvals
                 ************************************************************************************/
                let requestBody = {};
                requestBody.approvalApplication = applicationName;
                requestBody.approvalApplicationReleaseNumber = releaseNumber;
                requestBody.approvalOperation = regardApplicationOperation;
                requestBody.approvalApplicationAddress = applicationAddress;
                requestBody.approvalApplicationPort = applicationPort;
                requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                result = await forwardRequest(
                    forwardingKindNameOfTheBequeathOperation,
                    requestBody,
                    user,
                    xCorrelator,
                    traceIndicator,
                    customerJourney
                );
                if (!result) {
                    throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                }

            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications<br>
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications";
            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {
                let HttpClientLtpUuidFromForwarding  = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameForBequeathingDataCausesNewTAR)
                if (HttpClientLtpUuidFromForwarding == undefined) {
                    reject(new Error(`The NewRelease ${applicationName} was not found.`));
                    return;
                }
                let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
                let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid))[0];

                let applicationName = await httpServerInterface.getApplicationNameAsync();
                let releaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid);
                let disregardApplicationOperation = await OperationServerInterface.getOperationNameAsync("tar-2-0-1-op-s-is-002");
                let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
                let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid)

                /***********************************************************************************
                 * PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications
                 *   /v1/notify-deregistrations
                 ************************************************************************************/
                let requestBody = {};
                requestBody.subscriberApplication = applicationName;
                requestBody.subscriberReleaseNumber = releaseNumber;
                requestBody.subscriberOperation = disregardApplicationOperation;
                requestBody.subscriberAddress = applicationAddress;
                requestBody.subscriberPort = applicationPort;
                requestBody.subscriberProtocol = applicationProtocol
                requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                result = await forwardRequest(
                    forwardingKindNameOfTheBequeathOperation,
                    requestBody,
                    user,
                    xCorrelator,
                    traceIndicator,
                    customerJourney
                );
                if (!result) {
                    throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                }

            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease";
            let forwardingKindNameOfTheNotifyApprovals= "PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR";
            let forwardingKindNameOfTheNotifyWithdrawnApprovals= "PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications";
            
            let operationClientUuidValueOfnotifyApprovals = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameOfTheNotifyApprovals);
            let operationClientUuidOfnotifyApprovals = operationClientUuidValueOfnotifyApprovals[1];
            let operationClientUuidValuenotifyWithdrawnApprovals = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameOfTheNotifyWithdrawnApprovals)
            let operationClientUuidOfnotifyWithdrawnApprovals = operationClientUuidValuenotifyWithdrawnApprovals[1];
            let listOfOperationToBeUnsubscribed = [];
            let approvalOperationName = await operationClientInterface.getOperationNameAsync(operationClientUuidOfnotifyApprovals);
            let deregistrationOperationName = await operationClientInterface.getOperationNameAsync(operationClientUuidOfnotifyWithdrawnApprovals);
            listOfOperationToBeUnsubscribed.push(approvalOperationName);
            listOfOperationToBeUnsubscribed.push(deregistrationOperationName);
            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {
                for (let i = 0; i < listOfOperationToBeUnsubscribed.length; i++) {

                    let applicationName = await httpServerInterface.getApplicationNameAsync();
                    let releaseNumber = await httpServerInterface.getReleaseNumberAsync();
                    let subscriptionName = listOfOperationToBeUnsubscribed[i];

                    /***********************************************************************************
                     * PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease
                     *   /v1/end-subscription
                     ************************************************************************************/
                    let requestBody = {};
                    requestBody.subscriberApplication = applicationName;
                    requestBody.subscriberReleaseNumber = releaseNumber;
                    requestBody.subscription = subscriptionName.toString();
                    requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                    result = await forwardRequest(
                        forwardingKindNameOfTheBequeathOperation,
                        requestBody,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                    if (!result) {
                        throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                    }
                }

            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement<br>
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement";

            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {
                let HttpClientLtpUuidFromForwarding  = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameForBequeathingDataCausesNewTAR)
                if (HttpClientLtpUuidFromForwarding == undefined) {
                    reject(new Error(`The NewRelease ${applicationName} was not found.`));
                    return;
                }
                let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
                let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid))[0];

                let applicationName = await httpServerInterface.getApplicationNameAsync();
                let oldReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
                let newApplicationName = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientLtpUuid)
                let newReleaseNumber = await httpServerInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid);
                let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
                let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid);
                /***********************************************************************************
                 * PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
                 *   /v1/relay-server-replacement
                 ************************************************************************************/
                let requestBody = {};
                requestBody.currentApplicationName = applicationName;
                requestBody.currentReleaseNumber = oldReleaseNumber;
                requestBody.futureReleaseNumber = newReleaseNumber;
                requestBody.futureApplicationName = newApplicationName;
                requestBody.futureAddress = applicationAddress;
                requestBody.futurePort= applicationPort;
                requestBody.futureProtocol= applicationProtocol;

                requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                result = await forwardRequest(
                    forwardingKindNameOfTheBequeathOperation,
                    requestBody,
                    user,
                    xCorrelator,
                    traceIndicator,
                    customerJourney
                );
                if (!result) {
                    throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                }

            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease<br>
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false
 */
async function promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease";

            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {              
                let HttpClientLtpUuidFromForwarding  = await individualServices.resolveHttpClientLtpUuidFromForwardingName(forwardingKindNameForBequeathingDataCausesNewTAR)
                if (HttpClientLtpUuidFromForwarding == undefined) {
                    reject(new Error(`The NewRelease ${applicationName} was not found.`));
                    return;
                }
                let newReleaseHttpClientLtpUuid = HttpClientLtpUuidFromForwarding[0];
                let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientLtpUuid))[0];

                let applicationName = await httpServerInterface.getApplicationNameAsync();
                let oldReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
                let newApplicationName = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientLtpUuid)
                let newReleaseNumber= await httpServerInterface.getReleaseNumberAsync(newReleaseHttpClientLtpUuid)
                let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
                let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid);

                if (oldReleaseNumber != newReleaseNumber) {
                    /***********************************************************************************
                     * PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
                     *   /v1/relay-server-replacement
                     ************************************************************************************/
                    let requestBody = {};
                    requestBody.currentApplicationName = applicationName;
                    requestBody.currentReleaseNumber = oldReleaseNumber;
                    requestBody.futureReleaseNumber = newReleaseNumber;
                    requestBody.futureApplicationName = newApplicationName;
                    requestBody.futureAddress = applicationAddress;
                    requestBody.futurePort= applicationPort;
                    requestBody.futureProtocol= applicationProtocol;

                    requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                    result = await forwardRequest(
                        forwardingKindNameOfTheBequeathOperation,
                        requestBody,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                    if (!result) {
                        throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                    }
                }
            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/****************************************************************************************
 * Functions utilized by individual services
 ****************************************************************************************/
function getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance) {
    try {
        let fcPortOutputLogicalTerminationPointList = [];
        let fcPortList = forwardingConstructInstance[
            onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
        for (let i = 0; i < fcPortList.length; i++) {
            let fcPort = fcPortList[i];
            let fcPortPortDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
            if (fcPortPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                let fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                fcPortOutputLogicalTerminationPointList.push(fclogicalTerminationPoint);
            }
        }
        return fcPortOutputLogicalTerminationPointList;
    } catch (error) {
        throw error;
    }
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function forwardRequest(forwardingKindName, attributeList, user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingKindName);
            let operationClientUuid = (getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance))[0];
            let result = await eventDispatcher.dispatchEvent(
                operationClientUuid,
                attributeList,
                user,
                xCorrelator,
                traceIndicator,
                customerJourney
            );
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
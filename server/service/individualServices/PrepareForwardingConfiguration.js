const forwardingConstructConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ConfigurationInput');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const forwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');

exports.redirectInfoAboutApprovalStatusChanges = function (operationClientConfigurationStatusList, subscriberOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == subscriberOperation) {
                    forwardingName =
                        "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );

                    forwardingName =
                        "UpdateOfApprovalStatusCausesInfoToRegistryOffice";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );

                }
                
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}
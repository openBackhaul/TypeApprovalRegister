const fileSystem = require('fs')
const applicationProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ApplicationProfile');
const profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const responseProfile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/ResponseProfile');

/*
* Add new applications if there is no instance available for this application + release-number combination
* Update approval status if there is an instance available for this application + release-number combination
*/
exports.addAndUpdateApplicationData = async (filePath, applicationData) => {
    return new Promise(async function (resolve, reject) {
        try{
            fileSystem.writeFileSync(filePath, JSON.stringify(applicationData), (errWritingIntoFile) => {
                if (errWritingIntoFile) throw errWritingIntoFile;
            });
            resolve()
        }catch (error) {
            reject(error);
        }
    });    
}

/*
* Read application data
*/
exports.readApplicationData = async (filePath)=>{
    return new Promise(async function (resolve, reject) {
        try{
            let applicationData;
            applicationData = JSON.parse(fileSystem.readFileSync(filePath, 'utf8'));
            resolve(applicationData)
        }catch (error) {
            reject(error);
        }
    });
}

/*
* Check is application name + release number combination from request body exist in application-data.json
* if application exist function return below values
* true,approval-status,application index, application-name
*/
exports.getApplicationDetails = async (applicationData, applicationNameFromRequestBody, releaseNumberFromRequestBody)=>{
    return new Promise(async function (resolve, reject) {
        try{
            if(applicationData){
                let applicationNameFromFile
                let releaseNumberFromFile
                let applicationStatus = []
        
                applicationData["applications"].forEach((applicationDataItem, applicationDataIndex) => {
                    applicationNameFromFile = applicationDataItem["application-name"]
                    releaseNumberFromFile = applicationDataItem["application-release-number"]
            
                    if(applicationNameFromRequestBody === applicationNameFromFile && releaseNumberFromRequestBody === releaseNumberFromFile){
                        applicationStatus['is-application-exist'] = true
                        applicationStatus['approval-status'] = applicationDataItem["approval-status"]
                        applicationStatus['index'] = applicationDataIndex
                        applicationStatus['application-name'] = applicationNameFromFile

                    }
                });

                resolve(applicationStatus)
            }
        }catch (error) {
            reject(error);
        }
    });
}

/*
* Delete application by name from application-data/application-data.json
*/
exports.deleteApplication = async (applicationData, applicationNameToDelete) => {
    return new Promise(async function (resolve, reject) {
        try{
            const applicationDataIndex = applicationData.findIndex(applicationDataItem => {
                return applicationDataItem["application-name"] === String(applicationNameToDelete);
             });
             if(applicationDataIndex === -1){
                return false;
             };
             applicationData.splice(applicationDataIndex, 1);
             resolve(applicationData)
        }catch (error) {
            reject(error);
        }
    });
  }

  
/*
* get data type
*/
exports.getDataType = async (operationServerName) => {
    return new Promise(async function (resolve, reject) {
        try {
            let getOperation
            let getDataType
            // get response profile uuid
            let responseProfileUuid = await profile.getUuidListAsync(applicationProfile.profileNameEnum.RESPONSE_PROFILE);
            for (let responseProfileUuidIndex = 0; responseProfileUuidIndex < responseProfileUuid.length; responseProfileUuidIndex++) {
                let uuid = responseProfileUuid[responseProfileUuidIndex];
                getOperation = await responseProfile.getOperationNameAsync(uuid)
                if (getOperation == operationServerName) {
                    // get data type when operation name is equal to ​/v1​/list-approved-applications-in-generic-representation
                    getDataType = await responseProfile.getDataType(uuid)
                }
            }

            resolve(getDataType)
        } catch (error) {
            reject(error);
        }
    });
}

  

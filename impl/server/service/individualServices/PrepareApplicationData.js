const fileSystem = require('fs')

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
exports.readApplicationData = async function(filePath) {
    return JSON.parse(fileSystem.readFileSync(filePath, 'utf8'));
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
                        applicationStatus['application-release-number'] = releaseNumberFromFile

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
exports.deleteApplication = async (applicationData, applicationNameToDelete, applicationReleaseNumber) => {
    return new Promise(async function (resolve, reject) {
        try{
            const applicationDataIndex = applicationData.findIndex(applicationDataItem => {
                return (applicationDataItem["application-name"] === String(applicationNameToDelete) && applicationDataItem["application-release-number"] === String(applicationReleaseNumber));
             });
             if(applicationDataIndex === -1){
                return false;
             }
             applicationData.splice(applicationDataIndex, 1);
             resolve(applicationData)
        }catch (error) {
            reject(error);
        }
    });
  }
  

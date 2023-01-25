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
exports.readApplicationData = async (filePath)=>{
    return new Promise(async function (resolve, reject) {
        try{
            if(fileSystem.existsSync(filePath)){
                let applicationData = JSON.parse(fileSystem.readFileSync(filePath, 'utf8'));
                resolve(applicationData)
            }
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
exports.isApplicationExist = async (applicationData, applicationNameFromRequestBody, releaseNumberFromRequestBody)=>{
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
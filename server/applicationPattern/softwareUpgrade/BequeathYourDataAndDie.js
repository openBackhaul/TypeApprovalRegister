/**
 * @file This module provides functionality to migrate the data from the current version to the next version. 
 * This file should be modified accourding to the individual service forwarding requirements 
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       07.12.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG
 * @module SoftwareUpgrade
 **/


/**
 * This method performs the set of procedure to transfer the data from this version to next version of the application<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br>
 * The following are the list of forwarding-construct that will be automated to transfer the data from this current release to next release
 * 1. PromptForBequeathingDataCauses*****
 * 2. PromptForBequeathingDataCauses*****
 * 3. PromptForBequeathingDataCauses*****
 * *****
 * *****
 */
exports.upgradeSoftwareVersion = async function (user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            await promptForBequeathingDataCausesMethod1(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesMethod2(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCauses**<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. 
 * 2.
 * 3. push the collected attribute for each registered application and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesMethod1(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            resolve();
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCauses**<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. 
 * 2. 
 * 3. push the collected attribute for each registered application and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesMethod2(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            resolve();
        } catch (error) {
            reject();
        }
    });
}

import libCom from '../Common/Library/CommonLibrary';
import libThis from './CooperationLibrary';
import Logger from '../Log/Logger';
import libQR from '../Common/Library/QRCodeLibrary';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import libCrypto from '../Common/Library/CryptoLibrary';
import cooperationIsEnabled from './CooperationIsEnabled';
import { setInterval as nsSetInterval, clearInterval as nsClearInterval } from '@nativescript/core/timer';

/**
 * Routines for cooperation feature
 */

export default class CooperationLibrary {
    
    /**
     * Count down from the specified number of seconds after generating a QRCode
     * The QRCode is considered expired when the timer reaches zero
     * @param {*} context 
     * @param {*} seconds 
     */
    static async startQRCodeCounter(context) {
        let counter = await libThis.getExpiredSeconds(context);
        const control = context.getPageProxy().getControl('SectionedTable').getControl('CountDownMessage');
        const timeExpires = libCom.getStateVariable(context, 'QRCodeValidTo');
        let expiresAt;

        if (timeExpires) expiresAt = new Date(timeExpires).getTime();

        if (control) {
            // Clear any existing interval before starting a new one
            libThis.terminateCountDownIfRunning();

            CooperationLibrary.intervalId = nsSetInterval(() => { //IntervalId is a static variable for this class, not an instance variable.  Only one countdown can be running at a time.
                libThis.updateScreen(context, counter);

                counter--;

                if (expiresAt && CooperationLibrary.appResumed) { //Check if the current date is past the expires date to handle app going into background during countdown
                    const now = Date.now();
                    if (now > expiresAt) {
                        counter = -1; // Trigger expiration
                    }
                }

                if (counter < 0) {
                    nsClearInterval(CooperationLibrary.intervalId);
                    CooperationLibrary.intervalId = undefined;
                    libThis.timerExpired(context, control);
                }
            }, 1000);
        } else {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: Cannot find screen control for QR Code countdown in startQRCodeCounter');
            return false;
        }
        return true;
    }

    /**
     * Flag to indicate if the app was resumed during the countdown
     */
    static checkAppResumedDuringCountDown(context) {
        if (cooperationIsEnabled(context)) {
            if (CooperationLibrary.intervalId) {
                CooperationLibrary.appResumed = true; //Set the app resumed flag to true
            }
        }
    }

    /**
     * Terminate the countdown interval if it is still running
     */
    static terminateCountDownIfRunning() {
        if (CooperationLibrary.intervalId) {
            nsClearInterval(CooperationLibrary.intervalId);
            CooperationLibrary.intervalId = undefined;
        }
        CooperationLibrary.appResumed = false; //Reset the app resumed flag
    }

    /**
     * Update the screen timer field
     * Need to grab control reference each time instead of using a constant pointer.
     * MDK seems to randomly recreate the view, causing random crashes if we try to keep reusing the same control reference.
     * @param {*} context
     * @param {*} counter
     */
    static updateScreen(context, counter) {
        try {
            const message = context.localizeText('expired_code_countdown', [counter]);
            const controlNew = context.getPageProxy().getControl('SectionedTable').getControl('CountDownMessage');

            if (controlNew) {
                controlNew.setStyle('CooperationCenteredBlack');
                if (counter < 11) { //Change to red when less than 10 seconds
                    controlNew.setStyle('CooperationCenteredRed');
                }
                controlNew.setText(message);
                controlNew.redraw();
            }
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: Failed to update QR Code countdown message in updateScreen');
        }
    }

    /**
     * Expire the QRCode on screen
     * @param {*} context 
     */
    static timerExpired(context, control) {
        const message = context.localizeText('expired_code_message');

        control.setStyle('CooperationCenteredRed');
        control.setText(message);
        control.redraw();
    }

    /**
     * Generate the current dynamic QRCode for this user
     * @param {*} context 
     */
    static generateCurrentDynamicQRCode(context, seconds, pass) {
        let person = GlobalVar.getUserSystemInfo().get('PERNO'); //Get current user's personnel number

        if (person) {
            let jsonObject = {};
            let commentControl = context.getPageProxy().getControl('SectionedTable').getControl('LongText');
            let comment = commentControl ? commentControl.getValue() : '';

            libCom.removeStateVariable(context, 'QRCodeValidTo');
            jsonObject.QRCODE_TYPE = 'D';
            jsonObject.PERNR = person;
            jsonObject.CONFIRMATION_SCENARIO = '10';
            jsonObject.CTIMESTAMP = new Date().toISOString();
            if (seconds) { //From and To timestamps
                jsonObject.VALID_FROM = new Date().toISOString();
                // Get current timestamp in milliseconds
                let validToTimestamp = new Date().getTime() + seconds * 1000;
                // Create a new Date object from the adjusted timestamp
                jsonObject.VALID_TO = new Date(validToTimestamp).toISOString();
                libCom.setStateVariable(context, 'QRCodeValidTo', jsonObject.VALID_TO); //Save the expiration date to the state variable
            }
            if (comment) jsonObject.LONG_TEXT = comment;
            return 'D' + libCrypto.encryptAESWrapper(context, JSON.stringify(jsonObject), pass); //Encrypt the data using AES-256
        }
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: No personnel number found for current user in generateCurrentDynamicQRCode');
        context.executeAction('/SAPAssetManager/Actions/Cooperation/CooperationQRCodeMissingPersonMessage.action');
        return '';
    }

    /**
     * Read global feature config parameters
     * @param {*} context 
     */
    static async readGlobalConfig(context) {
        let fioriID = libCom.getAppParam(context, 'COOPERATION', 'FioriID'); //Backend Application ID for this SSAM feature
        if (!fioriID) fioriID = 'F5104A'; //Default for now
        let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeGenCtrlParams', [], "$filter=FioriID eq '" + fioriID + "'");
        if (rows && rows.length > 0) {
            return rows.getItem(0);
        }
     
        return Promise.resolve('');
    }

    /**
     * Read dynamic feature config parameters
     * @param {*} context 
     */
    static async readDynamicConfig(context) {
        let fioriID = libCom.getAppParam(context, 'COOPERATION', 'FioriID'); //Backend Application ID for this SSAM feature
        if (!fioriID) fioriID = 'F5104A'; //Default for now
        let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeDynAuthCtrlParams', [], "$filter=FioriID eq '" + fioriID + "'");
        if (rows && rows.length > 0) {
            return rows.getItem(0);
        }
     
        return Promise.resolve('');
    }

    /**
     * Look up feature config parameters for this plant using currently selected work order
     * @param {*} context 
     */
    static async readConfigByPlant(context, workOrder) {
        if (workOrder) {
            let workOrderRow = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${workOrder}')`, ['PlanningPlant'], '');
            if (workOrderRow && workOrderRow.length > 0) {
                let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodePlantAuthCtrlParams', [], `$filter=Plant eq '${workOrderRow.getItem(0).PlanningPlant}' and ConfScenario eq '' and Inactive ne 'X'`);
                if (rows && rows.length > 0) {
                    return rows.getItem(0);
                }
                //WO Plant not found, try for * wildcard instead
                rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodePlantAuthCtrlParams', [], "$filter=Plant eq '*' and ConfScenario eq '' and Inactive ne 'X'");
                if (rows && rows.length > 0) {
                    return rows.getItem(0);
                }
            }
        }
        return Promise.resolve('');
    }

    /**
     * Get the number of seconds that a generated QR Code should remain valid from global configuration
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getExpiredSeconds(context, tempResult) {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }
    
        let duration = result.Validity;
        if (!libCom.isNumeric(duration)) {
            duration = 90; //default to 90 seconds if no duration found in config
        }
    
        return Promise.resolve(duration);
    }

    /**
     * Get the text enabled flag to determine if user can enter comments on generate QR Code screen
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns Boolean
     */
    static async getTextEnabled(context, tempResult) {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }

        return Promise.resolve(result.ConfTextFlag === 'X');
    }

    /**
     * Get the text maximum length for long text comments on generate QR Code screen
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getTextMaxLength(context, tempResult) {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }

        return Promise.resolve(result.ConfTextLength);
    }

    /**
     * Check config to see if cooperation user is allowed to adjust confirmation time
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getAllowTimeUpdate(context, tempResult, workOrder) {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readConfigByPlant(context, workOrder);
        }

        return Promise.resolve(result.TimeUpdate === 'X');
    }

    /**
     * Check config to see if variance reason on a confirmation should be defaulted to the cooperation record
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getDefaultVarianceReason(context, tempResult, workOrder) {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readConfigByPlant(context, workOrder);
        }

        if (result.DefaultVarianceCause === 'X') {
            return Promise.resolve(result.VarianceReason);
        }
        return Promise.resolve('');
    }

    /**
     * Get the passcode used to encrypt/decrypt dynamic QR Codes
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getDynamicPass(context, tempResult) {
        let result;

        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readDynamicConfig(context);
        }

        return Promise.resolve(result.EncryptionPassword);
    }

    /**
     * Process the encrypted QR Code data and pass back the unencrypted string as a JSON object
     * @param {*} context 
     * @param {*} scanData 
     * @returns 
     */
    static async processCooperationQRCode(scanData, context) {
        const type = scanData.substring(0,1);
        let processedData = await libThis.decryptQRCode(scanData.substring(1), type, context);
        
        if (processedData) {
            try {
                let scanObject = JSON.parse(processedData);
                scanObject.Type = type;
                return scanObject;
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: Failed to parse QR Code data in processCooperationQRCode');
                return undefined;
            }
        }
    
        return undefined;
    }
    
    /**
     * Decrypt the encrypted scan data based on type
     * @param {*} context 
     * @param {*} scanData - The raw encypted QRCode data (minus the 1st character)
     * @param {*} type  - The first unencrypted byte of the QRCode, either 'S' for static or 'D' for dynamic
     * @returns 
     */
    static async decryptQRCode(scanData, type, context) {
        if (type === 'D') { //Dynamic QR Code
            let pass = await libThis.getDynamicPass(context);

            if (pass) {
                return libCrypto.decryptAESWrapper(context, scanData, pass); //Decrypt the data using AES-256
            } else {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: No passcode found for dynamic QR Code decryption in decryptQRCode');
                return undefined;
            }
        } else if (type === 'S') { //Static QR Code
            //Hash the QR Code to a base64 SHA-256 string
            let hash = libCrypto.hash256Base64(context, 'S' + scanData);
            if (hash) {
                //Look up the static record in the database
                let result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeStaticStorage', ['User','CreatedTime'], `$filter=HashValue eq '${hash}'`);
                if (result && result.length > 0) {
                    let row = result.getItem(0);
                    let passcode = row.User + row.CreatedTime;

                    return libCrypto.decryptAESWrapper(context, scanData, passcode); //Decrypt the data using AES-256
                }
            }
            //No static record found either because the database record is missing, or the hash of the scanned data failed
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: No static record found matching QRCode scan data in decryptQRCode');
            libCom.setStateVariable(context, 'CooperationErrorAction', '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeInvalidStaticMessage.action');
            return undefined;
        }

        return scanData; //Return raw data for other types
    }
    
    /**
     * Check the scanned QR code data for validity
     * Returns boolean and sets an error action state variable if invalid
     * @param {*} context 
     */
    static async validateQRCode(context, scanObject) {
        let valid = false;
    
        valid = await libThis.employeeCheck(context, scanObject);
        if (valid) valid = libThis.scenarioCheck(context, scanObject);
        if (valid) valid = libThis.timeCheck(context, scanObject);
        if (valid) libCom.removeStateVariable(context, 'CooperationErrorAction');
        
        return valid;
    }
    
    /**
     * Check that the employee exists
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static async employeeCheck(context, scanObject) {
        let errorAction = '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeInvalidMessage.action';
    
        if (scanObject.PERNR) {
            let count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'Employees', `$filter=PersonnelNumber eq '${scanObject.PERNR}'`);
            if (count === 0) { //Employee doesn't exist
                errorAction = '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeBadEmployeeMessage.action';
                libCom.setStateVariable(context, 'CooperationErrorAction', errorAction);
                return false;
            }
        } else { //Bad QR Code data
            libCom.setStateVariable(context, 'CooperationErrorAction', errorAction);
            return false;
        }
        return true;
    }
    
    /**
     * Check for valid scenario type
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static scenarioCheck(context, scanObject) {
        let errorAction = '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeInvalidScenarioMessage.action';
    
        if (scanObject.CONFIRMATION_SCENARIO) {
            if (scanObject.CONFIRMATION_SCENARIO !== '10') { //Cooperation support
                libCom.setStateVariable(context, 'CooperationErrorAction', errorAction);
                return false;
            }
        } else { //Bad QR Code data
            libCom.setStateVariable(context, 'CooperationErrorAction', errorAction);
            return false;
        }
        return true;
    }
    
    /**
     * Check to see if the scan took place within the valid date/time limits
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static timeCheck(context, scanObject) {
        let errorAction = '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeExpiredMessage.action';
    
        if (scanObject.VALID_FROM && scanObject.VALID_TO) { //This QR Code has an expiration date
            const fromDate = new Date(scanObject.VALID_FROM);
            const toDate = new Date(scanObject.VALID_TO);
            const currentDate = new Date();
            if (currentDate < fromDate || currentDate > toDate) { //QR Code is expired or not yet valid
                libCom.setStateVariable(context, 'CooperationErrorAction', errorAction);
                return false;
            }
        }
        return true;
    }

    /**
     * Generate a new dynamic QR code and refresh the image screen control that displays it
     * @param {*} context 
     */
    static async generateQRCodeAndRefresh(context) {
        let seconds = await libThis.getExpiredSeconds(context);
        let pass = await libThis.getDynamicPass(context);
        let pageProxy = context.getPageProxy();
        let clientData = pageProxy.getClientData();
        let text = libThis.generateCurrentDynamicQRCode(context, seconds, pass);

        if (text) {
            clientData.QRCodeImageSource = libQR.generateQRCode(text);
            pageProxy.getControl('SectionedTable').getSection('SectionImage').redraw();
            return true;
        }
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: Failed to generate QR Code text in generateQRCodeAndRefresh');
        return false;
    }

    /**
     * Blank out the current QR Code image
     * @param {*} context 
     */
    static emptyQRCodeControl(context) {
        let pageProxy = context.getPageProxy();
        let clientData = pageProxy.getClientData();
        clientData.QRCodeImageSource = '';
        pageProxy.getControl('SectionedTable').getSection('SectionImage').redraw();
    }
}

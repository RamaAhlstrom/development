import libCoop from './CooperationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import confirmationCreateFromOperation from '../Confirmations/CreateUpdate/ConfirmationCreateFromOperation';
import confirmationCreateFromWONav from '../Confirmations/CreateUpdate/ConfirmationCreateFromWONav';
import confirmationCreateFromSuboperation from '../Confirmations/CreateUpdate/ConfirmationCreateFromSuboperation';
import {cooperationSetup} from '../Confirmations/CreateUpdate/ConfirmationCreateUpdateOnPageLoad';

/**
 * Cooperation QR Code was scanned successfully
 * Process the data and navigate to confirmation screen if validation succeeded, otherwise display error dialog
 * @param {*} context 
 * @returns 
 */
export default async function CooperationQRCodeScanSuccess(context) {
    const actionResult = context.getActionResult('BarcodeScanner');
    let errorAction = '/SAPAssetManager/Actions/Cooperation/CooperationQRCodeInvalidMessage.action';
    const pageName = libCom.getPageName(context);

    libCom.removeStateVariable(context, 'CooperationErrorAction');
    if (!actionResult) {
        return '';
    }
    const cooperationObject = await libCoop.processCooperationQRCode(actionResult.data, context); //Decrypt the scanned QR Code

    if (cooperationObject) { //Valid Cooperation QR Code
        let isValid = await libCoop.validateQRCode(context, cooperationObject); //Does this QR Code pass user and time validation?
        if (isValid) {
            return await processConfirmation(context, cooperationObject); //Create a new confirmation or update current confirmation
        }
    }

    //Invalid QR Code, so display error prompt
    if (pageName === 'ConfirmationsCreateUpdatePage') { //Failed scan was initiated from the confirmation screen, so reset the segment control
        const formCellContainerProxy = context.getControl('FormCellContainer');
        let segmentControl = formCellContainerProxy.getControl('CooperationSeg');
        segmentControl.setValue('None');
    }
    let overrideErrorAction = libCom.getStateVariable(context, 'CooperationErrorAction');
    if (overrideErrorAction) {
        errorAction = overrideErrorAction;
    }
    return context.executeAction(errorAction);
}

/**
 * Valid QR Code was scanned, so navigate to create confirmation screen or update current confirmation
 * @param {*} context 
 * @param {*} scanObject 
 */
async function processConfirmation(context, cooperationObject) {
    let params = {};
    const pageName = libCom.getPageName(context);

    //Set some parameters and pass to the confirmation create script
    params.CooperationPersonnelNumber = cooperationObject.PERNR;
    params.CooperationNote = cooperationObject.LONG_TEXT;
    params.CooperationType = cooperationObject.Type;
    params.CooperationFeature = 'Support';
    params.isCooperation = true;

    switch (pageName) {
        case 'WorkOrderOperationDetailsPage':
        case 'WorkOrderOperationDetailsWithObjectCards':
            return confirmationCreateFromOperation(context, params);
        case 'WorkOrderDetailsWithObjectCardsPage':
        case 'WorkOrderDetailsPage':
            return confirmationCreateFromWONav(context, params);
        case 'SubOperationDetailsPage':
        case 'SubOperationDetailsClassicPage':
            return confirmationCreateFromSuboperation(context, params);
        case 'ConfirmationsCreateUpdatePage': //Scan was initiated from the confirmation screen, so update the screen fields
            return await cooperationSetup(context, params);
        default:
            return ''; //Unsupported screen
    }    
}

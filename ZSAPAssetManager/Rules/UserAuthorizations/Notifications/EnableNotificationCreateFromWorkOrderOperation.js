// import EnableNotificationCreate from './EnableNotificationCreate';
// import EnableWorkOrderEdit, { IsMyWorkOrderOperationEditable } from '../WorkOrders/EnableWorkOrderEdit';
// import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
// import libPersona from '../../Persona/PersonaLibrary';
import EnableNotificationCreate from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreate'
import EnableWorkOrderEdit, { IsMyWorkOrderOperationEditable } from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import IsPhaseModelEnabled from '../../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';

export default function EnableNotificationCreateFromWorkOrderOperation(clientAPI) {
    /////////////////////////////////////////////////////
    if (IsPhaseModelEnabled(clientAPI) || !EnableNotificationCreate(clientAPI)) {
        if(clientAPI.binding["@odata.type"]=="#sap_mobile.MyWorkOrderOperation")
        {
            return Promise.resolve(true);

        }
        else
        {
            return Promise.resolve(false);

        }
    }
    /////////////////////////////////////////////
    if (!EnableNotificationCreate(clientAPI)) {
        return Promise.resolve(false);
    }

    return EnableWorkOrderEdit(clientAPI);
    // if (IsPhaseModelEnabled(clientAPI) || !EnableNotificationCreate(clientAPI)) {
    //     return Promise.resolve(false);
    // }
    // return Promise.all([
    //     EnableWorkOrderEdit(clientAPI),
    //     IsWCMPersonaWithNonCompletedWorkOrderOperation(clientAPI, clientAPI.binding),
    // ]).then(isEditEnabledArray => isEditEnabledArray.some(isEditEnabled => isEditEnabled === true));
}

function IsWCMPersonaWithNonCompletedWorkOrderOperation(context, myWorkOrderOperation) {
    return libPersona.isWCMOperator(context) ? IsMyWorkOrderOperationEditable(context, myWorkOrderOperation) : Promise.resolve(false);
}

import { SetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { WarehouseTaskStatus } from '../../Common/EWMLibrary';
import Logger from '../../../Log/Logger';

/**
 * Handler for task confirmation button
 * @param {IClientAPI} context 
 */
export default async function OnPressTaskConfirmationButton(context) {
    try {
        await SetSerialNumberMap(context);
    } catch (e) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global'), `Error setting serial number map: ${e}`);
        return Promise.reject(e);
    }

    // Check if the status is confirmed
    if (context.binding.WTStatus === WarehouseTaskStatus.Confirmed) {
        // If status is confirmed, do not navigate to the confirmation page
        return Promise.resolve();
    }

    context.getPageProxy().setActionBinding(context.binding);

    // If status is not confirmed, navigate to the confirmation page
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationNav.action');
}

import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import { isOperationSupportConfirmation } from '../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Returns true if the confirmation indicator is not 3 (operation level only)
* @param {IClientAPI} context
*/
export default async function IsTimeStepVisible(context) {
    const isTimeStepVisible = WorkOrderCompletionLibrary.isStepVisible(context, 'time');
    const binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    
    if (binding?.ControlKey) {
        const isConfirmationSupported = await isOperationSupportConfirmation(context, binding);
        return isConfirmationSupported && isTimeStepVisible;
    }

    return Promise.resolve(isTimeStepVisible);
}

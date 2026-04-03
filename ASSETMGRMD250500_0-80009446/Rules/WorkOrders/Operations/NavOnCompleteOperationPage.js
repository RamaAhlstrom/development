import IsWONotificationVisible from '../Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary, { runComplete } from '../Complete/WorkOrderCompletionLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import {ChecklistLibrary as libChecklist} from '../../Checklists/ChecklistLibrary';
import SmartFormsCompletionLibrary from '../../Forms/SmartFormsCompletionLibrary';
import IsOperationControlKeyAllowsConfirmation from '../../Operations/IsOperationControlKeyAllowsConfirmation';

export default function NavOnCompleteOperationPage(context, actionBinding) {
    context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which may result in infinite loading when CheckRequiredFields action is executed.

    let binding = actionBinding || context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);

    const equipment = binding.OperationEquipment;
    const functionalLocation = binding.OperationFunctionLocation;

    let expandOperationAction = Promise.resolve();
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' && !binding.WOHeader) {
        expandOperationAction = context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.editLink'], [], '$expand=WOHeader');
    }

    return expandOperationAction.then(function(result) {
        if (result && result.length > 0) {
            binding.WOHeader = result.getItem(0).WOHeader;
        }
        //Check for non-complete checklists and ask for confirmation    
        return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(async results => {
            if (results === true) {
                WorkOrderCompletionLibrary.getInstance().setCompletionFlow('operation');
                await WorkOrderCompletionLibrary.getInstance().initSteps(context);
                const isConfirmationEnabled = await IsOperationControlKeyAllowsConfirmation(context, binding);
                if (!isConfirmationEnabled) {
                    WorkOrderCompletionLibrary.updateStepState(context, 'confirmation', { visible: false });
                }
                return IsWONotificationVisible(context, binding.WOHeader, 'Notification').then((notification) => {
                    if (notification) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                            visible: true,
                            data: JSON.stringify(notification),
                            link: notification['@odata.editLink'],
                            initialData: JSON.stringify(notification),
                        });
                    } else {
                        WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                            visible: false,
                        });
                    }

                    return SmartFormsCompletionLibrary.updateSmartformStep(context).then(() => {
                        return runComplete(context, context.localizeText('complete_operation_warning_message'));
                    });
                });
            }
            return Promise.resolve();
        });
    });
}

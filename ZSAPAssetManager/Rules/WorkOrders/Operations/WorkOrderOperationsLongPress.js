// import { areBulkConfirmationsAllowed } from './WorkOrderOperationsDefaultModeButtonVisible';
// import WorkOrderStartedOrOperationLevelAssignment from './WorkOrderStartedOrOperationLevelAssignment';
import { areBulkConfirmationsAllowed } from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderStartedOrOperationLevelAssignment';
import WorkOrderStartedOrOperationLevelAssignment from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderStartedOrOperationLevelAssignment';


export default function WorkOrderOperationsLongPress(context) {
    return 'None';
    return areBulkConfirmationsAllowed(context) && WorkOrderStartedOrOperationLevelAssignment(context) ? 'Multiple' : 'None';
}

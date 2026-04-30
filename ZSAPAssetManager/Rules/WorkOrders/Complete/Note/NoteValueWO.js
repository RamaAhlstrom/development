//import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

import WorkOrderCompletionLibrary from '../../../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';
//import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
export default function NoteValue(context) {
   // alert(JSON.stringify(WorkOrderCompletionLibrary.getStepValue(context, 'note1')))
    return WorkOrderCompletionLibrary.getStepValue(context, 'note1');
}

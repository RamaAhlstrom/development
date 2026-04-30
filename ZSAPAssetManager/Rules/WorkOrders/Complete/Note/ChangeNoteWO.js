// import libCommon from '../../../Common/Library/CommonLibrary';
// import { NoteLibrary as NoteLib, TransactionNoteType } from '../../../Notes/NoteLibrary';
// import Constants from '../../../Common/Library/ConstantsLibrary';
// import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import libCommon from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType } from '../../../../../SAPAssetManager/Rules/Notes/NoteLibrary';
import Constants from '../../../../../SAPAssetManager/Rules/Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../../../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';

export default function ChangeNote(context) {
    libCommon.setStateVariable(context, 'IsOnRejectOperation', false);
    libCommon.setStateVariable(context, 'longtexttype', "Workorder");

    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation(libCommon.getPageName(context)));
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceOrder());
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceItem());
    }
    NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
    let odata = WorkOrderCompletionLibrary.getInstance().getBinding(context);

    let noteEntitySet = libCommon.getStateVariable(context, Constants.transactionNoteTypeStateVariable).component;
let lonftextentity1="MyWorkOrderHeaderLongTexts('"+odata.OrderId+"')"
let lonftextentity="MyWorkOrderHeaders('"+odata.OrderId+"')/HeaderLongText"
    return NoteLib.noteDownload(context, lonftextentity1).then((note) => {
        libCommon.setStateVariable(context, 'SupervisorNote', true);
        let gtft=Constants;
        context.getPageProxy().setActionBinding(odata);

        if (note && note.NewTextString) {
            libCommon.setStateVariable(context, Constants.noteStateVariable, note);
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        } else {
            libCommon.setOnCreateUpdateFlag(context, 'CREATE');
            libCommon.setOnChangesetFlag(context, false);
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
        }
    });
}

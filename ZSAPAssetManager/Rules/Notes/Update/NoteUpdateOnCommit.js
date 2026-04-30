// import {NoteLibrary as NoteLib} from '../NoteLibrary';
// import libCommon from '../../Common/Library/CommonLibrary';
// import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
// import Constants from '../../Common/Library/ConstantsLibrary';
// import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
// import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

import {NoteLibrary as NoteLib} from '../../../../SAPAssetManager/Rules/Notes/NoteLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libTelemetry from '../../../../SAPAssetManager/Rules/Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import Constants from '../../../../SAPAssetManager/Rules/Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsCompleteAction from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/IsCompleteAction';


export default function NoteUpdateOnCommit(clientAPI, aiNote) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    let ref = libCommon.getStateVariable(clientAPI, "longtexttype");
    if (type && type.noteUpdateAction) {
        if (IsCompleteAction(clientAPI)) {
            let note = aiNote || libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
              if(ref=="Workorder"){   
                WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note1', {
                    data: JSON.stringify(note),
                    link: note['@odata.editLink'],
                    value: clientAPI.localizeText('done'),
                });
            }
            else
            {
            WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                data: JSON.stringify(note),
                link: note['@odata.editLink'],
                value: clientAPI.localizeText('done'),
            });
        }
        }

        libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, true);
        return libTelemetry.executeActionWithLogUserEvent(clientAPI, type.noteUpdateAction,
            clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Notes.global').getValue(),
            libTelemetry.EVENT_TYPE_UPDATE);
    }
}

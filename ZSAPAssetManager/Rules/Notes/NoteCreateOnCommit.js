// import { NoteLibrary as NoteLib } from './NoteLibrary';
// import libCommon from '../Common/Library/CommonLibrary';
// import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
// import Constants from '../Common/Library/ConstantsLibrary';
// import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
// import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
// import libVal from '../Common/Library/ValidationLibrary';
// import NotesListLibrary from './List/NotesListLibrary';
// import NoteTypeControlLibrary from './Create/NoteTypeControlLibrary';
// import Logger from '../Log/Logger';
// import NoteUtils from '../Notifications/Utils/NoteUtils';
import { NoteLibrary as NoteLib } from '../../../SAPAssetManager/Rules/Notes/NoteLibrary';
import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libTelemetry from '../../../SAPAssetManager/Rules/Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import Constants from '../../../SAPAssetManager/Rules/Common/Library/ConstantsLibrary';
import IsCompleteAction from '../../../SAPAssetManager/Rules/WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';
import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import NotesListLibrary from '../../../SAPAssetManager/Rules/Notes/List/NotesListLibrary';
import NoteTypeControlLibrary from '../../../SAPAssetManager/Rules/Notes/Create/NoteTypeControlLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import NoteUtils from '../../../SAPAssetManager/Rules/Notifications/Utils/NoteUtils';


export default async function NoteCreateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
     let ref = libCommon.getStateVariable(clientAPI, "longtexttype");
    if (!type) {
        throw new TypeError('Note Transaction Type must be defined');
    }

    const noteTypeValid = NoteTypeControlLibrary.validateNoteTypeControl(clientAPI);
    const noteValueValid = NoteLib.validateNoteFieldValue(clientAPI);
    if (!noteTypeValid || !noteValueValid) return Promise.reject();

    let note = libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
    if (NotesListLibrary.isListNoteCreationAction(clientAPI)) {
        note = '';
    }

    if (note) {
        if (IsCompleteAction(clientAPI)) { if(ref=="Workorder"){                
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
        if (type.noteUpdateAction) {
            libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, false);
            return libTelemetry.executeActionWithLogUserEvent(clientAPI, type.noteUpdateAction,
                clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Notes.global').getValue(),
                libTelemetry.EVENT_TYPE_CREATE).then(() => {
                    libCommon.setStateVariable(context, 'longtexttype', "nodata");
                libCommon.setOnCreateUpdateFlag(clientAPI, '');
            });
        }
    } else if (type.noteCreateAction) {
        const createPromise = libVal.evalIsEmpty(type.noteCreateActionProperties) ?
            clientAPI.executeAction(type.noteCreateAction) :
            clientAPI.executeAction({
                'Name': type.noteCreateAction, 
                'Properties': type.noteCreateActionProperties,
            });

        return createPromise.then(async (result) => {
            if (type.name === 'Notification') {
                try {
                    const historiesCount = await libCommon.getEntitySetCount(clientAPI, 'NotificationHistories', `$filter=NotificationNumber eq '${clientAPI.binding.NotificationNumber}'`);
                    if (historiesCount) {
                        await NoteUtils.createNotificationHistoryText(clientAPI, note, clientAPI.binding.NotificationNumber);
                    }
                } catch (error) {
                    Logger.error('NotificationHistoryTexts creation error', error);
                }
            }
             if(ref=="Workorder"){

                return createPromise.then((result) => {
                    if (IsCompleteAction(clientAPI)) {
                       
                        WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note1', {
                            data: result.data,
                            link: JSON.parse(result.data)['@odata.editLink'],
                            value: clientAPI.localizeText('done'),
                        });
                    }
                    libCommon.setOnCreateUpdateFlag(clientAPI, '');
                    libCommon.setStateVariable(context, 'longtexttype', "nodata");
                 });
            }
            else
            {
            libTelemetry.logUserEvent(clientAPI,
                clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Notes.global').getValue(),
                libTelemetry.EVENT_TYPE_CREATE);
            if (IsCompleteAction(clientAPI)) {
                WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                    data: result.data,
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: clientAPI.localizeText('done'),
                });
            }
            libCommon.setOnCreateUpdateFlag(clientAPI, '');
            libCommon.setStateVariable(context, 'longtexttype', "nodata");
        }
        });
    }

    return Promise.reject();
}

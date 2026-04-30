import { NoteLibrary as NoteLib } from './NoteLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import Constants from '../Common/Library/ConstantsLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import NotesListLibrary from './List/NotesListLibrary';
import NoteTypeControlLibrary from './Create/NoteTypeControlLibrary';
import Logger from '../Log/Logger';
import NoteUtils from '../Notifications/Utils/NoteUtils';

export default async function NoteCreateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
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
        if (IsCompleteAction(clientAPI)) {
            WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                data: JSON.stringify(note),
                link: note['@odata.editLink'],
                value: clientAPI.localizeText('done'),
            });
        }
        if (type.noteUpdateAction) {
            libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, false);
            return libTelemetry.executeActionWithLogUserEvent(clientAPI, type.noteUpdateAction,
                clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Notes.global').getValue(),
                libTelemetry.EVENT_TYPE_CREATE).then(() => {
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
        });
    }

    return Promise.reject();
}

// import libCom from '../Common/Library/CommonLibrary';
// import libVal from '../Common/Library/ValidationLibrary';
// import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';
// import BPNoteType from './List/BPNoteType';
// import NotesListLibrary from './List/NotesListLibrary';
// import NoteType from './List/NoteType';
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import WCMNotesLibrary from '../../../SAPAssetManager/Rules/WCM/WCMNotes/WCMNotesLibrary';
import BPNoteType from '../../../SAPAssetManager/Rules/Notes/List/BPNoteType';
import NotesListLibrary from '../../../SAPAssetManager/Rules/Notes/List/NotesListLibrary';
import NoteType from '../../../SAPAssetManager/Rules/Notes/List/NoteType';

export default function NotesViewCaption(context) {
     if(context.getPageProxy().binding["@odata.id"].includes("WorkOrderH"))
        {
            return context.localizeText("notes_WO");
             
        }
        else if(context.getPageProxy().binding["@odata.id"].includes("Operations"))
        {
            return context.localizeText("notes_OP");

        }
        else if(context.getPageProxy().binding["@odata.id"].includes("Component"))
        {
            return context.localizeText("notes_part");
        }
        else if(context.getPageProxy().binding["@odata.id"].includes("Notification"))
        {
            return context.localizeText("notes_NO");
        }
        else
        {
    const WCMNoteType = libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName);
    if (!libVal.evalIsEmpty(WCMNoteType)) {
        return WCMNotesLibrary.getNoteCaption(context, WCMNoteType);
    }

    if (NotesListLibrary.isListNote(context)) {
        if (NotesListLibrary.isBPNote(context)) {
            return BPNoteType(context).then(type => {
                return type || context.localizeText('note');
            });
        }

        return NoteType(context).then(type => {
            return type || context.localizeText('note');
        });
    }

    return context.localizeText('notes');
}
}

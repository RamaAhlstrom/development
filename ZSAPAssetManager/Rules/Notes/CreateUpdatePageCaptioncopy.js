//import {NoteLibrary as NoteLib} from './NoteLibrary';
import {NoteLibrary as NoteLib} from '../../../SAPAssetManager/Rules/Notes/NoteLibrary';

export default function CreateUpdatePageCaption(pageClientAPI) {
    console.log(NoteLib.getCaption(pageClientAPI))
    let caption="";
          //  caption = pageClientAPI.localizeText('edit_note');
          if(pageClientAPI.binding["@odata.id"].includes("MyWorkOrderHeader"))
            {
                caption = pageClientAPI.localizeText("edit_note1_wo");
            }
            else if(pageClientAPI.binding["@odata.id"].includes("MyWorkOrderOperation"))
            {
                caption = pageClientAPI.localizeText("edit_note1_op");
    
            }
            else if(pageClientAPI._page.previousPage.id.includes("PartDetailsPage") || pageClientAPI.binding["@odata.id"].includes("MyWorkOrderComponentLongTexts"))
            {
                caption = pageClientAPI.localizeText("edit_note1_part");
            }
            else if(pageClientAPI.binding["@odata.id"].includes("MyNotificationHeader") ||  pageClientAPI.binding["@odata.id"].includes("MyNotifHeaderLongTexts"))
            {
                caption = pageClientAPI.localizeText("edit_note_notification");
            }
            else
            {
                caption = pageClientAPI.localizeText("edit_note");
            }
        

        return caption;
    return NoteLib.getCaption(pageClientAPI);
}

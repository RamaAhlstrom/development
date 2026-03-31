export default function Longtext(pageClientAPI) {
    
    // noteTitle = pageClientAPI.localizeText('add_note');
    let noteTitle="";
    if(pageClientAPI.getPageProxy().binding["@odata.id"].includes("WorkOrderH"))
     {
         noteTitle = pageClientAPI.localizeText("notes_WO");
     }
     else if(pageClientAPI.getPageProxy().binding["@odata.id"].includes("Operations"))
     {
         noteTitle = pageClientAPI.localizeText("notes_OP");

     }
     else if(pageClientAPI.getPageProxy().binding["@odata.id"].includes("Component"))
     {
         noteTitle = pageClientAPI.localizeText("notes_part");
     }
     else if(pageClientAPI.getPageProxy().binding["@odata.id"].includes("Notification"))
     {
         noteTitle = pageClientAPI.localizeText("notes_NO");
     }
     else
     {
         noteTitle = pageClientAPI.localizeText("notes");
     }
     return noteTitle;
}
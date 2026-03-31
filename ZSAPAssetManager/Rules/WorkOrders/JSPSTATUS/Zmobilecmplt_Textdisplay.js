export default async function Zmobilecmplt_Textdisplay(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
    let text;
    let pagename = context.getPageProxy()._page.id;
    if (pagename.includes("WorkOrderOperationDetailsPage") || pagename.includes("WorkOrderOperationDetailsWithObjectCards")) {
        let opt= await opzpa(context);

        text = opt;//context.getPageProxy().binding.WOHeader.ZISA;
    }
    else if (pagename.includes("NotificationDetailsPage")) {
        if (context.getPageProxy().binding.WorkOrder == null) {
           return "Workorder not linked to this Notification"
        }
        else {
            text = context.getPageProxy().binding.WorkOrder.ZISA
        }
    }
    else {
        text = context.getPageProxy().binding.ZISA;
    }
    if (text == "" || text == undefined) {
        text = context.localizeText("JSA_Not_Done");//"JSA Not Done"
    }
    else if (text == "X") {
        text = context.localizeText("JSA_Not_OK");//"JSA Not OK"
    }
    else {
        text = context.localizeText("JSA_Completed");//"JSA Completed"
    }
    return text

}

function opzpa(context)
{
   return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding.WOHeader["@odata.readLink"], [], '').then(function(ModifiedEntityResults) {
        if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
            let obj=ModifiedEntityResults.getItem(0);
           return obj.ZISA
        }
    })
}

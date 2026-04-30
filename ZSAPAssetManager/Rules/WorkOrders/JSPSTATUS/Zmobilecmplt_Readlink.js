export default function Zmobilecmplt_Readlink(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
    let readlink;
    if (context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyWorkOrderOperations")) {
        return context.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader["@odata.readLink"]
    }
    else if (context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyNotificationHeaders")) {
        return context.evaluateTargetPath("#Page:-Previous").context.binding.WorkOrder["@odata.readLink"]
    }
    else {
        return context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"];
    }
    return readlink;

}

export default function Zmobilecmplt_Transtation(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
    let readlink=context.evaluateTargetPath("#Page:-Previous").context.binding.OrderId;
    return readlink;
}

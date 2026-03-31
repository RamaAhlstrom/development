export default function Zmobilecmplt_Orderid(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
   let Plant;
   if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyWorkOrderOperations"))
   {
    Plant=context.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.OrderId
   }
   else if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyNotificationHeaders"))
   {
    Plant=context.evaluateTargetPath("#Page:-Previous").context.binding.WorkOrder.OrderId;
    
   }
   else
   {
    Plant= context.evaluateTargetPath("#Page:-Previous").context.binding.OrderId;
    
}

    return Plant;
    
}

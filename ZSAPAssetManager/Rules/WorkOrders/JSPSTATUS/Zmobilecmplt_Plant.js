export default function Zmobilecmplt_Plant(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
   let Plant;
   if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyWorkOrderOperations"))
   {
    Plant=context.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.PlanningPlant
   }
   else if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyNotificationHeaders"))
   {
    Plant=context.evaluateTargetPath("#Page:-Previous").context.binding.WorkOrder.PlanningPlant;
    
   }
   else
   {
    Plant= context.evaluateTargetPath("#Page:-Previous").context.binding.PlanningPlant;
    
}

    return Plant;
    
}

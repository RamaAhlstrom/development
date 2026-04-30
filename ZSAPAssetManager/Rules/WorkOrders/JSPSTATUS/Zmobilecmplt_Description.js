export default function Zmobilecmplt_Description(context) {
    //return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
   let descp;
   if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyWorkOrderOperations"))
   {
    descp=context.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.OrderDescription
    if(descp[descp.length-1]==".")
    {
     descp = descp.substring(0, descp.length - 1);
    }
    else
    {
     descp=descp+".";
    }
   }
   else if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyNotificationHeaders"))
   {
    descp=context.evaluateTargetPath("#Page:-Previous").context.binding.WorkOrder.OrderDescription;
    if(descp[descp.length-1]==".")
    {
     descp = descp.substring(0, descp.length - 1);
    }
    else
    {
     descp=descp+".";
    }
   }
   else
   {
    descp= context.evaluateTargetPath("#Page:-Previous").context.binding.OrderDescription;
    if(descp[descp.length-1]==".")
    {
     descp = descp.substring(0, descp.length - 1);
    }
    else
    {
     descp=descp+".";
    }
}
    return descp
    
}

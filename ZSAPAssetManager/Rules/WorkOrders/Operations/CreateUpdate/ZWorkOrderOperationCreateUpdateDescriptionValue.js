//import {OperationControlLibrary as libOperationControl} from '../WorkOrderOperationLibrary';

export default function ZWorkOrderOperationCreateUpdateDescriptionValue(pageProxy) {
    let descp= pageProxy.evaluateTargetPath("#Control:DescriptionNote/#Value");
    if(descp[descp.length-1]==".")
    {
     descp = descp.substring(0, descp.length - 1);
    }
    else
    {
     descp=descp+".";
    }
    //alert(descp)
    return descp
    // return libOperationControl.getControlKey(pageProxy);
 }
 
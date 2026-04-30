

export default function WorkOrderOperationCreateUpdateMainWorkCenterValue(pageProxy) {
    // let mydata=libOperationControl.getMainWorkCenter(pageProxy);
     //return mydata; 
     if(pageProxy.evaluateTargetPath("#Control:EquipHierarchyExtensionControl/#Value")==undefined && pageProxy.evaluateTargetPath("#Control:FuncLocHierarchyExtensionControl/#Value")==undefined)
     {
         return ""
     }
     else (pageProxy.evaluateTargetPath("#Control:EquipHierarchyExtensionControl/#Value")!=="" || pageProxy.evaluateTargetPath("#Control:FuncLocHierarchyExtensionControl/#Value")!=="")
     {
     return "XX"
     }
 }
 
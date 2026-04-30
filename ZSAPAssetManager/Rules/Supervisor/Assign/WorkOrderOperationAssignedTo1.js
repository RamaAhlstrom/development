
export default function WorkOrderOperationAssignedTo(context) {
    let binding = context.binding;
    
    if(binding.MyWorkOrderOperationCapacityRequirement_.length==0)
    {
        return Promise.resolve("No Split");
    }
    else
    {
        let length=binding.MyWorkOrderOperationCapacityRequirement_.length;
        let numper="";
        for (let index = 0; index < length; index++) {
            const element =binding.MyWorkOrderOperationCapacityRequirement_[index].Employee_Nav.EmployeeName;
            // binding.MyWorkOrderOperationCapacityRequirement_[index].PersonnelNo;
            numper=numper+element+" , ";
        }
        return Promise.resolve(numper);
    }
    
   
}

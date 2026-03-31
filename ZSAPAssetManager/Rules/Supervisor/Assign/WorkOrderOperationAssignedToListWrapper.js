// import assignedTo from './WorkOrderOperationAssignedTo';

// export default function WorkOrderOperationAssignedToListWrapper(context) {
//     return assignedTo(context).then((result) => {
//         if (result === context.localizeText('unassigned')) {
//             return result;
//         }
//         return context.localizeText('assignedto') + ' ' + result;
//     });
// }


import assignedTo from '../../../../SAPAssetManager/Rules/Supervisor/Assign/WorkOrderOperationAssignedTo';

export default function WorkOrderOperationAssignedToListWrapper(context) {
   
    return assignedTo(context).then((result) => {
        if (result === context.localizeText('unassigned')) {
            return result;
        }
        return context.localizeText('person_responsible') + ' ' + result;
    });
}

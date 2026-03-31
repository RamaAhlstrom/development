// import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
// import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
// import MyWorkSectionFSMFilterQuery from './MyWorkSectionFSMFilterQuery';
// import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
// import libPersona from '../../Persona/PersonaLibrary';
import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import MyWorkSectionFilterQuery from '../../../../SAPAssetManager/Rules/OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import MyWorkSectionFSMFilterQuery from '../../../../SAPAssetManager/Rules/OverviewPage/MyWorkSection/MyWorkSectionFSMFilterQuery';
import IsSubOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';


export default function MyWorkSectionFooterLabel(context) {
    return CountMyWork(context)
        .then(count => {
            return count;
        })
        .catch(() => {
            return '';
        });
}

export function CountMyWork(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return MyWorkSectionFSMFilterQuery(context).then(filter => {
            if (IsOperationLevelAssigmentType(context)) {
                //My Operation Count
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', filter);
            } else if (IsSubOperationLevelAssigmentType(context)) {
                //SupOpertaion Count
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', filter);
            } else {
                //My Work Order Count
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', filter);
            }
        });
    } else {
        return MyWorkSectionFilterQuery(context).then(filter => {
            if (IsOperationLevelAssigmentType(context)) {
                //My Operation Count
                let frd=filter;
                        const match = frd.match(/PersonNum eq '(\d+)'/);
                            const number = match ? match[1] : null;
                            console.log(number); 
                            let dummy="$expand=MyWorkOrderOperationCapacityRequirement_,OperationMobileStatus_Nav&$filter=(PersonNum eq '01003394' or MyWorkOrderOperationCapacityRequirement_/any(mc : mc/PersonnelNo eq '01003394')) and OperationMobileStatus_Nav/MobileStatus ne 'Completed'"
                            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', dummy).then(function(ModifiedEntityResults){
                                console.log(ModifiedEntityResults);
                                

                            }).catch((error) => {
                                console.log(error);
                                
                            });
                filter="$expand=MyWorkOrderOperationCapacityRequirement_,OperationMobileStatus_Nav&$filter=(PersonNum eq '"+number+"' or OperationMobileStatus_Nav/MobileStatus eq 'Started' or MyWorkOrderOperationCapacityRequirement_/any(mc : mc/PersonnelNo eq '"+number+"')) and OperationMobileStatus_Nav/MobileStatus ne 'Completed'"
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', filter);
            } else if (IsSubOperationLevelAssigmentType(context)) {
                //SupOpertaion Count
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', filter);
            } else {
                //My Work Order Count
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', filter);
            }
        });
    }
}

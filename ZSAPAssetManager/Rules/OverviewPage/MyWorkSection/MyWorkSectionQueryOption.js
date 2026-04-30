// import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
// import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';
// import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
// import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
// import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
// import CommonLibrary from '../../Common/Library/CommonLibrary';
// import Logger from '../../Log/Logger';
// import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';
// import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import UserFeaturesLibrary from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
//import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
import MyWorkSectionFilterQuery from '../../../../SAPAssetManager/Rules/OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import IsSubOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SupervisorLibrary from '../../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import ClockInClockOutLibrary from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import MobileStatusLibrary from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import PersonalizationPreferences from '../../../../SAPAssetManager/Rules/UserPreferences/PersonalizationPreferences';

//My Work Section Query Option
export default function MyWorkSectionQueryOption(context) {
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;
    let mobileStatusNavlink;
    let array = [];

    return prepareDataForMyWorkSection(context).then(() => {
        return MyWorkSectionFilterQuery(context, '$filter=').then(filter => {
            if (IsOperationLevelAssigmentType(context)) {
                mobileStatusNavlink = 'OperationMobileStatus_Nav';
                //My Operation Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WOHeader/DueDate`;
                expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav,Tools,WOOprDocuments_Nav`;
                entitySet = 'MyWorkOrderOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav';
                }
            } else if (IsSubOperationLevelAssigmentType(context)) {
                mobileStatusNavlink = 'SubOpMobileStatus_Nav';
                //My SubOperation Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,PersonNum,WorkOrderOperation/WOHeader/DueDate`;
                expand = `$expand=Confirmations,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/WOHeader,UserTimeEntry_Nav,WorkOrderOperation/WOHeader/WOPriority,EquipmentSubOperation,EquipmentSubOperation/Location_Nav,FunctionalLocationSubOperation,FunctionalLocationSubOperation/Location_Nav`;
                entitySet = 'MyWorkOrderSubOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav';
                }
            } else {
                mobileStatusNavlink = 'OrderMobileStatus_Nav';
                //My Work Order Query
                orderBy = `$orderby=${mobileStatusNavlink}/MobileStatus desc,WOPartners/PersonnelNum,DueDate,Priority,MarkedJob/PreferenceValue`;
                expand = `$expand=Confirmations,Equipment,Equipment/Location_Nav,FunctionalLocation,FunctionalLocation/Location_Nav,WOPriority,Components,${mobileStatusNavlink},${mobileStatusNavlink}/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,MarkedJob,HeaderLongText,WOPartners,UserTimeEntry_Nav`;
                entitySet = 'MyWorkOrderHeaders';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',OrderISULinks,DisconnectActivity_Nav';
                }
            }
            
////////////////////////////////////extension///////////////////////////////////
            const match = filter.match(/PersonNum eq '(\d+)'/);
            const number = match ? match[1] : null;

            console.log(number); // "01003394"
             expand += ',MyWorkOrderOperationCapacityRequirement_,MyWorkOrderOperationCapacityRequirement_/Employee_Nav';
             //let number=123
   // let filter1="((PersonNum eq '"+number+"' or OperationMobileStatus_Nav/MobileStatus eq 'Started') or (substringof('"+number+"', MyWorkOrderOperationCapacityRequirement_/PersonnelNo) or OperationMobileStatus_Nav/MobileStatus eq 'Started')) and OperationMobileStatus_Nav/MobileStatus ne 'Completed'";
    //let filter1="((PersonNum eq '"+number+"' or OperationMobileStatus_Nav/MobileStatus eq 'Started') or (substringof('"+number+"', MyWorkOrderOperationCapacityRequirement_/PersonnelNo))) and OperationMobileStatus_Nav/MobileStatus ne 'Completed'";
            let filter1 = filter;//
           // if (context.getPageProxy().currentPage.id == "OverviewPage") {
                //filter1 = "$filter=(PersonNum ne '' or OperationMobileStatus_Nav/MobileStatus eq 'Started') and OperationMobileStatus_Nav/MobileStatus ne 'Completed'";
               // let filter1 = "$filter=(PersonNum ne '' or OperationMobileStatus_Nav/MobileStatus eq 'Started') and OperationMobileStatus_Nav/MobileStatus ne 'Completed'";
            try {
                //let PersonalizationPreferences1=PersonalizationPreferences;
                console.log(PersonalizationPreferences.getDeltaSyncPreference(context, 'GowriMyworklayiut1'))
                let datavalue=PersonalizationPreferences.getDeltaSyncPreference(context, 'GowriMyworklayiut1');
                if (datavalue && datavalue.startsWith('"') && datavalue.endsWith('"')) {
                    datavalue = datavalue.substring(1, datavalue.length - 1); // remove quotes
                }
                    
                if (datavalue=='new') {
                    filter1 = filter1.replace("or OperationMobileStatus_Nav/MobileStatus eq 'Started'", "")
                    console.log(filter1)

                }

            } catch (error) {
                console.log(error)

            }  
          //  }
////////////////////////////////////extension///////////////////////////////////
           // filter = filter + '&' + orderBy + '&' + expand + '&' + top;
            filter = filter1 + '&' + orderBy + '&' + expand + '&' + top;
          filter="$expand=MyWorkOrderOperationCapacityRequirement_,OperationMobileStatus_Nav&$filter=(PersonNum eq '"+number+"' or OperationMobileStatus_Nav/MobileStatus eq 'Started' or MyWorkOrderOperationCapacityRequirement_/any(mc : mc/PersonnelNo eq '"+number+"')) and OperationMobileStatus_Nav/MobileStatus ne 'Completed'"
            return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
                if (result) {
                    if (context.getPageProxy().currentPage.id == "OverviewPage") {
                 array = sortObjectsByStatus(context, result, mobileStatusNavlink);
            }
            else
            {
                    array = sortObjectsByStatus(context, result, mobileStatusNavlink);
            }
                }
                return array;
            });
        });
    });
}

export function sortObjectsByStatus(context, objects, mobileStatusNavlink) {
    const { STARTED, RECEIVED, HOLD, REVIEW, COMPLETED, DISAPPROVED } = MobileStatusLibrary.getMobileStatusValueConstants(context);
    const startedArray = [];
    const holdArray = [];
    const receivedArray = [];
    const reviewArray = [];
    let finalArray = [];
    let mobileStatus;

    objects.forEach(object => {
        mobileStatus = object[mobileStatusNavlink]?.MobileStatus;

        switch (mobileStatus) {
            case STARTED:
                startedArray.push(object);
                break;
            case HOLD:
                holdArray.push(object);
                break;
            case RECEIVED:
            case COMPLETED:
                receivedArray.push(object);
                break;
            case REVIEW:
            case DISAPPROVED:
                reviewArray.push(object);
                break;
            default:
                receivedArray.push(object);
                break;
        }
    });

    finalArray = startedArray.concat(holdArray, reviewArray, receivedArray);
    return finalArray;
}

export function prepareDataForMyWorkSection(context) {
    CommonLibrary.setStateVariable(context, 'UserRoleType', 'T');
    CommonLibrary.setStateVariable(context, 'StartedCount', 0);

    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let isUserSupervisorPromise = SupervisorLibrary.isUserSupervisor(context);
    let startedCountPromise;

    let userId = CommonLibrary.getSapUserName(context);
    let isCICOEnabled = ClockInClockOutLibrary.isCICOEnabled(context);
    let queryOption, isAnythingStartedStateVar;
    if (IsOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnyOperationStarted';
        queryOption = `$filter=OperationMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OperationMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', queryOption);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnySubOperationStarted';
        queryOption = `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and SubOpMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find sub-operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', queryOption);
    } else {
        isAnythingStartedStateVar = 'isAnyWorkOrderStarted';
        queryOption = `$expand=OrderMobileStatus_Nav&$filter=OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OrderMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find work orders that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);
    }

    return Promise.all([isUserSupervisorPromise, startedCountPromise])
        .then(([isSupervisor, startedCount]) => {
            let roletype = isSupervisor ? 'S' : 'T';
            CommonLibrary.setStateVariable(context, 'UserRoleType', roletype);
            CommonLibrary.setStateVariable(context, 'StartedCount', startedCount);
            CommonLibrary.setStateVariable(context, isAnythingStartedStateVar, startedCount > 0);
            return Promise.resolve();
        })
        .catch((error) => {
            Logger.error('prepareDataForMyWorkSection', error);
            return Promise.resolve();
        });
}

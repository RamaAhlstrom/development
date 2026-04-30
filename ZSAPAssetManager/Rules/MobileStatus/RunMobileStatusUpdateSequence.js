// import libCom from '../Common/Library/CommonLibrary';
// import { StatusTransitionTextsVar } from '../Common/Library/GlobalStatusTransitionTexts';
// import Logger from '../Log/Logger';
// import libMobile from './MobileStatusLibrary';
// import MobileStatusUpdateActionsOrRulesSequence from './MobileStatusUpdateActionsOrRulesSequence';
// import MobileStatusUpdateResultsClass from './MobileStatusUpdateResultsClass';
// import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
// import ValidationLibrary from '../Common/Library/ValidationLibrary';
// import IsGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import { StatusTransitionTextsVar } from '../../../SAPAssetManager/Rules/Common/Library/GlobalStatusTransitionTexts';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import libMobile from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateActionsOrRulesSequence from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusUpdateActionsOrRulesSequence';
import MobileStatusUpdateResultsClass from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusUpdateResultsClass';
import IsPhaseModelEnabled from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import UserFeaturesLibrary from '../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import ValidationLibrary from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import IsGuidedFlowEnabled from '../../../SAPAssetManager/Rules/GuidedWorkFlow/IsGuidedFlowEnabled';

export default async function RunMobileStatusUpdateSequence(context, bindingObject, status, index, savedSequences) {
    const binding = bindingObject || getBindingObject(context);
    let objectType = libMobile.getMobileStatusNavLink(context, binding)?.OverallStatusCfg_Nav?.ObjectType;
    if (ValidationLibrary.evalIsEmpty(objectType)) {
        objectType = libCom.getMobileStatusEAMObjectType(context, binding);
    }
    const updateToStatus = status || await getUpdateToStatus(context, binding, objectType);
    const sequences = savedSequences || await MobileStatusUpdateActionsOrRulesSequence(context, updateToStatus, binding);
  // alert("4")
   ///////////////////////////////////////////////////////
   if(updateToStatus.MobileStatus=="STARTEDte" )
    {
        //let url="MyWorkOrderOperationLongTexts(OperationNo='"+binding.OperationNo+"',OrderId='"+binding.OrderId+"')";
        //let url1="MyWorkOrderOperations(OperationNo='"+binding.OperationNo+"',OrderId='"+binding.OrderId+"')";
        let url="MyWorkOrderOperationLongTexts(OrderId='"+binding.OrderId+"',OperationNo='"+binding.OperationNo+"')";
        // let url1="MyWorkOrderOperations(OperationNo='"+binding.OperationNo+"',OrderId='"+binding.OrderId+"')";
         let url1="MyWorkOrderOperations(OrderId='"+binding.OrderId+"',OperationNo='"+binding.OperationNo+"')";
      
        let pro={Property: "WorkOrderOperation", Target: {EntitySet: "MyWorkOrderOperations", QueryOptions: "", ReadLink: url1,"uniqueIdType":""}}
       // let context=pageClientAPI;
         context.read('/SAPAssetManager/Services/AssetManager.service', url, [], '').then(function(ModifiedEntityResults) {
            if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
                let obj=ModifiedEntityResults.getItem(0);
                 //////////////////////////////////////
                //////////////////////////////////////////
                let text=obj.TextString
                if(text.includes("Clock"))
                {
                }
                else
                {                  
           // alert("Update");
                 context.executeAction({
                     'Name': '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOOperation.action',
                     'Properties': {
                    "_Type": "Action.Type.ODataService.UpdateEntity",
                    "Target": {
                        "EntitySet": "MyWorkOrderOperationLongTexts",
                        "Service": "/SAPAssetManager/Services/AssetManager.service",
                        "ReadLink": obj["@odata.readLink"]  
                    },
                    "Properties": {
                        "OrderId":binding.OrderId,
                        "OperationNo": binding.OperationNo,
                        "NewTextString": "\n\n Clock in clicked",
                        "TextString": obj.TextString + '\n\n' + " Clock in clicked"
                    },
                    "Headers": {
                         "OfflineOData.TransactionID": binding.OrderId
                    },
                    "OnSuccess": "",
                    "OnFailure": "/SAPAssetManager/Actions/Notes/NoteCreateFailureMessage.action",
                    "UpdateLinks": [pro],
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText" : "  "
                }}).then(causeResult => {
                   // alert("update")
                    });
                }
            }
            else
            {
                return context.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                        'Properties': {
                            'Title': "Something went wrong",
                            'Message': "nothing",//"Operation Technical Object Manditory",//context.localizeText(message)
                            'OKCaption': context.localizeText('ok'),
                            'OnOK': '',
                        },
                    },
                );
            }
           // return clientAPI.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
        }).catch((error) => {
            console.log(error);
            //let context=clientAPI;
            //////////////////////////////////////
            //alert("insert");
            //////////////////////////////////////
     context.executeAction({
        'Name': '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOOperation.action',
        'Properties': {        
            "Target": {
                "EntitySet": "MyWorkOrderOperationLongTexts",
                "Service": "/SAPAssetManager/Services/AssetManager.service"
            },
            "Properties": {
                "OrderId": binding.OrderId,
                "OperationNo": binding.OperationNo,
                "NewTextString": "Clock in clicked",
                "TextString": "Clock in clicked"
            },
            "Headers": {
                "OfflineOData.RemoveAfterUpload": "true",
                "OfflineOData.TransactionID": binding.OrderId
            },
            "OnSuccess": "",
            "OnFailure": "/SAPAssetManager/Actions/Notes/NoteCreateFailureMessage.action",
            "CreateLinks":  [pro]
         },
        }).then(causeResult => {
       // alert("Done");
       ///SAPAssetManager/Rules/Notes/NoteCreateOnSuccess.js
        });
    ////////////
          
            
            
        });
    }
///////////////////////////////////////////////////////
    ///////////////////////////////////////////////
    //alert(binding.WOHeader.ZISA=="" && updateToStatus.MobileStatus=="STARTED")
    // if(binding.WOHeader.ZISA=="" && updateToStatus.MobileStatus=="STARTED")
    //     {
    //         try {
    //              binding["sequences"]=sequences;                
    //              binding["updateToStatus"]=updateToStatus;
    //         libCom.setStateVariable(context, 'updateToStatus', JSON.stringify(updateToStatus));
    //         libCom.setStateVariable(context, 'sequences', JSON.stringify(sequences));
                
    //         } catch (error) {
    //             alert(`Action Failed: ${error}`);
    //         }
    //         //alert("Open1")
    //         context.executeAction("/ZSAPAssetmanager/Actions/WorkOrders/JSPSTATUS/JSPConformation.action");
    //        // alert("Open")
    //         return false;
    //     }
        //////////////////////////////////////////////
    if (sequences?.length > 0) {
        if (!libCom.isDefined(index)) {
            index = 0;
        }

        context.showActivityIndicator('');
        rebindDataForObjectCards(context, binding);

        if (libCom.isDefined(sequences[index].Action)) {
            return context.executeAction(sequences[index].Action)
                .then(() => runNextSequenceItemOrFinish(context, binding, updateToStatus, index, sequences))
                .catch(err => handleError(context, err));
        }
        if (libCom.isDefined(sequences[index].Rule)) {
            return context.getDefinitionValue(sequences[index].Rule)
                .then(() => runNextSequenceItemOrFinish(context, binding, updateToStatus, index, sequences))
                .catch(err => handleError(context, err));
        }
        if (sequences[index].Function) {
            const funcResult = sequences[index].Function();
            const promise = isPromise(funcResult) ? funcResult : Promise.resolve(funcResult);

            return promise
                .then(() => runNextSequenceItemOrFinish(context, binding, updateToStatus, index, sequences))
                .catch(err => handleError(context, err));
        }

        return true;
    }
}

function runNextSequenceItemOrFinish(context, binding, updateToStatus, index, sequences) {
    context.dismissActivityIndicator();
    const skipAll = MobileStatusUpdateResultsClass.getInstance().isSkipAllActive();
    if (index === sequences.length - 1 || skipAll) {
        MobileStatusUpdateResultsClass.getInstance().resetAll();
        return true;
    }

    index = index + 1;
    return RunMobileStatusUpdateSequence(context, binding, updateToStatus, index, sequences);
}

function handleError(context, err) {
    context.dismissActivityIndicator();
    MobileStatusUpdateResultsClass.getInstance().resetAll();

    if (err === 'canceled') {
        return true;
    }

    Logger.error('RunMobileStatusUpdateSequence', err);
    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}

function getBindingObject(context) {
    let binding = context.binding;

    if (context.constructor.name === 'SectionedTableProxy' && context.getPageProxy().getExecutedContextMenuItem()) {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    if (!libCom.isDefined(binding)) {
        const pageProxy = context.getPageProxy?.() || context;
        binding = pageProxy.getActionBinding();
    }

    if (!libCom.isDefined(binding)) {
        binding = libCom.getStateVariable(context, 'IsOnOperationBinding');
    }

    return binding;
}

function isPromise(value) {
    return typeof value?.then === 'function';
}

function getUpdateToStatus(context, binding, objectType) {
    if (context.getTitle) {
        const mobileStatusForTextKey = StatusTransitionTextsVar.getStatusTransitionTexts(objectType)?.[context.getTitle()];
        if (mobileStatusForTextKey) {
            return getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType);
        }
    }

    return { 'MobileStatus': '' };
}

export async function getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType) {
    const { CONFIRM, UNCONFIRM, ASSIGN, UNASSIGN, REASSIGN } = libMobile.getMobileStatusValueConstants(context);

    // don't run this logic for statuses that aren't data driven
    if ([CONFIRM, UNCONFIRM, ASSIGN, UNASSIGN, REASSIGN].includes(mobileStatusForTextKey?.MobileStatus)) {
        return mobileStatusForTextKey;
    }

    const guidedFlowEnabled = await IsGuidedFlowEnabled(context);
    const currentStatusObj = libMobile.getMobileStatusNavLink(context, binding);
    const select = [
        'TransitionTextKey', 'MobileStatus', 'Status', 'OverallStatusLabel',
        'EAMOverallStatusProfile', 'EAMOverallStatus', 'ObjectType',
        ...(IsPhaseModelEnabled(context) ? ['Phase', 'Subphase'] : []),
    ];

    const filters = [
        `MobileStatus eq '${mobileStatusForTextKey?.MobileStatus}'`,
        `ObjectType eq '${objectType}'`,
    ];

    try {
        const configs = await context.read('/SAPAssetManager/Services/AssetManager.service',
            guidedFlowEnabled ? 'GuidedFlowStatusConfigs' : 'EAMOverallStatusConfigs', select, `$filter=${filters.join(' and ')}`);

        if (configs?.length > 1) {
            let EAMOverallStatusProfileFromOrderType = await getEAMOverallStatusProfileFromOrderTypeInfo(context, binding);
            const configWithMatchingOrderProfile = Array.from(configs).find(config => config.EAMOverallStatusProfile === EAMOverallStatusProfileFromOrderType);
            if (configWithMatchingOrderProfile) {
                return configWithMatchingOrderProfile;
            }

            const configWithMatchingProfile = Array.from(configs).find(config => config.EAMOverallStatusProfile === currentStatusObj?.EAMOverallStatusProfile);
            if (configWithMatchingProfile) {
                return configWithMatchingProfile;
            }
        }

        return configs?.getItem(0);
    } catch (error) {
        Logger.error('getUpdateToStatusConfig', error);
        return {};
    }
}

async function getEAMOverallStatusProfileFromOrderTypeInfo(context, binding) {
    if (binding) {
        let orderType;

        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                orderType = binding.OrderType;
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
                orderType = binding.WOHeader?.OrderType;
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
                orderType = binding.WorkOrderOperation?.WOHeader?.OrderType;
                break;
            default:
                break;
        }

        if (orderType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['EAMOverallStatusProfile'], `$filter=OrderType eq '${orderType}'`).then(orderTypeArray => {
                if (orderTypeArray.length > 0) {
                    return orderTypeArray.getItem(0).EAMOverallStatusProfile;
                }
                return undefined;
            });
        }
    }
   
    return Promise.resolve(undefined);
}

/**
 * We can't rely on MDK to keep action binding till the end of update sequence,
 * so set action binding manually, if it was released
 */
function rebindDataForObjectCards(context, binding) {
    if (context.constructor.name === 'FioriToolbarButtonProxy' ||
        context.getPageProxy().getExecutedContextMenuItem?.()) {
        return;
    }

    if (!context.getPageProxy().getActionBinding()) {
        context.getPageProxy().setActionBinding(binding);
    }
}

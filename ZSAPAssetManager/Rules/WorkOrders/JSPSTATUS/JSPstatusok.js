
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libClock from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import PersonaLibrary from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import AppVersionInfo from '../../../../SAPAssetManager/Rules/UserProfile/AppVersionInfo';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
export default function ZmobilecmpltCreate(context) {
    
    let status1;
    let status;
    let context1;
    let binding ;//= actionBinding || context.binding;
  //function MobileStatusUpdateOverride(context, status, mobileStatusNavLink, successAction, actionBinding) {
if(context.binding==undefined)
{
    
    let fr=libCom;
    console.log(libCom.getStateVariable(context, 'PhaseModelRollbackStatusGowri'));
    context1=libCom.getStateVariable(context, 'PhaseModelRollbackStatusGowri');
    status=context1.WOHeader.statusElement;
    binding=context1
   // context.binding=context1;
   // context1=context;
    // context1.statusElement=context1.WOHeader.statusElement
    // context1["binding"]=context1;
   
    //libComm.getStateVariable(context, 'isAnyOperationStarted');
   // common.setStateVariable(context, 'PhaseModelRollbackStatusGowri', context.binding);
}
else
{
    
    context1=context;
    status=context.binding.WOHeader.statusElement;
    context1.binding.statusElement=context.binding.WOHeader.statusElement;
    binding=context.binding
}

  let mobileStatusNavLink="OperationMobileStatus_Nav", successAction='/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js';
  let odataDate = new ODataDate();
  let gr= odataDate.toDBDateTimeString(context);
  let gr1= libCom.getUserGuid(context);
  let gr2= libCom.getSapUserName(context);

    //Force these detail pages to recalculate after updating a mobile status to keep toolbar in sync
    libCom.removeStateVariable(context, 'isAnyOperationStarted');
    libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
    
    let operationBinding = libCom.getStateVariable(context, 'IsOnRejectOperationBinding');
    if (operationBinding && !binding) {
        binding = operationBinding;
    }

    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let ignore = false;

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') { //We pass up a dummy complete record here, since we don't yet know if complete checks will pass
        if (status.MobileStatus === COMPLETE || status.MobileStatus === REVIEW) {
            ignore = true;
            libCom.setStateVariable(context, 'MobileStatusReadLinkSaveRequired', binding[mobileStatusNavLink]['@odata.readLink']);
            let dummy = getStatusByMobileStatus(status, COMPLETE);
            status.MobileStatus = 'D-' + dummy; //Need a dummy status so the actual status can be updated on this record later after successful checks
        }
    }

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') { //We pass up a dummy complete record here, since we don't yet know if complete checks will pass
        if (status.MobileStatus === COMPLETE || status.MobileStatus === REVIEW) {
            ignore = true;
            let dummy = getStatusByMobileStatus(status, COMPLETE);
            status.MobileStatus = 'D-' + dummy; //Need a dummy status so the actual status can be updated on this record later after successful checks
        }
    }

    let updateMode = 'Merge';
    if (libClock.isCICOEnabled(context)) {
        updateMode = 'Replace'; //Force all properties to be passed for CICO feature so the same status can go up back-to-back if necessary
    }

    const headers = {
        'OfflineOData.NonMergeable': true,
        'Transaction.Ignore': ignore,
    };

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties':
        {
            'Properties':
            {
                'MobileStatus': status.MobileStatus,
                'EAMOverallStatusProfile': status.EAMOverallStatusProfile,
                'EAMOverallStatus': status.EAMOverallStatus,
                'Status': status.Status,
                'EffectiveTimestamp': gr,
                'CreateUserGUID': gr1,
                'CreateUserId': gr2,
            },
            'Target':
            {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink': binding[mobileStatusNavLink]['@odata.readLink'],
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Headers': headers,
            'RequestOptions': {
                'UpdateMode': updateMode,
            },
            'UpdateLinks':
                [{
                    'Property': 'OverallStatusCfg_Nav',
                    'Target':
                    {
                        'EntitySet': 'EAMOverallStatusConfigs',
                        'ReadLink': `EAMOverallStatusConfigs(Status='${status.Status}',EAMOverallStatusProfile='${status.EAMOverallStatusProfile}')`,
                    },
                }],
            'OnSuccess': successAction,
            'ActionResult': {
                '_Name': 'MobileStatusUpdate',
            },
            'ShowActivityIndicator': true,
        },
    });
}

function getStatusByMobileStatus(status, COMPLETE) {
    return status.MobileStatus === COMPLETE ? 'COMPLETE': 'REVIEW';
} 

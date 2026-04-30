
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderMobileStatusLibrary from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';

export default async function PartDetailsAddButtonVisible(pageClientAPI) {
    let isWOCompleted = await WorkOrderMobileStatusLibrary.isOrderComplete(pageClientAPI);
    let currentReadLink = libCommon.getTargetPathValue(pageClientAPI, '#Property:@odata.readLink');
    let isWOEditEnabled = libCommon.getAppParam(pageClientAPI, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y';
    
    return isWOEditEnabled && !libCommon.isCurrentReadLinkLocal(currentReadLink) && !isWOCompleted;
}

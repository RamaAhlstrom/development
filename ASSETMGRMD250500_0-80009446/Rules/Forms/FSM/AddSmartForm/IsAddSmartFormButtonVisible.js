import CommonLibrary from '../../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';
import IsServiceItem from '../../../ServiceItems/CreateUpdate/IsServiceItem';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';
import FSMSmartFormsLibrary from '../FSMSmartFormsLibrary';

export default async function IsAddSmartFormButtonVisible(context) {
    if (!FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context)) return Promise.resolve(false);

    let isVisible = false;
    const binding = context.getPageProxy().binding;

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        const isServiceItemCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding);
        const isServiceItem = await IsServiceItem(context, binding);
        isVisible = !isServiceItemCompleted && isServiceItem;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        const isServiceItemCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding);
        isVisible = !isServiceItemCompleted;
    }

    const isOperationStatusChangeable = MobileStatusLibrary.isOperationStatusChangeable(context);
    const isHeaderStatusChangeable = MobileStatusLibrary.isHeaderStatusChangeable(context);
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        const isOperationCompleted = await MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderOperations', binding.OrderId, binding.OperationNo);
        isVisible = !isOperationCompleted && (isOperationStatusChangeable || isHeaderStatusChangeable);
    }

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        const isOrderCompleted = await MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', binding.OrderId);
        isVisible = !isOrderCompleted && (isOperationStatusChangeable || isHeaderStatusChangeable);
    }

    return isVisible && !CommonLibrary.isEntityLocal(binding);
}

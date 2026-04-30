import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import ODataLibrary from '../../OData/ODataLibrary';

export default function WorkOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    let iconImage = [];

    // check if this WO has any docs
    const docsIcon = AttachedDocumentIcon(context, binding.WODocuments);
    if (docsIcon) {
        iconImage.push(docsIcon);
    }

    // check if this is a Marked Job
    if (binding.MarkedJob && binding.MarkedJob.PreferenceValue && binding.MarkedJob.PreferenceValue === 'true') {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/favoriteListIcon.android.png' : '/SAPAssetManager/Images/favoriteListIcon.png');
    }

    let hasLocalOperation = binding.Operations ? binding.Operations.find(operation => ODataLibrary.hasAnyPendingChanges(operation)) : false;
    // check if this order requires sync
    if (ODataLibrary.hasAnyPendingChanges(binding) || hasLocalOperation || ODataLibrary.hasAnyPendingChanges(context, binding.OrderMobileStatus_Nav) || ODataLibrary.hasAnyPendingChanges(context, binding.HeaderLongText[0])) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}

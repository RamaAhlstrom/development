import libCommon from '../../Common/Library/CommonLibrary';
import ManageDeepLink from '../../DeepLinks/ManageDeepLink';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function PartIssueNav(context) {
    let binding = context.getPageProxy().getActionBinding() || context.binding;
    let textItemCode = libCommon.getAppParam(context, 'PART', 'TextItemCategory');
    let action = '/SAPAssetManager/Actions/Parts/PartIssueNotEditableMessage.action';

    //Text items cannot be issued
    if (binding && Object.prototype.hasOwnProperty.call(binding, 'ItemCategory')) {
        if (binding.ItemCategory !== textItemCode) {
            action = '/SAPAssetManager/Actions/Parts/PartIssueCreateChangeset.action';
        }
    }

    if (!binding) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        action = '/SAPAssetManager/Actions/Parts/PartIssueCreateChangeset.action';
    }

    TelemetryLibrary.logUserEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/TechnicianGoodsIssue.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_COMPLETE);

    return context.executeAction(action);
}


import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function RelatedNotificationsDetailsNav(context) {
    return libTelemetry.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationsDetailsNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/NotificationHistories.global').getValue(),
        libTelemetry.PAGE_TYPE_DETAIL);
}

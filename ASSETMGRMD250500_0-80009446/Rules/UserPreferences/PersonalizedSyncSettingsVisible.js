import libPersona from '../Persona/PersonaLibrary';

export default function PersonalizedSyncSettingsVisible(context) {
    const settingName = context.getName();

    switch (settingName) {
        case 'AutoSyncPeriodicControl':
            return true;
        case 'AutoSyncStatusSwitch':
        case 'AutoSyncAppLaunchSwitch':
        case 'AutoSyncOfflineOnlineSwitch':
            return !(libPersona.isWCMOperator(context) ||
            libPersona.isInventoryClerk(context) ||
            libPersona.isExtendedWarehouseClerk(context) ||
            libPersona.isEnableFieldLogisticsOperator(context)
        );
    }
}

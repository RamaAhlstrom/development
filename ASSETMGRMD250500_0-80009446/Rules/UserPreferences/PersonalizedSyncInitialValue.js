import PersonalizationPreferences from './PersonalizationPreferences';
import IsUploadOnlyPersonalized from './IsUploadOnlyPersonalized';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function PersonalizedSyncInitialValue(context) {
    const controlName = context.getName();
    const autoSyncGlobalValue = context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSync.global').getValue();
    const periodicValue = CommonLibrary.getAppParam(context, autoSyncGlobalValue, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue());
    switch (controlName) {
        case 'ManualUploadSwitch':
            return IsUploadOnlyPersonalized(context);
        case 'AutoSyncPeriodicControl':
            return PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), 'not_defined') === 'not_defined' ? 
            (Number(periodicValue) > 0 ? Number(periodicValue) /60 : 0) : 
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), 0);
        case 'AutoSyncStatusSwitch':
            return PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global').getValue(), 'not_defined') === 'not_defined' ? 
            (CommonLibrary.getAppParam(context, autoSyncGlobalValue, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global').getValue()) === 'Y' ? true : false) : 
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global').getValue());
        case 'AutoSyncAppLaunchSwitch':
            return PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global').getValue(), 'not_defined') === 'not_defined' ? 
            (CommonLibrary.getAppParam(context, autoSyncGlobalValue, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global').getValue()) === 'Y' ? true : false) : 
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global').getValue());
        case 'AutoSyncOfflineOnlineSwitch':
            return PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global').getValue(), 'not_defined') === 'not_defined' ? 
            (CommonLibrary.getAppParam(context, autoSyncGlobalValue, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global').getValue()) === 'Y' ? true : false) :  
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global').getValue());
        default:
            return false;
    }
}

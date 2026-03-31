import PersonalizationPreferences from './PersonalizationPreferences';
import CommonLibrary from '../Common/Library/CommonLibrary';
import IsSyncProfileOverride from './IsSyncProfileOverride';

export default function IsUploadOnlyPersonalized(context) {
    if (IsSyncProfileOverride(context)) {
        const syncConfig = context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/SyncConfig.global').getValue();
        const defaultSyncProfile = context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/DefaultSyncProfile.global').getValue();
        const uploadOnly = context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/UploadOnly.global').getValue(); 
        const uploadOnlyPersonalizedValue = PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/UploadOnly.global').getValue(), 'not_defined');
        //get the default value from the from app parameters if the user has not personalized the value
        return uploadOnlyPersonalizedValue === 'not_defined' ?
            CommonLibrary.getAppParam(context, syncConfig, defaultSyncProfile) === uploadOnly : uploadOnlyPersonalizedValue;
    }
    return false;
}

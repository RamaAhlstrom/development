import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function IsAutoSyncFeatureEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/AutoSync.global').getValue());
}

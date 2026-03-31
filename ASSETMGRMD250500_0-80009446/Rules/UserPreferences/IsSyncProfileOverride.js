import CommonLibrary from '../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IContext} context
*/
export default function IsSyncProfileOverride(context) {
    const syncConfig = context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/SyncConfig.global').getValue();
    const syncProfileOverride = context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/SyncProfileOverride.global').getValue();     
    return CommonLibrary.getAppParam(context, syncConfig, syncProfileOverride) === 'Y' ? true : false;
}

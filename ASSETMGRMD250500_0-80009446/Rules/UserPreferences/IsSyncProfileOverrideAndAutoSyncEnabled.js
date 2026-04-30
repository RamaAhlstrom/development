import IsSyncProfileOverride from './IsSyncProfileOverride';
import IsAutoSyncFeatureEnabled from './IsAutoSyncFeatureEnabled';
/**
* Enable only when the SyncProfileOverride is true and the AutoSync feature is enabled.
* @param {IContext} context
*/
export default function IsSyncProfileOverrideAndAutoSyncEnabled(context) {
    return IsSyncProfileOverride(context) && IsAutoSyncFeatureEnabled(context);
}

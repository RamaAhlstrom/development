import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

/**
 * Is the cooperation feature enabled?
 * @param {} context 
 * @returns 
 */
export default function cooperationIsEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Cooperation.global').getValue());
}

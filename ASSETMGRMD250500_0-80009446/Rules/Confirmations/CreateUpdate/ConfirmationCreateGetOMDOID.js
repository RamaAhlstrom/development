import CooperationIsEnabled from '../../Cooperation/CooperationIsEnabled';
import AppVersionInfo from '../../UserProfile/AppVersionInfo';
import Logger from '../../Log/Logger';

/**
 * If this is a cooperation confirmation, return the custom omdo for SAM 2505+
 * Otherwise return a dummy that backend will ignore (It cannot be left blank)
 * @param {} context 
 * @returns 
 */
export default function ConfirmationCreateOMDOID(context) {
    try {
        let binding = context.binding;
    
        if (CooperationIsEnabled(context)) {
            if (binding.ConfirmationScenario === '10' || binding.isCooperation) {
                return `SAM${AppVersionInfo(context).split('.')[0]}_PM_EAM_CONFIRMATION`;
            }
        }
    } catch (e) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(), 'ConfirmationCreateOMDOID: ' + e);
    }

    return 'DUMMYIGNORE'; // Dummy value that backend will ignore
}

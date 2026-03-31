import CommonLibrary from '../../Common/Library/CommonLibrary';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import { reloadUserTimeEntriesForLocalStatus } from './ObjectCardButtonVisible';

/**
 * Common function to get object card button title. Takes in transaction type(s) and returns one or all corresponding title(s)
 * @param {*} context 
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {boolean} [findAll=false] indicates if function should return all titles that match passed transition types
 * @returns object card button title
 */
export default async function ObjectCardButtonTitle(context, transitionTypes = [], findAll = false) {
    const binding = context.binding;
    const objectType = CommonLibrary.isDefined(CommonLibrary.getMobileStatusEAMObjectType(context,binding)) ? CommonLibrary.getMobileStatusEAMObjectType(context,binding) : MobileStatusLibrary.getMobileStatusNavLink(context)?.OverallStatusCfg_Nav?.ObjectType;
    let currentStatusOverride = null;

    if ([
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue(),
    ].includes(objectType)) {
        await reloadUserTimeEntriesForLocalStatus(context, binding);
        currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    const options = await StatusGeneratorWrapper.generateMobileStatusOptions();

    if (findAll) {
        return options.filter(item => transitionTypes.includes(item.TransitionType));
    }

    const action = options.find(item => transitionTypes.includes(item.TransitionType));

    return CommonLibrary.isDefined(action) ?
        action.Title :
        '';
}

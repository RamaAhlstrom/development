import CommonLibrary from '../../Common/Library/CommonLibrary';
import { StatusTransitionTextsVar } from '../../Common/Library/GlobalStatusTransitionTexts';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import RunMobileStatusUpdateSequence, { getUpdateToStatusConfig } from '../../MobileStatus/RunMobileStatusUpdateSequence';
import { reloadUserTimeEntriesForLocalStatus } from './ObjectCardButtonVisible';

/**
 * Common function to get object card button OnPress action. Takes in transaction type(s) and executes corresponding on press action
 * @param {*} context 
 * @param {*} binding 
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {boolean} [findAll=false] indicates if function should find all items that match passed transition types
 * @param {*} [primaryType=null] primary transition type among passed transitionTypes
 * @returns either status update sequence or error message, if needed action is not found
 */
export default async function ObjectCardButtonOnPress(context, binding, transitionTypes, findAll = false, primaryType = null) {
    const objectType = CommonLibrary.isDefined(CommonLibrary.getMobileStatusEAMObjectType(context,binding)) ? CommonLibrary.getMobileStatusEAMObjectType(context,binding) : MobileStatusLibrary.getMobileStatusNavLink(context)?.OverallStatusCfg_Nav?.ObjectType;
    let currentStatusOverride = null;
    let action = null;

    if ([
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue(),
    ].includes(objectType)) {
        await reloadUserTimeEntriesForLocalStatus(context, binding);
        currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    const options = await StatusGeneratorWrapper.generateMobileStatusOptions();

    // In some cases like S4 orders/items we don't know needed transition type beforehand
    // and we have to determine what action will be executed based on items available
    if (findAll) {
        const actions = options.filter(item => transitionTypes.includes(item.TransitionType));
        action = actions.length > 1 ?
            actions.find(item => item.TransitionType === primaryType) :
            actions[0];
    } else {
        action = options.find(item => transitionTypes.includes(item.TransitionType));
    }

    if (action) {
        const mobileStatusForTextKey = StatusTransitionTextsVar.getStatusTransitionTexts(objectType)?.[action.Title];
        const updateToStatus = await getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType);
        context.getPageProxy().setActionBinding(binding);
        return RunMobileStatusUpdateSequence(context, binding, updateToStatus);
    }

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}

import cooperationIsEnabled from './CooperationIsEnabled';

/**
 * Used to determine if cooperation confirmations should be enabled for the current work order
 * PerformMaintJobCtrlParams entity is used to decide this, using Action = 'A' for current OrderType and PlanningPlant from work order
 * @param {*} context 
 * @param {*} plantOverride - Passed in on change of the workorder picker on confirmation create screen
 * @param {*} orderTypeOverride - Passed in on change of the workorder picker on confirmation create screen
 * @returns 
 */
export default async function CooperationIsEnabledForWorkOrder(context, plantOverride, orderTypeOverride) {
    if (cooperationIsEnabled(context)) {
        let binding = context.binding;

        if (!binding) {
            binding = context.getPageProxy()?.getActionBinding();
        }
        if (binding) {
            let { plant, orderType } = getPlantAndOrderType(binding, plantOverride, orderTypeOverride);

            if (plant && orderType) {        
                let count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'PerformMaintJobCtrlParams', `$filter=(Action eq 'A') and Plant eq '${plant}' and OrderType eq '${orderType}'`);
                if (count > 0) return true;
            }
            return false; //Bad plant and order type data, or no record found for this plant and order type
        }
        return false; //Bad binding
    }
    return false; //Feature is disabled
}

/**
 * Suggested by sonarcube to reduce complexity of above function
 * Returns the plant and orderType of the current work order, operation or suboperation
 * @param {*} binding 
 * @param {*} plantOverride - Passed in from the calling function if we want to override the plant
 * @param {*} orderTypeOverride - Passed in from the calling function if we want to override the order type
 * @returns
 */
function getPlantAndOrderType(binding, plantOverride, orderTypeOverride) {
    let plant, orderType;

    if (plantOverride && orderTypeOverride) {
        plant = plantOverride;
        orderType = orderTypeOverride;
    } else { //use binding object to get plant and order type
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                plant = binding.PlanningPlant;
                orderType = binding.OrderType;
                break;
            case '#sap_mobile.MyWorkOrderOperation':
                plant = binding.WOHeader?.PlanningPlant;
                orderType = binding.WOHeader?.OrderType;
                break;
            case '#sap_mobile.MyWorkOrderSubOperation':
                plant = binding.WorkOrderOperation?.WOHeader?.PlanningPlant;
                orderType = binding.WorkOrderOperation?.WOHeader?.OrderType;
                break;
            default: //Confirmation screen or other scenario
                plant = binding.CooperationPlant || binding.Plant || binding.WorkOrderHeader?.PlanningPlant;
                orderType = binding.CooperationOrderType || binding.OrderType || binding.WorkOrderHeader?.OrderType;
                break;
        }
    }
    return { plant, orderType };
}


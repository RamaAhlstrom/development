import { GetSelectedCount, GetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { RemoveHandlingUnitStateVariables, GetConfirmedAndTotalQuantity, isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import OnSuccessWarehouseTaskConfirmationCSCreateUpdate from '../HandlingUnit/OnSuccessWarehouseTaskConfirmationCSCreateUpdate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

/**
 * @param {IClientAPI} context 
 * @returns action
 */
export default function OnPressWarehouseTaskConfirmationDoneButton(context) {
    CommonLibrary.setStateVariable(context, 'WarehouseTaskValue', context.binding.WarehouseTask);
    const quantityFieldControl = CommonLibrary.getControlProxy(context?.getPageProxy(), 'WhQuantitySimple');
    const exceptionHandlingPicker = CommonLibrary.getControlProxy(context?.getPageProxy(), 'ExceptionPicker');
    const exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();
    const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;

    if (internalProcessCode && ['DIFF'].includes(internalProcessCode)) {
        CommonLibrary.setStateVariable(context, 'ExceptionDiffCase', true);
    }

    return QuantityFieldValidations(context).then(isValid => {
        if (!isValid) {
            CommonLibrary.executeInlineControlError(context, quantityFieldControl, context.localizeText('quantity_validation'));
            return Promise.reject();
        }
        CommonLibrary.setStateVariable(context, 'WarehouseNoForTaskConfirmation', context.binding.WarehouseNo);
        CommonLibrary.setStateVariable(context, 'WarehouseOrderForTaskConfirmation', context.binding.WarehouseOrder);

        const action = context.binding['@odata.readLink'].includes('WarehouseTaskConfirmations')
            ? '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCSUpdate.action'
            : '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCSCreate.action';

        return runAction(context, action).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskStatusUpdate.action')
                .then(() => {
                    RemoveHandlingUnitStateVariables(context);
                    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderStatusUpdate.action');
                });
        }).catch((error) => {
            Logger.error('OnPressWarehouseTaskConfirmationDoneButton error', error);
            return Promise.reject(error);
        });
    });
}

/**
 * Execute the CS update/create action and handle the result
 * @param {IClientAPI} context 
 * @param {String} action 
 * @returns result  or false
 */
async function runAction(context, action) {
    await context.executeAction(action);
    if (!context.binding['@odata.readLink'].includes('WarehouseTaskConfirmations')) {
        return OnSuccessWarehouseTaskConfirmationCSCreateUpdate(context).then((result) => {
            Logger.debug('*** runAction OnSuccessWarehouseTaskConfirmationCSCreateUpdate completed ', result);
            return Promise.resolve(result);
        });
    }
    return Promise.resolve(false);
}

/**
 * Validate the quantity field
 * @param {IClientAPI} context 
 * @returns 
 */
export function QuantityFieldValidations(context) {
    const enteredQuantity = parseFloat(context.evaluateTargetPath('#Control:WhQuantitySimple/#Value'));
    if (isTaskWithSerialNumbers(context) && GetSelectedCount(GetSerialNumberMap(context)) !== enteredQuantity) {
        return Promise.resolve(false);
    }

    const isUpdateScenario = context.binding['@odata.readLink'].includes('WarehouseTaskConfirmations');

    if (isUpdateScenario) {
        if (enteredQuantity === parseFloat(context.binding.ActualQuantity)) {
            return Promise.resolve(true);
        }
    }

    return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
        const remainingQuantity = totalQuantity - confirmedQuantity;
        if (isUpdateScenario) {
            const actualQuantity = parseFloat(context.binding.ActualQuantity);
            return enteredQuantity <= (remainingQuantity + actualQuantity);
        }
        return enteredQuantity <= remainingQuantity;

    }).catch(error => {
        Logger.error('Error in QuantityFieldValidations:', error);
        return false;
    });
}

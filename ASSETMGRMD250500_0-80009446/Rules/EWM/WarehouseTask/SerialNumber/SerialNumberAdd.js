import libVal from '../../../Common/Library/ValidationLibrary';
import { UpdateSerialNumberMap, GetSerialNumberMap, UpdateControls } from './SerialNumberLib';

/**
 * Add new serial number to the list
 * @param {IClientAPI} context 
 * @returns Batch property value
 */
export default function SerialNumberAdd(context) {
    const map = GetSerialNumberMap(context);
    const serialNumControl = context.evaluateTargetPath('#Page:-Current/#Control:SerialNum');
    const newValue = serialNumControl.getValue()?.trim();

    if (libVal.evalIsNotEmpty(newValue)) {
        const existingSerialNumber = map.find(c => c.entry.SerialNumber === newValue);
        if (existingSerialNumber) {
            if (existingSerialNumber.usedInOtherConfirmation) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberAlreadyExists.action', 
                    'Properties': {
                        'Message': context.localizeText('serial_number_already_exists_in_other_confirmation'),
                    },
                });
            } else {
                existingSerialNumber.selected = true;
                context.executeAction({
                    'Name': '/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberAlreadyExists.action', 
                    'Properties': {
                        'Message': context.localizeText('serial_number_already_exists'),
                    },
                });
            }
        } else {
            const newEntry = { 
                Product : context.binding['@odata.type'].includes('WarehouseTaskConfirmation') ? context.binding.WarehouseTask_Nav.Product : context.binding.Product,
                SerialNumber : newValue, 
                WarehouseNo : context.binding.WarehouseNo,
                WarehouseTask : context.binding.WarehouseTask,
            };
            const newSN = {
                entry: newEntry,
                selected: true,
                downloaded: false,
                usedInOtherConfirmation: undefined, 
            };
            map.unshift(newSN);
        }
        UpdateSerialNumberMap(context, map);
        UpdateControls(context, map);
        serialNumControl.setValue('');
        context.evaluateTargetPathForAPI('#Page:-Current/#Control:SerialButton')?.setEnabled(false);
    }
}

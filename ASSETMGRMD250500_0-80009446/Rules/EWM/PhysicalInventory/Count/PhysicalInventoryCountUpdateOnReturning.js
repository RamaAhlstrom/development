import libCom from '../../../Common/Library/CommonLibrary';
/**
 * This rule is used to update the quantity field when returning from the serial number page.
 */
export default function PhysicalInventoryCountUpdateOnReturning(context) {
    if (context.binding.Serialized) {
        const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
        if (libCom.getStateVariable(context, 'SerialSuccess')) {
            let quantity = libCom.getControlProxy(context, 'QuantitySimple');
            let zero = libCom.getControlProxy(context, 'ZeroCountSwitch');
            const newValue = initialNumbers.filter(item => item.Selected).length;
            if (newValue > 0) {
                quantity.setValue(newValue);
                libCom.setStateVariable(context, 'Quantity', newValue);
                zero.setEditable(false); //Cannot set to zero count with serial numbers in cache
                zero.setValue(false);
            } else {
                zero.setEditable(true);
                libCom.setStateVariable(context, 'Quantity', context.binding.Quantity);
            }
        } else {
            libCom.setStateVariable(context, 'SerialNumbers', { actual: initialNumbers, initial: initialNumbers });
        }
    }
}

import libCom from '../../../Common/Library/CommonLibrary';
/**
* Sets the quantity to 0 and disables the quantity field if the ZeroCountSwitch is on.
* @param {IClientAPI} clientAPI
*/
export default function ZeroCountOnChange(context) {
    let pageProxy = context.getPageProxy();

    let quantity = libCom.getControlProxy(pageProxy, 'QuantitySimple');
    let zero = libCom.getControlProxy(pageProxy, 'ZeroCountSwitch');
    let serial = libCom.getControlProxy(pageProxy, 'SerialNumberAdd');

    const show = !!(context.binding.Serialized); //Check if serialized material
    if (zero.getValue()) {
        quantity.setValue('0');
        quantity.setEditable(false);
        quantity.clearValidation();
        if (show) {
            serial.setVisible(false);
        }
    } else {
        quantity.setEditable(!show);
        serial.setVisible(show);
        if (Number(quantity.getValue()) === 0)
            quantity.setValue('');
    }
    return Promise.resolve(true);
}

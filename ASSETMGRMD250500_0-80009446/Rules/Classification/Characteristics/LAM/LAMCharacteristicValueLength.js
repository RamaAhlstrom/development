import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default function LAMCharacteristicValueLength(context) {
    let length = context.evaluateTargetPath('#Control:Length/#Value').toString();

    if (LocalizationLibrary.isNumber(context, length)) {
        return LocalizationLibrary.toNumber(context, length).toString();
    } 

    return length;
}

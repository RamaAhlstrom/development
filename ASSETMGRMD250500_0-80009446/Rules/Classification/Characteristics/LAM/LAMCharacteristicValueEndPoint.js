import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default function LAMCharacteristicValueEndPoint(context) {
    let end = context.evaluateTargetPath('#Control:EndPoint/#Value').toString();

    if (LocalizationLibrary.isNumber(context, end)) {
        return LocalizationLibrary.toNumber(context, end).toString();
    } 

    return end;
}

import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default function LAMCharacteristicValueStartPoint(context) {
    let start = context.evaluateTargetPath('#Control:StartPoint/#Value').toString();

    if (LocalizationLibrary.isNumber(context, start)) {
        return LocalizationLibrary.toNumber(context, start).toString();
    } 

    return start;
}

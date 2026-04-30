import IsAndroid from '../../../Common/IsAndroid';

export default function GetListEditIcon(context) {
    if (context.binding?.WTStatus === 'C') {
        return '';
    }
    if (IsAndroid(context)) {
        return '/SAPAssetManager/Images/edit-accessory.android.png';
    } else {
        return '/SAPAssetManager/Images/edit-accessory.ios.png';
    }
}

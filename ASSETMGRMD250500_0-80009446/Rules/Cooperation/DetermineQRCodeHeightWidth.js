import DeviceType from '../Common/DeviceType';

/**
 * Return the height and width of the QR code based on the device type.
 * @param {IClientAPI} context
 */
export default function DetermineQRCodeHeightWidth(context) {
    const deviceType = DeviceType(context);

    if (deviceType === 'Phone') {
        return 0;
    }
    return 600;
}

import libQR from '../Common/Library/QRCodeLibrary';

/**
* Sets the QR Code data for this image control
* @param {IClientAPI} context
*/
export default function GetQRCodeImage(context) {
    let imageRawData = context.getPageProxy().getClientData().QRCodeImageSource;

    if (imageRawData) {
        return libQR.prepareDataForImage(imageRawData);
    }

    return '';
}

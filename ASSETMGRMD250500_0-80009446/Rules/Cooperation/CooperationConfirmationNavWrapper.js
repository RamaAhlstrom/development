/**
 * Scan QRCode, validate and navigate to confirmation screen if passed, otherwise display error toast
 * @param {*} context 
 */
export default function CooperationConfirmationNavWrapper(context) {
    return context.executeAction('/SAPAssetManager/Actions/Cooperation/CooperationQRCodeScan.action');
}

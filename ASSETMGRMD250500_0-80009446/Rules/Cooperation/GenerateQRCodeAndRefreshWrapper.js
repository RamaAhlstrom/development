import libCoop from './CooperationLibrary';

/**
* Generate the current dynamic QR Code for this user and update the screen image with that data
* @param {IClientAPI} context
*/
export default async function GenerateQRCodeAndRefreshWrapper(context) {
	let success = await libCoop.generateQRCodeAndRefresh(context); //Generate the current dynamic QR Code
	if (success) {
		await libCoop.startQRCodeCounter(context); //Start the QR Code on-screen counter
	}
}

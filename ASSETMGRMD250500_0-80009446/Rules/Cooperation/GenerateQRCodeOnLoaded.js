import libCoop from './CooperationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default async function generateQRCodeOnLoaded(context) {
    let config = await libCoop.readGlobalConfig(context);

    if (config) {
        let enableText = await libCoop.getTextEnabled(context, config);
        if (enableText) { //Set up state variable that controls maximum text length if text entry is enabled
            let textMaxLength = await libCoop.getTextMaxLength(context, config);
            libCom.setStateVariable(context, 'CooperationMaxTextLength', textMaxLength);
            context.getPageProxy().getControl('SectionedTable').getControl('LongText').setVisible(true); //Display the long text comment field
        } else {
            libCom.removeStateVariable(context, 'CooperationMaxTextLength');
        }
        let success = await libCoop.generateQRCodeAndRefresh(context); //Generate the current dynamic QR Code
        if (success) {
            await libCoop.startQRCodeCounter(context); //Start the QR Code on-screen counter
        }
    } else {
        //Error reading global config
         Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCooperation.global').getValue(),'ERROR: Configuration read error in generateQRCodeOnLoaded');
         return false;
    }

    return true;
}


import libCom from '../Common/Library/CommonLibrary';
export default function UploadData(clientAPI) {
    if (!libCom.isInitialSync(clientAPI)) {
        libCom.setStateVariable(clientAPI, 'UploadInProgress', true);
        return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then(async () => {
            let result = await clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '');
            let action = result > 0 ? '/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action' : '/SAPAssetManager/Actions/UploadSuccessMessage.action';
            return clientAPI.executeAction(action).then(() => {
                libCom.setStateVariable(clientAPI, 'UploadInProgress', false);
            });
        });
    }
}

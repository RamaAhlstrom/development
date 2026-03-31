import libCommon from '../../../Common/Library/CommonLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function CharacteristicLamValuesUpdateNav(clientAPI) {
    if (ODataLibrary.hasAnyPendingChanges(clientAPI.binding)) {
        libCommon.setOnCreateUpdateFlag(clientAPI, 'UPDATE');
        return clientAPI.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicLAMValuesCreateUpdateNav.action');
    } else {
        return Promise.resolve();
    }
}

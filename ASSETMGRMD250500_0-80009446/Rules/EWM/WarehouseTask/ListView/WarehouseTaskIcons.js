import SetIcons from '../../../FL/Containers/ListView/SetIcons';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
export default function WarehouseTaskIcons(clientAPI) {
    const failedItems = CommonLibrary.getStateVariable(clientAPI, 'WHTFailedItems');
    if (failedItems?.length > 0) {
        const matchedItem = failedItems.find(item => clientAPI.binding.WarehouseNo === item.WarehouseNo 
            && clientAPI.binding.WarehouseTask === item.WarehouseTask);
        if (matchedItem) {
            return SetIcons(clientAPI); 
        }
    }
    return [];
}

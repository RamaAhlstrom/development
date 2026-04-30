/**
* Describe this function...
* @param {IClientAPI} context
*/
import {DocumentTypes} from '../Common/EWMLibrary';
export default function GetDocumentTypes(context) {
    return [
        {DisplayValue: context.localizeText('warehouse_order'), ReturnValue: DocumentTypes.WarehouseOrder},
        {DisplayValue: context.localizeText('warehouse_task'), ReturnValue: DocumentTypes.WarehouseTask},
        {DisplayValue: context.localizeText('physical_inventory_label'), ReturnValue: DocumentTypes.WarehousePhysicalInventoryItem},
    ];
}

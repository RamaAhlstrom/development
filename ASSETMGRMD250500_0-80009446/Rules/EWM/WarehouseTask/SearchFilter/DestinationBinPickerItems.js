/**
 * This rule is used to populate the Destination Bin Picker control with the unique values of Destination Bin from Warehouse Tasks
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Products
 */
export default async function DestinationBinPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.DestinationBin))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}

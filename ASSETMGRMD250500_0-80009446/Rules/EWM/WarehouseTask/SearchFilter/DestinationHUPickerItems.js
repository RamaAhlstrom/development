/**
 * Returns HU Picker Items
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of HUs
 */
export default async function DestinationHUPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$orderby=WarehouseTask')
        .then(o => [... new Set(Array.from(o, c => c.DestinationHU))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}

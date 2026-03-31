/**
 * Returns HU Picker Items
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Source HUs
 */
export default async function SourceHUPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$orderby=WarehouseTask')
        .then(o => [... new Set(Array.from(o, c => c.SourceHU))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}

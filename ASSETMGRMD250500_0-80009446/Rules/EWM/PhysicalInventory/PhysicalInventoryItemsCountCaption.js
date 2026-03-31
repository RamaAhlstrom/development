import ComLib from '../../Common/Library/CommonLibrary';
import { WHPhysicalInvListFilterAndSearchQuery } from './WHPhysicalInvListQuery';
/**
* Get the caption for the Physical Inventory Items count
* @param {IClientAPI} clientAPI
*/
export default function PhysicalInventoryItemsCountCaption(clientAPI) {
    const totalCountQueryOptions = WHPhysicalInvListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = WHPhysicalInvListFilterAndSearchQuery(clientAPI,true,true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'WarehousePhysicalInventoryItems', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'WarehousePhysicalInventoryItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('all_caption', [totalCount]);
        }
        return clientAPI.localizeText('all_caption_double', [count, totalCount]);
    });   
}

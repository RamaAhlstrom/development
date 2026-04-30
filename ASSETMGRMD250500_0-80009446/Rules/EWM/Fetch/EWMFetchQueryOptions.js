import libCom from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
import { getEWMOrderFilters } from './EWMOrderFetchQueryOptions';
import { getEWMTaskFilters } from './EWMTaskFetchQueryOptions';
import { getEWMPhysicalInventoryFilters } from './EWMPhysicalInventoryFetchQueryOptions';

export default function EWMFetchQueryOptions(context) {
    const queryBuilder = context.evaluateTargetPathForAPI('#Page:EWMFetchDocumentsPage').getControls()[0].dataQueryBuilder();
    const filtersArray = getQueryForFetchDocuments(context);
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray.join(' and ')})`);
    }
    
    return queryBuilder;
}

export function getQueryForFetchDocuments(context) {
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    const filtersArray = [];

    switch (documentType) {
        case DocumentTypes.WarehouseOrder:
            filtersArray.push(...getEWMOrderFilters(context));
            break;
        case DocumentTypes.WarehouseTask:
            filtersArray.push(...getEWMTaskFilters(context));
            break;
        case DocumentTypes.WarehousePhysicalInventoryItem:
            filtersArray.push(...getEWMPhysicalInventoryFilters(context));
            break;
    }
    return filtersArray;
}

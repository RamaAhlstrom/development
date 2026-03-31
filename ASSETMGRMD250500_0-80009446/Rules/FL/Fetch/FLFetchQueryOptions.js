import libCom from '../../Common/Library/CommonLibrary';
import { getVoyageFilters } from './VoyageFetchQueryOptions';
import { getContainerFilters } from './ContainerOrPackageFetchQueryOptions';
import { getHUDelItemsFilters } from './HUDelItemsFetchQueryOptions';
import { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function FLFetchQueryOptions(context) {
    const queryBuilder = context.evaluateTargetPathForAPI('#Page:FLOverviewPage').getControls()[0].dataQueryBuilder();
    const filtersArray = getQueryForFetchDocuments(context);
    queryBuilder.filter('(' + filtersArray.join(' and ') + ')');
    return queryBuilder;
}

export function getQueryForFetchDocuments(context) {
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
    const filtersArray = [];
    switch (documentType) {
        case FLDocumentTypeValues.Voyage:
            filtersArray.push(...getVoyageFilters(context));
            break;
        case FLDocumentTypeValues.Container:
        case FLDocumentTypeValues.Package:
            filtersArray.push(...getContainerFilters(context));
            break;
        case FLDocumentTypeValues.HandlingUnit:
        case FLDocumentTypeValues.DeliveryItem:
            filtersArray.push(...getHUDelItemsFilters(context));
            break;
    }
    return filtersArray;
}


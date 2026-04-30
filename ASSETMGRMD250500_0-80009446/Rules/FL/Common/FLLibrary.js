import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const VoyageStatus = Object.freeze({
    InTransit: '01',
    Arrived: '02',
    Completed: '03',
});

export const VoyageDownloadFiltersAllowed = Object.freeze({
    Arrived: '02',
    Completed: '03',
});

export const ContainerStatus = Object.freeze({
    Dispatched: '10',
    PartiallyReceived: '20',
    Received: '30',
    Unloaded: '40',
    Arrived: '50',
    NotFound: '60',
});

export const ContainerItemStatus = Object.freeze({
    Dispatched: '10',
    Arrived: '20',
    InProcess: '30',
    ReceiptInProcess: '35',
    Received: '40',
    Deleted: '50',
    Unloaded: '60',
    NotFound: '70',
    ReceivedForTransfer: '80',
});

export const HUDelItemsDownloadAllowedStatus = Object.freeze({
    Dispatched: '10',
    Arrived: '20',
    InProcess: '30',
    ReceiptInProcess: '35',
    Unloaded: '60',
});

export const FLDefiningRequestsLite = Object.freeze([
    'FldLogsVoyages',
    'FldLogsContainers',
    'FldLogsContainerItems',
    'FldLogsPackages',
    'FldLogsPackageItems',
    'FldLogsHuDelItems',
    'FldLogsContainerItemSrNos',
    'FldLogsPackageItemSrNos',
    'FldLogsHuDelSnItems',
]);

export const FLEntitySetNames = Object.freeze({
    Container: 'FldLogsContainers',
    ContainerItem: 'FldLogsContainerItems',
    Package: 'FldLogsPackages',
    PackageItem: 'FldLogsPackageItems',
    HuDelItem: 'FldLogsHuDelItems',
    HuDelItemSerialNos : 'FldLogsHuDelSnItems',
    PackageItemSerialNos : 'FldLogsPackageItemSrNos',
    ContainerItemSerialNos : 'FldLogsContainerItemSrNos',
});

export const FLTypeEntitySetMap = Object.freeze({
    FldLogsContainer: FLEntitySetNames.ContainerItem,
    FldLogsPackage: FLEntitySetNames.PackageItem,
});

export const FLDocumentTypeValues = Object.freeze({
    Voyage: 'VOY',
    Container: 'CTN',
    Package: 'PKG',
    HandlingUnit: 'HU',
    DeliveryItem: 'DI',
    HandlingUnitDeliveryItem: 'HDI',
});

export function appendVoyageNumberForContainerorHUDelItemFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = ` and (VoyageNumber eq '${context.binding.VoyageNumber}')`;
        return currentFilter + voyageNumberFilter;
    }
    return currentFilter;
}

export function appendVoyageNumberForPackagesFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = `(VoyageNumber eq '${context.binding.VoyageNumber}')`;
        // Adding condition to exclude packages with ParentCtnId
        let excludeParentCtnIdFilter = '(ParentCtnID eq null or ParentCtnID eq \'\')';
        return `${currentFilter} and (${voyageNumberFilter} and ${excludeParentCtnIdFilter})`;
    }
    return currentFilter;
}

export function appendContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ContainerID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export function appendParentContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ParentCtnID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export default class {

    static getVoyageNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Voyages/VoyageDetailsPageNav.action',
            entitySet: 'FldLogsVoyages',
            expandOptions: '$expand=FldLogsVoyageStatus_Nav, FldLogsVoyageType_Nav',
        };
    }

    static getContainerNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Containers/ContainersDetailsPageNav.action',
            entitySet: 'FldLogsContainers',
            expandOptions: '$expand=FldLogsContainerStatus_Nav, FldLogsContainerItem_Nav, FldLogsPackage_Nav',
        };
    }

    static getPackageNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Packages/PackageDetailsPageNav.action',
            entitySet: 'FldLogsPackages',
            expandOptions: '$expand=FldLogsContainerStatus_Nav, FldLogsPackageItem_Nav',
        };
    }

    static getHuDelItemNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/HUDelItems/HUDelItemsDetailsPageNav.action',
            entitySet: 'FldLogsHuDelItems',
            expandOptions: '$expand=FldLogsHUDelItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav',
        };
    }

    static getNavigationObjectMap() {
        return {
            'FldLogsVoyages'   : this.getVoyageNavOptions(),
            'FldLogsContainers': this.getContainerNavOptions(),
            'FldLogsPackages'  : this.getPackageNavOptions(),
            'FldLogsHuDelItems': this.getHuDelItemNavOptions(),
        };
    }

    /**
     * Opens document details page for the FL Persona
     */
    static openDocumentDetailsPage(context, entitySet, queryOptions, navAction, pageName) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(data => {
            if (data.length === 1) {
                let page = '';
                if (pageName === 'VoyagesListPage') {
                    page = context.evaluateTargetPathForAPI('#Page:VoyagesListPage');
                } else {
                    page = context.evaluateTargetPathForAPI('#Page:FLOverviewPage');
                }
                const docInfo = data.getItem(0);
                page.setActionBinding(docInfo);
                return page.executeAction(navAction);
            }
            return false;
        });
    }

    static getEntitySetForDocumentType(documentType) {
        switch (documentType) {
            case FLDocumentTypeValues.Voyage:
                return 'FldLogsVoyages';
            case FLDocumentTypeValues.Container:
                return 'FldLogsContainers';
            case FLDocumentTypeValues.Package:
                return 'FldLogsPackages';
            case FLDocumentTypeValues.HandlingUnit:
            case FLDocumentTypeValues.DeliveryItem:
                return 'FldLogsHuDelItems';
            default:
                return '';
        }
    }

    static getDocumentData(item, documentType) {
        const document = { FLObject: documentType };
        switch (documentType) {
            case FLDocumentTypeValues.Voyage:
                document.ObjectId = item.VoyageStageUUID;
                break;
            case FLDocumentTypeValues.Container:
                document.ObjectId = item.ContainerID;
                break;
            case FLDocumentTypeValues.Package:
                document.ObjectId = item.ContainerID;
                break;
            case FLDocumentTypeValues.HandlingUnit:
            case FLDocumentTypeValues.DeliveryItem:
            case FLDocumentTypeValues.HandlingUnitDeliveryItem:
                {
                    document.FLObject = FLDocumentTypeValues.HandlingUnitDeliveryItem;
                    document.DispatchDate = item.DispatchDate;
                    const date = new Date(item.DispatchDate);
                    const [year, month, day] = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')];
                    document.ObjectId = `${item.DispatchLoc}${year}${month}${day}${item.ReferenceDocNumber}`;
                }
                break;
        }
        return document;
    }

    static isFetchOnlineSectionVisible(context, sectionType) {
        const documentType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
        return documentType === sectionType;
    }

    static navigateOnSearchStringMatch(context, entitySet, query) {
        const navObject = this.getNavigationObjectMap()[entitySet];
        return CommonLibrary.navigateOnRead(context.getPageProxy(), navObject.navAction, navObject.entitySet, `${query}&${navObject.expandOptions}`);
    }

    static isLastQueryForMatch(clientData) {
        return Object.values(clientData).filter(x => x === null).length === 0;
    }
    static isOnlyOneMatch(clientData) {
        return Object.values(clientData).filter(x => x.count > 0).length === 1;
    }
    static onOverviewPageSectionLoad(context, queryBuilder, filterQuery, entitySet, topValue) {
        queryBuilder.top(topValue);
        const searchString = context.searchString?.toLowerCase();
        const autoOpenEnabled = (CommonLibrary.getAppParam(context, 'FL', 'search.auto.navigate') === 'Y');
        if (searchString && autoOpenEnabled) {
            const entityName = entitySet;
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, filterQuery)
                    .then((count) => {
                        const clientData = context.getClientData();
                        if (ValidationLibrary.evalIsEmpty(clientData[searchString])) {
                            clientData[searchString] = {
                                'FldLogsVoyages' : null,
                                'FldLogsPackages': null,
                                'FldLogsContainers': null,
                                'FldLogsHuDelItems': null,
                            };
                        }
                        clientData[searchString][entityName] = {
                            count: count,
                            query: filterQuery,
                        };
                        
                        if (this.isLastQueryForMatch(clientData[searchString])) {
                            if (this.isOnlyOneMatch(clientData[searchString])) {
                                const navObject = Array.from(Object.entries(clientData[searchString])).reduce((acc, [key, value]) => {
                                    if (value.count === 1) {
                                      acc[key] = value;
                                    }
                                    return acc;
                                  }, {});
                                clientData[searchString] = undefined;
                                return this.navigateOnSearchStringMatch(context, Object.keys(navObject)[0], Object.values(navObject)[0].query);
                            }
                            clientData[searchString] = undefined;
                        }
                        return queryBuilder;
                    });
        }
        return queryBuilder;
    }

}


export function getPlantNameFL(clientAPI, plantId) {  
        const queryOptions = "$filter=Plant eq '" + plantId + "'"; 
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPlants', [], queryOptions).then((result) => {
 
            if (result?.length > 0) { 
                return result.getItem(0).Plant + ' - ' + result.getItem(0).PlantName; 
            } 
            return plantId; 
        }); 
    }

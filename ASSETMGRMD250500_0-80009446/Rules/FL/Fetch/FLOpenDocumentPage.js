import libCom from '../../Common/Library/CommonLibrary';
import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
* Used to make an extension of simple close of the page
* if there are only one doc dowloaded, it make redirect to the details page
* if there is openend any modal of fetch doc - it would be closed
* @param {IClientAPI} context
*/
export default function FLOpenDocumentPage(context) {
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
    const pageName = libCom.getPageName(context);
    if (pageName === 'FLFetchOnlineDocuments' || pageName === 'FLFetchDocuments') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return modifyDocs(context);
        });
    }
    return modifyDocs(context);
}

function modifyDocs(context) {
    const documents = libCom.getStateVariable(context, 'Documents');
    const autoOpenEnabled = (libCom.getAppParam(context, 'FL', 'search.auto.navigate') === 'Y');
    const pageName = libCom.getPageName(context);
    if (documents.length === 1 && autoOpenEnabled) {
        const document = documents[0];
        switch (document.FLObject) {
            case FLDocumentTypeValues.Voyage:
                return openVoyageDetailsPage(context, document, pageName);
            case FLDocumentTypeValues.Container:
                return openContainerDetailsPage(context, document, pageName);
            case FLDocumentTypeValues.Package:
                return openPackageDetailsPage(context, document, pageName);
            case FLDocumentTypeValues.HandlingUnitDeliveryItem:
                return openHUDelItemDetailsPage(context, document, pageName);
            default:
                return Promise.resolve(true);
        }
    }
    return Promise.resolve(true);
}

function openVoyageDetailsPage(context, document, pageName) {
    return FLLibrary.openDocumentDetailsPage(context, 'FldLogsVoyages', `$filter=VoyageStageUUID eq '${document.ObjectId}'&$expand=FldLogsVoyageStatus_Nav, FldLogsVoyageType_Nav`, '/SAPAssetManager/Actions/FL/Voyages/VoyageDetailsPageNav.action', pageName);
}

function openContainerDetailsPage(context,document, pageName) {
    return FLLibrary.openDocumentDetailsPage(context, 'FldLogsContainers', `$filter=ContainerID eq '${document.ObjectId}'&$expand=FldLogsContainerStatus_Nav, FldLogsContainerItem_Nav, FldLogsPackage_Nav`, '/SAPAssetManager/Actions/FL/Containers/ContainersDetailsPageNav.action', pageName);
}

function openPackageDetailsPage(context, document, pageName) {
    return FLLibrary.openDocumentDetailsPage(context, 'FldLogsPackages', `$filter=ContainerID eq '${document.ObjectId}'&$expand=FldLogsContainerStatus_Nav, FldLogsPackageItem_Nav`, '/SAPAssetManager/Actions/FL/Packages/PackageDetailsPageNav.action', pageName);
}

function openHUDelItemDetailsPage(context, document, pageName) {
    const objectID = document.ObjectId;
    const dispatchDate = document.DispatchDate;
    const [displatchLoc, referenceDocNumber] = [objectID.substr(0, 4), objectID.substr(12)];
    const filterOptions = `$filter=(DispatchLoc eq '${displatchLoc}' and DispatchDate eq datetime'${dispatchDate}' and ReferenceDocNumber eq '${referenceDocNumber}')`;
    const expandOptions = '$expand=FldLogsHUDelItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav';
    return FLLibrary.openDocumentDetailsPage(context, 'FldLogsHuDelItems', `${filterOptions}&${expandOptions}`, '/SAPAssetManager/Actions/FL/HUDelItems/HUDelItemsDetailsPageNav.action', pageName);
}

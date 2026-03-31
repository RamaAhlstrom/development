import FLSetDefaultPlant from './FLSetDefaultPlant';
import libCom from '../../Common/Library/CommonLibrary';
import { FLDocumentTypeValues } from '../Common/FLLibrary';

/**
 * Reset the fields in the Fetch Documents screen for the selected document type.
 * @param {*} context 
 */
export default function FLFetchDocumentsResetFields(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const defaultSection = sectionTableProxy.getSection('FetchDefaultSection');
    const plantLstPkr = defaultSection.getControl('PlantListPicker');
    const documentType = defaultSection.getControl('DocumentTypeListPicker').getValue()?.[0]?.ReturnValue;
    plantLstPkr.setValue(FLSetDefaultPlant());
    ResetSectionFields(sectionTableProxy, documentType);
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
}

function ResetSectionFields(sectionTableProxy, documentType) {
    switch (documentType) {
        case FLDocumentTypeValues.Voyage:
            ResetVoyageFields(sectionTableProxy.getSection('FetchVoyagesSection'));
            break;
        case FLDocumentTypeValues.Container:
        case FLDocumentTypeValues.Package:
            ResetContainerFields(sectionTableProxy.getSection('FetchContainersSection'));
            break;
        case FLDocumentTypeValues.HandlingUnit:
        case FLDocumentTypeValues.DeliveryItem:
            ResetHUDelItemsFields(sectionTableProxy.getSection('FetchHUDelItemsSection'));
            break;
    }
}

function ResetVoyageFields(section) {
    const [voyageNumber, voyageStatus, modeOfTransport, fromPlant, plannedArrivalDateStart, plannedArrivalDateEnd, receivingPoint, shippingPoint,  plannedArrivalDateSwitch] = ['VoyageNumber', 'VoyageStatus', 'ModeOfTransport', 'FromPlant', 'StartDateFilter', 'EndDateFilter', 'ReceivingPoint', 'ShippingPoint', 'PADateSwitch'].map(control => section.getControl(control));
    [voyageNumber, voyageStatus, modeOfTransport, fromPlant, receivingPoint, shippingPoint].map((control) => control.setValue(''));
    plannedArrivalDateSwitch.setValue(false);
    [plannedArrivalDateStart, plannedArrivalDateEnd].map((control) => control.setValue(new Date()));
}

function ResetContainerFields(section) {
    const [workOrdMaintOrd, product, wbsElementProject, kitID, containerID, containerStatus, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['ContainerWorkOrdMaintOrd', 'ContainerProduct', 'ContainerWBSElementProject', 'KitID', 'ContainerID', 'ContainerStatus', 'ContainerVoyageNumber', 'ContainerDispatchDateSwitch', 'ContainerStartDateFilter', 'ContainerEndDateFilter', 'ContainerReceivingPoint'].map(control => section.getControl(control));
    [workOrdMaintOrd, product, wbsElementProject, kitID, containerStatus, voyageNumber, receivingPoint, containerID].map((control) => control.setValue(''));
    dispatchDateSwitch.setValue(false);
    [startDispatchDate, endDispatchDate].map((control) => control.setValue(new Date()));
}

function ResetHUDelItemsFields(section) {
    const [workOrdMaintOrd, product, wbsElementProject, kitID, handlingUnit, referenceDocNumber, huDiStatus, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['HUDelItemsWorkOrdMaintOrd', 'HUDelItemsProduct', 'HUDelItemsWBSElementProject', 'HUDelItemsKitID', 'HandlingUnit', 'ReferenceDocNumber', 'HUDelItemsStatus', 'HUDelItemsVoyageNumber', 'HUDelItemsDispatchDateSwitch', 'HUDelItemsStartDateFilter', 'HUDelItemsEndDateFilter', 'HUDelItemsReceivingPoint'].map(control => section.getControl(control));
    [workOrdMaintOrd, product, wbsElementProject, kitID, handlingUnit, referenceDocNumber, huDiStatus, voyageNumber, receivingPoint].map((control) => control.setValue(''));
    dispatchDateSwitch.setValue(false);
    [startDispatchDate, endDispatchDate].map((control) => control.setValue(new Date()));
}

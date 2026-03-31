import { FLDocumentTypeValues } from '../Common/FLLibrary';
import FLFetchDocumentsResetFields from './FLFetchDocumentsResetFields';

/**
 * Sets the visibility of different fetch sections based on the value of the DocumentTypeListPicker.
 * @param {*} context 
 */
export default function FLDocumentTypesOnValueChanged(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const documentTypeValue = sectionTableProxy.getSection('FetchDefaultSection').getControl('DocumentTypeListPicker').getValue()?.[0]?.ReturnValue;
    const isPackageOrContainer = [FLDocumentTypeValues.Container, FLDocumentTypeValues.Package].includes(documentTypeValue);
    const isHandlingUnitOrDelItem = [FLDocumentTypeValues.HandlingUnit, FLDocumentTypeValues.DeliveryItem].includes(documentTypeValue);
    if (isPackageOrContainer) {
        setContainerOrPackageCaption(sectionTableProxy, documentTypeValue, context);
    } else if (isHandlingUnitOrDelItem) {
        const [handlingUnit, referenceDocNum] = ['HandlingUnit', 'ReferenceDocNumber'].map((control) => sectionTableProxy.getSection('FetchHUDelItemsSection').getControl(control));
        handlingUnit.setVisible(documentTypeValue === FLDocumentTypeValues.HandlingUnit);
        referenceDocNum.setVisible(documentTypeValue === FLDocumentTypeValues.DeliveryItem);
        setHandlingUnitOrDelItemStatusPickerCaption(sectionTableProxy, documentTypeValue, context);
    }
    sectionTableProxy.getSection('FetchVoyagesSection').setVisible(documentTypeValue === FLDocumentTypeValues.Voyage);
    sectionTableProxy.getSection('FetchContainersSection').setVisible(isPackageOrContainer);
    sectionTableProxy.getSection('FetchHUDelItemsSection').setVisible(isHandlingUnitOrDelItem);
    FLFetchDocumentsResetFields(context);
}

/**
 * Sets the caption for the container or package based on the document type
 * @param {*} sectionTableProxy 
 * @param {*} documentTypeValue 
 * @param {*} context 
 */
function setContainerOrPackageCaption(sectionTableProxy, documentTypeValue, context) {
    const statusCaption = documentTypeValue === FLDocumentTypeValues.Container ? 'container_status' : 'package_status';
    const idCaption = documentTypeValue === FLDocumentTypeValues.Container ? 'container_id' : 'package_id';
    sectionTableProxy.getSection('FetchContainersSection').getControl('ContainerID').setCaption(context.localizeText(idCaption));
    sectionTableProxy.getSection('FetchContainersSection').getControl('ContainerStatus').setCaption(context.localizeText(statusCaption));
}

function setHandlingUnitOrDelItemStatusPickerCaption(sectionTableProxy, documentTypeValue, context) {
    const caption = documentTypeValue === FLDocumentTypeValues.HandlingUnit ? 'fld_handling_unit_status' : 'fld_delivery_item_status';
    sectionTableProxy.getSection('FetchHUDelItemsSection').getControl('HUDelItemsStatus').setCaption(context.localizeText(caption));
}

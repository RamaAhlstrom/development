import { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
 * 
 * @param {*} context 
 * @returns List of Documents supported for fetching
 */
export default function FLDocumentTypes(context) {
    return [
        {DisplayValue: context.localizeText('fld_voyages'), ReturnValue: FLDocumentTypeValues.Voyage},
        {DisplayValue: context.localizeText('fld_containers'), ReturnValue: FLDocumentTypeValues.Container},
        {DisplayValue: context.localizeText('fld_packages'), ReturnValue: FLDocumentTypeValues.Package},
        {DisplayValue: context.localizeText('fld_handling_units'), ReturnValue: FLDocumentTypeValues.HandlingUnit},
        {DisplayValue: context.localizeText('fld_delivery_items'), ReturnValue: FLDocumentTypeValues.DeliveryItem},
    ];
}

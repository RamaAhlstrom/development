// import libBOM from './BOMLibrary';
import libBOM from '../../../../SAPAssetManager/Rules/Material/BOM/BOMLibrary';

export default function BOMVisible(context) {
    // alert("inside bom visuable copy")
    if(context.currentPage.id=="EquipmentDetailsPage" || context.currentPage.id=="FunctionalLocationDetails")
    {
       // return libBOM.isBOMVisible(context);
       return true;
    }
    else
    {
        return false;//libBOM.isBOMVisible(context);
    }
}
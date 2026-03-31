import libPart from '../../../SAPAssetManager/Rules/Parts/PartLibrary';
//import libPart from './PartLibrary';

export default function PartRePairornor(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partFieldFormat(pageClientAPI, 'RequiredQty1');

}
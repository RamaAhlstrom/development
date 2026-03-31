//import common from '../Common/Library/CommonLibrary';
import common from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function Checksupervisor(context) {
    //alert(common.getStateVariable(context, 'GowriPersonatype')+"Supervisor")
    if(common.getStateVariable(context, 'GowriPersonatype')=="Supervisor")
     {
         return true;
     }
     else
     {
        
     return false;
 
     }
 }
//import libSuper from '../Supervisor/SupervisorLibrary';
import libSuper from '../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
//import personalLib from '../Persona/PersonaLibrary';
import personalLib from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
//import common from '../Common/Library/CommonLibrary';
import common from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default async function SideDrawerHeadLine(context) {
    const activePersonaCode = personalLib.getActivePersonaCode(context);
    const activePersona = personalLib.getActivePersona(context);

    if (!activePersonaCode || !activePersona) {
        // If no active persona code or active persona is found, return an empty string
        return '';
    }

    let headline = '';

    try {
        const personaArray = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], `$filter=PersonaCode eq '${activePersonaCode}' and UserPersona eq '${activePersona}'`);
        const persona = personaArray?.getItem(0);
        headline = persona?.PersonaCodeDesc || '';

        if (persona?.PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue()) {
            common.setStateVariable(context, 'GowriPersonatype', "Technician");//Added for end operation check
            if (persona.FlagExternal === 'X') {
                common.setStateVariable(context, 'GowriPersonatype', "Technician");//Added for end operation check
                headline = context.localizeText('external_technician');
            } else if (libSuper.isSupervisorFeatureEnabled(context)) {
                const isSupervisor = await libSuper.isUserSupervisor(context);
                if (isSupervisor) {
                    common.setStateVariable(context, 'GowriPersonatype', "Supervisor");//Added for end operation check
                    headline = context.localizeText('supervisor');
                }
                // common.setStateVariable(context, 'GowriPersonatype', "Technician");//Added for end operation check
            }
        }
       // common.setStateVariable(context, 'GowriPersonatype', "Technician");//Added for end operation check
        return headline;
    } catch {
        common.setStateVariable(context, 'GowriPersonatype', "Technician");//Added for end operation check
        return '';
    }
}

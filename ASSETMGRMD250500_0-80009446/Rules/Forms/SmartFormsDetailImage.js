import libPersona from '../Persona/PersonaLibrary';

export default function SmartFormsDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/Smartforms.png, /SAPAssetManager/Images/DetailImages/Smartforms.android.png)' : undefined;
}

/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function TypeFieldCaption(context) {
    return `${context.localizeText('type')}*`;
    // return PersonaLibrary.isFieldServiceTechnician(context) ?`${context.localizeText('type')}*` : `${context.localizeText('type')}*`;
}

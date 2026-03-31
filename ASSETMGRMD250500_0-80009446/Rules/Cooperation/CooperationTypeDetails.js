/**
 * Return the confirmation type
 * Used for display on confirmation details and list screens
 * @param {*} context 
 * @returns 
 */
export default function CooperationTypeDetails(context) {
    switch (context.binding?.ConfirmationScenario) {
        case '10':
            return context.localizeText('confirmation_type_cooperation');
        default:
            return context.localizeText('confirmation_type_time');
    }
}

/**
* Returns list of confirmation cooperation segment buttons
* @param {IClientAPI} context MDK context
*/
export default function ConfirmationCooperationSegmentsCreate(context) {
    
    let segments = [];

    segments.push({
        'DisplayValue': context.localizeText('scenario_none'),
        'ReturnValue': 'None',
    });

    segments.push({
        'DisplayValue': context.localizeText('scenario_support'),
        'ReturnValue': 'Support',
    });

    /** TODO: Implement scenario_verify segment when supported by backend
    segments.push({
        'DisplayValue': context.localizeText('scenario_verify'),
        'ReturnValue': 'Verify',
    });
    */
        
    return segments;
}

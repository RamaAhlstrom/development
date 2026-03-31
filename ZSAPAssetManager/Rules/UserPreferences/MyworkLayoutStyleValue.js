import PersonalizationPreferences from '../../../SAPAssetManager/Rules/UserPreferences/PersonalizationPreferences';

/**
* Gets user preference for new home screen layout switch
* @param {IClientAPI} clientAPI
*/
export default function MyworkLayoutStyleValue(context) {

let datavalue=PersonalizationPreferences.getDeltaSyncPreference(context, 'GowriMyworklayiut1');
if (datavalue && datavalue.startsWith('"') && datavalue.endsWith('"')) {
    datavalue = datavalue.substring(1, datavalue.length - 1); // remove quotes
}
    if(datavalue=='new')
{
    return 'new';
}
else
{
return 'classic';
}

}
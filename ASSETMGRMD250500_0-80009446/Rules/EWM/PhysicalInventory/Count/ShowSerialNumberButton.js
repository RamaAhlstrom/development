/**
* The function will return true if the serial number button should be shown
* @param {IClientAPI} clientAPI
*/
export default function ShowSerialNumberButton(context) {  
    return !context.binding.ZeroCount && !!context.binding.Serialized;
}

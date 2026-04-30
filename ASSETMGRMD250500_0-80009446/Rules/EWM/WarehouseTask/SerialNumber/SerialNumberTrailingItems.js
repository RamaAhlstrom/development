/**
 * Allow delete action if SN is local and can be removed
 * @param {IClientAPI} context 
 * @returns delete action if SN is local and can be removed
 */
export default function SerialNumbersTrailingItems(context) {
    return context.binding.usedInOtherConfirmation || context.binding.downloaded ? [] : ['Delete_Item'];
}

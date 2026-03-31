import libCom from '../../Common/Library/CommonLibrary';

/**
 * Only local confirmations can be edited
 * @param {*} context 
 * @returns 
 */
export default function ConfirmationAllowEdit(context) {
    const currentReadLink = libCom.getTargetPathValue(context, '#Property:@odata.readLink');
    return libCom.isCurrentReadLinkLocal(currentReadLink);
}

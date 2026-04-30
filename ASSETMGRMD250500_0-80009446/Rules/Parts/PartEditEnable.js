import libCom from '../Common/Library/CommonLibrary';

/**
* Determine if we can edit a part
*/
export default function PartEditEnable(context, customBinding) {
    const binding = customBinding || context.binding;
    const readLink = binding['@odata.readLink'];

    return libCom.isCurrentReadLinkLocal(readLink) && !!binding['@sap.hasPendingChanges'];
}

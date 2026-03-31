import libCommon from '../Common/Library/CommonLibrary';

export default function IsMeasurementDocEditable(pageClientAPI) {
    let currentReadLink = libCommon.getTargetPathValue(pageClientAPI, '#Property:@odata.readLink');
    return libCommon.isCurrentReadLinkLocal(currentReadLink) && !!pageClientAPI.binding['@sap.hasPendingChanges'];
}

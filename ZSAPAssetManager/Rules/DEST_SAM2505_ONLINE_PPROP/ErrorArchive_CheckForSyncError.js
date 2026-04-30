/**
 * Describe this function...
 * @param {IClientAPI} context
 */
export default function CheckForSyncError(context) {
    context.count('/ZSAPAssetManager/Services/DEST_SAM2505_ONLINE_PPROP.service', 'ErrorArchive', '').then(errorCount => {
        if (errorCount > 0) {
            return context.getPageProxy().executeAction('/ZSAPAssetManager/Actions/ErrorArchive/ErrorArchive_SyncFailure.action').then(function() {
                return Promise.reject(false);
            });
        }
    });
}
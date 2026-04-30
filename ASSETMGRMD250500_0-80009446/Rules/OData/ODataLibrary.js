import libThis from './ODataLibrary';
import Logger from '../Log/Logger';

export default class {

    static isOnlineService(context) {
        let provider = context.getODataProvider('/SAPAssetManager/Services/OnlineAssetManager.service');
        return provider.isInitialized();
    }

    static async initializeOnlineService(context) {
        if (libThis.isOnlineService(context)) {
            return Promise.resolve(true);
        }
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(() => {
            return true;
        }).catch((error) => {
            Logger.error('initializeOnlineService', error);
            return false;
        });
    }

    static async readFromOfflineService(context, entitySet, queryOptions, properties = []) {
        try {
            return await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, properties, queryOptions);
        } catch (error) {
            Logger.error('readFromOfflineService', error);
            return [];
        }
    }

    static hasAnyPendingChanges(binding) {
        return Object.prototype.hasOwnProperty.call(binding, '@sap.hasPendingChanges') || Object.prototype.hasOwnProperty.call(binding, '@sap.inErrorState');
    }
}

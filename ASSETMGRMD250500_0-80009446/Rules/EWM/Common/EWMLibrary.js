import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import FLLibrary from '../../FL/Common/FLLibrary';

export const WarehouseOrderStatus = Object.freeze({
    Open: '',
    InProgess: 'D',
    Confirmed: 'C',
});

export const WarehouseTaskStatus = Object.freeze({
    Open: '',
    Waiting: 'B',
    Confirmed: 'C',
});

export const PhysicalInventoryStatus = Object.freeze({
    Counted:'COUN',
    Recounted:'RECO',
    Posted:'POST',
});

export const DefiningRequestsLite = Object.freeze({
    WarehouseResources:'WarehouseResources',
    WarehouseOrders:'WarehouseOrders',
    WarehouseTasks:'WarehouseTasks',
    WarehouseTaskSerialNumbers:'WarehouseTaskSerialNumbers',
    WarehousePickHUs:'WarehousePickHUs', 
    WarehousePhysicalInventories:'WarehousePhysicalInventories',
    WarehousePhysicalInventoryItems:'WarehousePhysicalInventoryItems',
    WarehousePhysicalInventoryItemSerials:'WarehousePhysicalInventoryItemSerials',
});

export const WarehouseOrdersTasksDefiningRequestsList = [
    DefiningRequestsLite.WarehouseResources,
    DefiningRequestsLite.WarehouseOrders,
    DefiningRequestsLite.WarehouseTasks,
    DefiningRequestsLite.WarehouseTaskSerialNumbers,
    DefiningRequestsLite.WarehousePickHUs,
].map((req) => ({
    Name: req,
    Query: req,
}));

export const EWMType = Object.freeze({
    WarehouseOrder: 'WarehouseOrder',
    WarehouseTask: 'WarehouseTask',
    WarehousePhysicalInventory: 'WarehousePhysicalInventory',
    WarehousePhysicalInventoryItem: 'WarehousePhysicalInventoryItem',
});

export const DocumentTypes = Object.freeze({
    WarehouseOrder: 'WHO',
    WarehouseTask: 'WHT',
    WarehousePhysicalInventoryItem: 'WHPI',
});

/**
 * Does the confirmation for the task exist
 * @param {IClientAPI} context **/

export function isTaskConfirmed(context, warehouseTask = context.binding.WarehouseTask) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], `$filter=WarehouseTask eq '${warehouseTask}'&$expand=WarehouseTaskConfirmation_Nav`).then(result => {
        if (result && result.length > 0) {
            return (result.getItem(0).WarehouseTaskConfirmation_Nav.length > 0);
        }
        return false;
    });  
}

/**
 * Does the task have serial numbers for the product
 * The field is called SerialNoRequiredLevel and if it has any value then it has serial numbers
 * The value is either '3/5' is meaning serial 3 serial numbers are provided for total quantity of 5
 * It can be any combination of numbers, like 0/5, 1/5, 5/5, 10/5.
 * The second number is the total quantity and cannot be 0.
 * @param {IClientAPI} context 
 * @param {WarehouseTask} task 
 * @returns true if the task has serial numbers
 */
export function isTaskWithSerialNumbers(context, task) {
    const binding = task
        ? task
        : (context?.binding && context.binding['@odata.type']?.split('.')[1] === 'WarehouseTaskConfirmation'
            ? context.binding.WarehouseTask_Nav
            : context.binding);
    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/EWM/WarehouseTaskConfirmation.global').getValue(), `WarehouseTaskSerialNumber_Nav: ${binding && binding.SerialNoRequiredLevel}`);   
    return !!binding?.SerialNoRequiredLevel;
}

/**
 * Get the warehouse task binding from the context
 * @param {IClientAPI} context 
 * @returns warehouse task binding
 */
export function GetWarehouseTaskBinding(context) {
    // check current binding
    let bindingType = context.binding?.['@odata.type'];
    if (bindingType === '#sap_mobile.WarehouseTask') {
        return context.binding;
    } else if (bindingType === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding.WarehouseTask_Nav;
    }
    return undefined;
}

/**
 * Get the warehouse task confirmation binding from the context
 * @param {IClientAPI} context 
 * @returns warehouse task confirmation binding
 */
export function GetWarehouseTaskConfirmationBinding(context) {
    // check current binding
    const bindingType = context.binding['@odata.type'];
    if (bindingType === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding;
    } else if (bindingType === '#sap_mobile.WarehouseTask') {
        return context.binding.WarehouseTaskConfirmation_Nav;
    }
    return undefined;
}

export function GetConfirmedAndTotalQuantity(context, binding = null) {
    binding = binding || GetWarehouseTaskBinding(context);
    let totalQuantity = parseFloat(binding?.Quantity);
    let confirmedQuantity = 0;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], `$filter=WarehouseTask eq '${binding?.WarehouseTask}'&$expand=WarehouseTaskConfirmation_Nav`)
        .then(result => {
            const confirmations = result.getItem(0)?.WarehouseTaskConfirmation_Nav;
            if (confirmations && confirmations.length > 0) {
                confirmedQuantity = confirmations.reduce((sum, confirmation) => sum + parseFloat(confirmation.ActualQuantity), 0);
            }
            return { confirmedQuantity, totalQuantity };
        })
        .catch(() => {
            return { confirmedQuantity, totalQuantity };
        });
}

/**
 * Get the quantity available for confirmation
 * @param {IClientAPI} context 
 * @returns warehouse task confirmation binding
 */
export function GetWarehouseTaskAvailableConfirmationQuantity(context) {
    const binding = GetWarehouseTaskBinding(context) || GetWarehouseTaskBinding(context.getPageProxy());
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTaskConfirmations', ['ActualQuantity'], `$filter=WarehouseTask eq '${binding.WarehouseTask}'`).then(result => {
        let totalQuantity = binding.Quantity;
        if (result && result.length > 0) {
            totalQuantity = result.reduce((accumulator, element) => accumulator - parseFloat(element.ActualQuantity), binding.Quantity);
        }
        return totalQuantity;
    });
}

export function RemoveHandlingUnitStateVariables(context) {
    CommonLibrary.removeStateVariable(context, [
        'HUIdent',
        'InputtedPackagingMaterialValue',
        'InputtedHandlingUnitValue',
        'PackagingMaterialCreate',
        'RemainingQuantity',
        'WarehouseTaskValue',
        'ExceptionDiffCase',
    ]);
}

export default class {
    static getWarehouseTaskNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationNav.action',
            entitySet: 'WarehouseTasks',
            expandOptions: '$expand=WarehouseTaskConfirmation_Nav,WarehouseTaskSerialNumber_Nav',
        };
    }
    static getNavigationObjectMap() {
        return {
            'WarehouseTasks'   : this.getWarehouseTaskNavOptions(),
        };
    }
    /**
     * Opens document details page for the Inventory Persona
     */
    static openEWMDocDetailsPage(context, entitySet, queryOptions, documentType) {     
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(data => {
            if (data.length === 1) {
                CommonLibrary.setStateVariable(context, 'EmptySearchOnOverview', true);
                let docInfo = data.getItem(0);
                const page = context.evaluateTargetPathForAPI('#Page:EWMOverviewPage');
                page.setActionBinding(docInfo);
                
                switch (documentType) {
                    case DocumentTypes.WarehouseOrder:
                        return page.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderDetailsPageNav.action');
                    case DocumentTypes.WarehouseTask:
                        return page.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskDetailsPageNav.action');
                    case DocumentTypes.WarehousePhysicalInventoryItem:
                        return page.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/EWMPhysicalInventoryItemDetailsNav.action');
                }
            }
            return false;
        });
    }
    static navigateOnSearchStringMatch(context, entitySet, query) {
        const navObject = this.getNavigationObjectMap()[entitySet];
        return CommonLibrary.navigateOnRead(context.getPageProxy(), navObject.navAction, navObject.entitySet, `${query}&${navObject.expandOptions}`);
    }
    static onOverviewPageSectionLoad(context, queryBuilder, filterQuery, entitySet, topValue) {
        queryBuilder.top(topValue);
        const searchString = context.searchString?.toLowerCase();
        const autoOpenEnabled = (CommonLibrary.getAppParam(context, 'EWM', 'search.auto.navigate') === 'Y');
        if (searchString && autoOpenEnabled) {
            const entityName = entitySet;
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, filterQuery)
                    .then((count) => {
                        const clientData = context.getClientData();
                        if (ValidationLibrary.evalIsEmpty(clientData[searchString])) {
                            clientData[searchString] = {
                                'WarehouseOrders' : null,
                                'WarehouseTasks': null,
                            };
                        }
                        clientData[searchString][entityName] = {
                            count: count,
                            query: filterQuery,
                        };
                        
                        if (FLLibrary.isLastQueryForMatch(clientData[searchString])) {
                            if (isOnlyOneWTMatch(clientData[searchString])) {
                                context.searchString = '';
                                const navObject = Array.from(Object.entries(clientData[searchString])).reduce((acc, [key, value]) => {
                                    if (value.count === 1 && key === 'WarehouseTasks') {
                                      acc[key] = value;
                                    }
                                    return acc;
                                  }, {});
                                clientData[searchString] = undefined;
                                return this.navigateOnSearchStringMatch(context, Object.keys(navObject)[0], Object.values(navObject)[0].query);
                            }
                            clientData[searchString] = undefined;
                        }
                        return queryBuilder;
                    });
        }
        return queryBuilder;
    }
} 

function isOnlyOneWTMatch(clientData) {
    return clientData.WarehouseTasks && clientData.WarehouseTasks.count === 1;
}


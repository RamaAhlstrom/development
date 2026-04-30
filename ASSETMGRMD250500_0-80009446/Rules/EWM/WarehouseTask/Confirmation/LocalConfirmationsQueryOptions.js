import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WarehouseTaskQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('WarehouseTaskItem');
    queryBuilder.expand(
        'WarehouseTask_Nav',
        'WarehouseTask_Nav/WarehouseProcessCategory_Nav',
        'WarehouseTask_Nav/WarehouseTaskSerialNumber_Nav',
        'WarehouseTask_Nav/WarehouseProcessType_Nav',
        'WarehouseTask_Nav/WarehouseTaskConfirmation_Nav',
        'WarehousePickHUTaskC_Nav',
    );

    const warehouseTask = context.binding.WarehouseTask;
    if (warehouseTask) {
        queryBuilder.filter(`WarehouseTask eq '${warehouseTask}'`);
    }

    const searchString = context.searchString;
    if (searchString) {
        const searchByProperties = [
            'WarehouseTask',
            'WarehouseTask_Nav/Product',
            'SrcHU',
            'DestHU',
            'DestinationBin',
            'WarehouseTask_Nav/SourceBin',
        ];
        const searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
        queryBuilder.filter(searchQuery);
    }

    return queryBuilder;
}


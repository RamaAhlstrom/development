import FilterSettings from '../Filter/FilterSettings';

export default function DefaultOrderByEquipmentId(context) {
    const defaultFilters = [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'EquipId', undefined, ['EquipId'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('equipment_id')])];
    FilterSettings.saveInitialFilterForPage(context, defaultFilters);
    return defaultFilters;
}

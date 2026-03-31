export default function WarehouseTaskTags(context) {
        const binding = context.binding;
        const tags = [];
    
        if (binding?.WarehouseProcessCategory_Nav?.Description) {
            tags.push({
                Text: context.localizeText('process_category_x', [binding.WarehouseProcessCategory_Nav.Description]),
            });
        }
    
        return tags;
}


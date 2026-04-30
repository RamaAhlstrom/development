import LLMSchemaBuilder from './LLMSchemaBuilder';

export default class SchemaFetcher {
    static getSchemas() {
        return {
            note: LLMSchemaBuilder.getNoteSchema(),
            operation: LLMSchemaBuilder.getOperationSchema(),
            expense: LLMSchemaBuilder.getExpenseSchema(),
            mileage: LLMSchemaBuilder.getMileageSchema(),
            time: LLMSchemaBuilder.getTimeSchema(),
            notification: LLMSchemaBuilder.getNotificationItemSchema(),
        };
    }
    /**
     * This function is designed to retrieve the description of a specific property, or a sub-property, from a schema. 
     * @param {*} schemaName 
     * @param {*} propertyName 
     * @param {*} subProperty 
     * @returns 
     */
    static getPropertyDescription(schemaName, propertyName, subProperty) {
        const schema = this.getSchemas()[schemaName]?.[schemaName];
        if (schema && schema.properties && schema.properties[propertyName]) {
            const property = schema.properties[propertyName];
            if (subProperty && property[subProperty]) {
                return property[subProperty] || 'Sub-property not available';
            }
            return property.description || 'Description not available';
        }
        return 'Schema, property, or sub-property not found';
    }
}

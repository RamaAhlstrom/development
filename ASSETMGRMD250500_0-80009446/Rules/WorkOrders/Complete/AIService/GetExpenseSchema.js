import SchemaFetcher from './SchemaFetcher';
export default function GetExpenseSchema() {
    return SchemaFetcher.getPropertyDescription('expense', 'amount', 'description');
}

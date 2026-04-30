import SchemaFetcher from './SchemaFetcher';

export default function GetMileageSchema() {
    return SchemaFetcher.getPropertyDescription('mileage', 'number', 'description');
}

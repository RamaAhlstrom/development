import SchemaFetcher from './SchemaFetcher';
export default function GetTimeSchema() {
    return SchemaFetcher.getPropertyDescription('time', 'duration', 'description');
}

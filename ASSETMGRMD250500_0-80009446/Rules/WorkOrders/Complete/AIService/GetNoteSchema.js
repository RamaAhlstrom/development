import SchemaFetcher from './SchemaFetcher';

export default function GetNoteSchema() {
    return SchemaFetcher.getPropertyDescription('note', 'content', 'description');
}

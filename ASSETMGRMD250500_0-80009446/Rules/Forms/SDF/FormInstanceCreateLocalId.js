import GenerateLocalID from '../../Common/GenerateLocalID';

export default function FormInstanceCreateLocalId(context) {
    const prefix = 'LOCAL_SDF';

    return GenerateLocalID(context, 'DynamicFormInstances', 'FormInstanceID', '0000000', `$filter=startswith(FormInstanceID, '${prefix}') eq true`, prefix).then(localId => {
        return localId;
    });
}

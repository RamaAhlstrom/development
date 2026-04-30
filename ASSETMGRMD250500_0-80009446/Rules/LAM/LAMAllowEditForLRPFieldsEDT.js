import LAMAllowEditForLRPFields from './LAMAllowEditForLRPFields';

/**
 * EDT extension uses isReadOnly instead of isEditable, so we need to reverse the result
 * @param {} context 
 * @returns Promise: Boolean
 */
export default async function LAMAllowEditForLRPFieldsEDT(context) {
    return !(await LAMAllowEditForLRPFields(context));
}

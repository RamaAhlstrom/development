import libCom from '../Common/Library/CommonLibrary';

/**
 * Handle max length validation for the long text comment field
 * @param {*} context 
 */
export default function GenerateQRCodeCommentOnChange(context) {
    const noteValue = context.getValue();
    let charLimit = libCom.getStateVariable(context, 'CooperationMaxTextLength');

    if (noteValue && noteValue.length > charLimit) {
        let note = noteValue.substring(0, charLimit);
        context.setValue(note);
    }
}

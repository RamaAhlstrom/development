/**
 *
 * @param {IClientAPI} listPickerProxy
 */
export default function NotificationNPCValueChanged(listPickerProxy) {
    const formCellContainer = listPickerProxy.getPageProxy().getControl('FormCellContainer');
    const selection = listPickerProxy.getValue();
    const typeListPicker = formCellContainer.getControl('TypeLstPkr');
    // if (selection.length && selection[0].ReturnValue === '01') { // check if Emergency Work selected
    //     typeListPicker.setEditable(false);
    //     typeListPicker.setValue('Y1'); // hardcoding this value for 2402 - use AppParam instead in 2408
    // } else {
    //     typeListPicker.setEditable(true);
    //     // no need resetting value because it exists in any other types
    // }

    ////////////////////////////////////////////////////
    if (selection.length && (selection[0].ReturnValue === '01' || selection[0].ReturnValue === '03')) { // check if Emergency Work selected
        typeListPicker.setEditable(false);
        typeListPicker.setValue('Y1'); // hardcoding this value for 2402 - use AppParam instead in 2408
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('EffectListPicker').setValue(["1"]);
        try {
            
      //  alert(JSON.stringify(listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('PrioritySeg').getValue()));
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('PrioritySeg').setValue("1");
        //alert(listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('PrioritySeg').getValue());
        } catch (error) {
           // alert("error")
        }
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('MainWorkCenterListPicker').setVisible(true);
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('Persnal_Num').setVisible(true);
    } else {
        typeListPicker.setEditable(true);
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('EffectListPicker').setValue(["3"]);
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('PrioritySeg').setValue("3")
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('MainWorkCenterListPicker').setVisible(false);
        listPickerProxy.getPageProxy().getControl('FormCellContainer').getControl('Persnal_Num').setVisible(false);
        // no need resetting value because it exists in any other types
    }
}

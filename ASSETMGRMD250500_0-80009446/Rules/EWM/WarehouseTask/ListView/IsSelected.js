/**
* Returns true if all items are selected in the list view.
* @param {IClientAPI} clientAPI
*/
export default function IsSelected(clientAPI) {
    return clientAPI.getParent().getParent()._control.sections[0].binding.length === clientAPI.getSelectedItemsCount();
}

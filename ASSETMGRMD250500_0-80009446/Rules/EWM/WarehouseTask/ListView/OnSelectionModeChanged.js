import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';

/**
 * Selection mode changed event handler for the table.
 * @param {IClientAPI} clientAPI 
 * @returns Promise<any>
 */
export default function OnSelectionModeChanged(clientAPI) {
    const selectionMode = clientAPI.getPageProxy().getControls()[0].getSections()[0].getSelectionMode();
    SetVisibleItem(clientAPI, selectionMode === 'None' ? HEADER_ITEMS.SelectItems : HEADER_ITEMS.DeselectAll);
    return Promise.resolve(true);
}

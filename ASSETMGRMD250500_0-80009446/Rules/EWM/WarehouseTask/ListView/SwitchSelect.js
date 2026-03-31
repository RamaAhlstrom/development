import { checkFilters } from './WarehouseTaskListCaption';
import ComLib from '../../../Common/Library/CommonLibrary';
import IsResourceClaimed from '../../Resource/IsResourceClaimed';

export const HEADER_ITEMS = Object.freeze({
    SelectItems: 'SelectItems',
    SelectAll: 'SelectAll',
    DeselectAll: 'DeselectAll',
});

export default function SwitchSelect(clientAPI) {
    const table = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const page = ComLib.getPageName(clientAPI);
    const isAnySelected = table.getSelectedItems().length > 0;

    SetVisibleItem(clientAPI, isAnySelected ? HEADER_ITEMS.SelectAll : HEADER_ITEMS.DeselectAll);

    if (isAnySelected) {//If there are selected items, deselect all
        ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', false);
        clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(false);

        ComLib.enableToolBar(clientAPI, page, 'UnassignButton', IsResourceClaimed(clientAPI));
        clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(true);

        table.deselectAllItems();
    } else { //If there are no selected items, select all
        const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
        const { hasConfirmedFilter, hasOpenFilter } = checkFilters(filters);
        const confirmFilterCondition = (!hasConfirmedFilter && hasOpenFilter);

        ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', confirmFilterCondition);
        ComLib.enableToolBar(clientAPI, page, 'UnassignButton', !confirmFilterCondition && IsResourceClaimed(clientAPI));
        clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(confirmFilterCondition);
        clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(!confirmFilterCondition);
        table.setSelectionMode('Multiple');
        table.selectAllItems();
    }
}

export function SetVisibleItem(clientAPI, visibleHeaderItem) {
    const table = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    Object.keys(HEADER_ITEMS).forEach(item => {
        const headerItem = table.getHeader().getItem(item);
        if (headerItem) {
            headerItem.setVisible(item === visibleHeaderItem);
        }
    });
}

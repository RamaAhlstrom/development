import { checkFilters, SetToolbarVisible } from './WarehouseTaskListCaption';
import ComLib from '../../../Common/Library/CommonLibrary';
import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';
import IsResourceClaimed from '../../Resource/IsResourceClaimed';

export default function OnDocumentSelectedOrUnselected(clientAPI) {
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const page = ComLib.getPageName(clientAPI);
    const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
    const { hasConfirmedFilter, hasOpenFilter } = checkFilters(filters);
    const confirmFilterCondition = (itemCount > 0 && !hasConfirmedFilter && hasOpenFilter);
    
    ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', confirmFilterCondition);
    SetToolbarVisible(clientAPI, page, confirmFilterCondition);
    ComLib.enableToolBar(clientAPI, page, 'UnassignButton', !confirmFilterCondition && IsResourceClaimed(clientAPI));
    clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(confirmFilterCondition);
    clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(!confirmFilterCondition);

    if ( itemCount === 0 ) {
        SetVisibleItem(clientAPI, HEADER_ITEMS.SelectAll);
    } else if (section?._context.element?.binding?.length === itemCount ) {
        SetVisibleItem(clientAPI, HEADER_ITEMS.DeselectAll);
    } 
}

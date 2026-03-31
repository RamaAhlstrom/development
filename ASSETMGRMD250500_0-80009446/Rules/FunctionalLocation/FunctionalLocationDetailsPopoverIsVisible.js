import EquipmentTakeReadingIsVisible from '../Equipment/EquipmentTakeReadingIsVisible';
import EquipmentInstallationVisible from '../Equipment/Installation/EquipmentInstallationVisible';
import UninstallVisible from '../Equipment/Uninstall/UninstallVisible';
import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';
import IsS4Visible from '../S4RelatedHistories/IsS4Visible';
import IsWCMOperator from '../WCM/IsWCMOperator';
import NotificationIsSamePlanningPlant from './NotificationIsSamePlanningPlant';
import WorkOrderIsSamePlanningPlant from './WorkOrderIsSamePlanningPlant';

/**
* Checks all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} context
*/
export default async function FunctionalLocationDetailsPopoverIsVisible(context) {
    if (IsWCMOperator(context)) {
        return false;
    }

    // resolve asynchronous rules
    const itemsVisibility = await Promise.all([
        EquipmentTakeReadingIsVisible(context),
        EquipmentInstallationVisible(context),
        UninstallVisible(context),
    ]);

    return [
        ...itemsVisibility,
        WorkOrderIsSamePlanningPlant(context),
        NotificationIsSamePlanningPlant(context),
        IsS4Visible(context),
        SDFIsFeatureEnabled(context),
    ].some(visibility => visibility);
}

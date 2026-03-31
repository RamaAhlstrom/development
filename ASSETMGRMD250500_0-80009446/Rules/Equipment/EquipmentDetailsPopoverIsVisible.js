import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';
import NotificationIsSamePlanningPlant from '../FunctionalLocation/NotificationIsSamePlanningPlant';
import WorkOrderIsSamePlanningPlant from '../FunctionalLocation/WorkOrderIsSamePlanningPlant';
import IsS4Visible from '../S4RelatedHistories/IsS4Visible';
import IsWCMOperator from '../WCM/IsWCMOperator';
import EquipmentTakeReadingIsVisible from './EquipmentTakeReadingIsVisible';
import InstallationVisible from './Installation/InstallationVisible';
import UninstallVisible from './Uninstall/UninstallVisible';

/**
* Checks all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} context
*/
export default async function EquipmentDetailsPopoverIsVisible(context) {
    if (IsWCMOperator(context)) {
        return false;
    }

    // resolve asynchronous rules
    const itemsVisibility = await Promise.all([
        EquipmentTakeReadingIsVisible(context),
        UninstallVisible(context),
    ]);
    
    return [
        ...itemsVisibility,
        WorkOrderIsSamePlanningPlant(context),
        NotificationIsSamePlanningPlant(context),
        InstallationVisible(context),
        IsS4Visible(context),
        SDFIsFeatureEnabled(context),
    ].some(visibility => visibility);
}

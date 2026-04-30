import ConfirmationCreateFromWOIsEnabled from '../Confirmations/CreateUpdate/ConfirmationCreateFromWOIsEnabled';
import IsAllowedExpenseCreate from '../Expense/CreateUpdate/IsAllowedExpenseCreate';
import MeasuringPointsTakeReadingsIsVisible from '../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsPDFAllowedForOrder from '../PDF/IsPDFAllowedForOrder';
import MileageAddIsEnabled from '../ServiceOrders/Mileage/MileageAddIsEnabled';
import EnableNotificationCreateFromWorkOrder from '../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import EnableWorkOrderCreateFromWorkOrder from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import AllowMeterCreate from './Meter/Details/AllowMeterCreate';
import CooperationIsEnabledForWorkOrder from '../Cooperation/CooperationIsEnabledForWorkOrder';
import EnableOperationCreate from '../UserAuthorizations/WorkOrders/EnableOperationCreate';
import IsAddSmartFormButtonVisible from '../Forms/FSM/AddSmartForm/IsAddSmartFormButtonVisible';
import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';

/**
* Check all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} clientAPI
*/
export default async function WorkOrderDetailsPopoverIsVisible(clientAPI) {
    // resolve asynchronous rules
    const itemsVisibility = await Promise.all([
        EnableWorkOrderCreateFromWorkOrder(clientAPI),
        EnableWorkOrderEdit(clientAPI),
        AllowMeterCreate(clientAPI),
        EnableNotificationCreateFromWorkOrder(clientAPI),
        MeasuringPointsTakeReadingsIsVisible(clientAPI),
        IsAllowedExpenseCreate(clientAPI),
        MileageAddIsEnabled(clientAPI),
        CooperationIsEnabledForWorkOrder(clientAPI),
        EnableOperationCreate(clientAPI),
        IsAddSmartFormButtonVisible(clientAPI),
    ]);

    return [
        ...itemsVisibility,
        IsPDFAllowedForOrder(clientAPI),
        ConfirmationCreateFromWOIsEnabled(clientAPI),
        SDFIsFeatureEnabled(clientAPI),
    ].some(visibility => visibility);
}

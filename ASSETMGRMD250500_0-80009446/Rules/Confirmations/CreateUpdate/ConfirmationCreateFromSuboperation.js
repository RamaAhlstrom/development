
import ConfirmationCreateUpdateNav from './ConfirmationCreateUpdateNav';
import ODataDate from '../../Common/Date/ODataDate';
import cooperationIsEnabled from '../../Cooperation/CooperationIsEnabled';

/** @param {{binding: MyWorkOrderSubOperation} & IClientAPI} context  */
export default function ConfirmationCreateFromSuboperation(context, extraParams) {
    const subOperation = context.binding;
    const currentDate = new Date();
    let odataDate = new ODataDate(currentDate);

    if (subOperation.PostingDate) {
        odataDate = new ODataDate(subOperation.PostingDate);
        odataDate._date.setHours(currentDate.getHours());
        odataDate._date.setMinutes(currentDate.getMinutes());
        odataDate._date.setSeconds(0);
    }

    let override = {
        'PostingDate': odataDate,
        'SubOperation': subOperation.SubOperationNo,
        'Operation': subOperation.OperationNo,
        'OrderID': subOperation.OrderId,
        'IsWorkOrderChangable': false,
        'IsOperationChangable': false,
        'IsSubOperationChangable': false,
    };

    if (cooperationIsEnabled(context)) {
        override.CooperationPlant = subOperation.WorkOrderOperation?.WOHeader?.PlanningPlant;
        override.CooperationOrderType = subOperation.WorkOrderOperation?.WOHeader?.OrderType;
    }

    if (extraParams) { //Add any extra parameters that were passed in
        override = {...override, ...extraParams};
    }

    return ConfirmationCreateUpdateNav(context, override, odataDate.date(), odataDate.date());
}

import style from '../../Common/Style/StyleFormCellButton';
import libCom from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import LaborTimeMinuteInterval from '../CreateUpdate/LaborTimeMinuteInterval';
import ODataDate from '../../Common/Date/ODataDate';
import onUpdate from '../../Confirmations/CreateUpdate/IsOnUpdate';
import activityTypeDefault from '../CreateUpdate/ActivityTypeDefault';
import libCoop from '../../Cooperation/CooperationLibrary';
import cooperationIsEnabled from '../../Cooperation/CooperationIsEnabled';

export default async function ConfirmationCreateUpdateOnPageLoad(context) {
    hideCancel(context);
    let stylizer = new Stylizer(['GrayText']);
    const formCellContainerProxy = context.getControl('FormCellContainer');
    if (!context.getBindingObject().IsOnCreate) {
        style(context, 'DiscardButton');
    }

    if (!context.getBindingObject().IsWorkOrderChangable) {
        let woPicker = formCellContainerProxy.getControl('WorkOrderLstPkr');
        stylizer.apply(woPicker, 'Value');

        if (onUpdate(context)) { //Only do this during edit, or MDK puts the wrong caption on the last screen field
            let confirmationId = formCellContainerProxy.getControl('ConfirmationIdProperty');
            stylizer.apply(confirmationId, 'Value');
        }

        if (!context.getBindingObject().IsOperationChangable) {
            let opPicker = formCellContainerProxy.getControl('OperationPkr');
            stylizer.apply(opPicker, 'Value');
            if (!context.getBindingObject().IsSubOperationChangable) {
                let subOpPicker = formCellContainerProxy.getControl('SubOperationPkr');
                stylizer.apply(subOpPicker, 'Value');
            }
        }
    }

    await returnLaborTimeMinuteInterval(context, formCellContainerProxy);
    return await cooperationSetup(context);
}

function returnLaborTimeMinuteInterval(context, formCellContainerProxy) {
    return LaborTimeMinuteInterval(context, context.getBindingObject().OrderID, context.getBindingObject().Operation, context.getBindingObject().Operation).then(duration => { //Handle clock in/out processing if necessary
        let durationControl = formCellContainerProxy.getControl('DurationPkr');
        durationControl.setValue(duration);

        if (context.getBindingObject().IsOnCreate) {
            let startDateTime;

            if (libCom.isDefined(context.getBindingObject().PostingDate)) {
                startDateTime = new ODataDate(context.getBindingObject().PostingDate);
            } else {
                startDateTime = new ODataDate();
            }

            startDateTime.date().setMinutes(startDateTime.date().getMinutes() - duration);

            let startDateControl = formCellContainerProxy.getControl('StartDatePicker');
            startDateControl.setValue(startDateTime.date());

            let startTimeControl = formCellContainerProxy.getControl('StartTimePicker');
            startTimeControl.setValue(startDateTime.date());
        }

        //Set initial control values from binding
        let woControl = formCellContainerProxy.getControl('WorkOrderLstPkr');
        let opControl = formCellContainerProxy.getControl('OperationPkr');
        let subControl = formCellContainerProxy.getControl('SubOperationPkr');
        let varControl = formCellContainerProxy.getControl('VarianceReasonPkr');
        let actControl = formCellContainerProxy.getControl('ActivityTypePkr');
        let indicatorControl = formCellContainerProxy.getControl('AcctIndicatorPkr');

        if (context.getBindingObject().OrderID) {
            woControl.setValue(context.getBindingObject().OrderID);
        }

        if (context.getBindingObject().Operation) {
            opControl.setValue(context.getBindingObject().Operation);
        }

        if (context.getBindingObject().SubOperation) {
            subControl.setValue(context.getBindingObject().SubOperation);
        }

        if (context.getBindingObject().VarianceReason) {
            varControl.setValue(context.getBindingObject().VarianceReason);
        }

        if (context.getBindingObject().AccountingIndicator) {
            indicatorControl.setValue(context.getBindingObject().AccountingIndicator);
        }

        if (context.getBindingObject().ActivityType) {
            actControl.setValue(context.getBindingObject().ActivityType);
        } else {
            actControl.setValue(activityTypeDefault(context));
        }

        libCom.saveInitialValues(context);
        return true;
    });
}

/**
 * Default the cooperation fields if they exist in the binding object
 * @param {*} context
 * @param {*} formCellContainerProxy 
 */
export async function cooperationSetup(context, params) {
    let binding;
    const screen = context.getControl('FormCellContainer');

    if (cooperationIsEnabled(context)) {
        if (params) {
            binding = params;
        } else {
            binding = context.getBindingObject();
        }

        if (binding.CooperationPersonnelNumber) {
            screen.getControl('ResponsiblePersonnelNum').setValue(binding.CooperationPersonnelNumber);
            screen.getControl('ResponsiblePersonnelNum').setVisible(true);
        }

        if (binding.CooperationNote) {
            binding.CooperationNote = binding.CooperationNote.replace(/\\'/g, "'"); //Unescape the note
            screen.getControl('DescriptionNote').setValue(binding.CooperationNote);
        }

        await finalizeCooperationFields(context, binding);
    }
}

/**
 * If this is a cooperation confirmation, then set the segment control and states of other controls
 * @param {*} context 
 * @param {*} binding 
 * @param {*} formCellContainerProxy 
 * @param {*} personnelControl 
 */
async function finalizeCooperationFields(context, binding) {
    let feature = binding.CooperationFeature;
    const screen = context.getControl('FormCellContainer');
    const captionDescriptor = context.getBindingObject().IsOnCreate ? 'create' : 'update';

    if (binding.ConfirmationScenario === '10') { //Handle editing an existing cooperation confirmation
        feature = 'Support';
    }
    if (feature) { //This is a cooperation confirmation, so set the segment control and states of other controls
        const stylizer = new Stylizer(['GrayText']);

        screen.getControl('CooperationSeg').setValue(feature, false);
        screen.getControl('CooperationSeg').setEditable(false);
        screen.getControl('ResponsiblePersonnelNum').setEditable(false);
        stylizer.apply(screen.getControl('ResponsiblePersonnelNum'), 'Value');
        screen.getControl('WorkOrderLstPkr').setEditable(false);

        let woTemp = context.getBindingObject()?.OrderID; //Grab the work order either from binding or picker on screen
        if (!woTemp) {
            woTemp = screen.getControl('WorkOrderLstPkr').getValue()[0].ReturnValue;
        }
        let configResult = await libCoop.readConfigByPlant(context, woTemp);
        let timeEntryNotAllowed = !(await libCoop.getAllowTimeUpdate(context, configResult));
        let defaultVariance = await libCoop.getDefaultVarianceReason(context, configResult);

        if (timeEntryNotAllowed) { //Time entry is not allowed for a cooperation, so hide the fields and set to zero duration
            screen.getControl('DurationPkr').setValue('0');
            screen.getControl('DurationPkr').setVisible(false);
            screen.getControl('StartDatePicker').setVisible(false);
            screen.getControl('StartTimePicker').setVisible(false);
        }
        
        //Other fields that are non-editable for cooperations
        screen.getControl('ActivityTypePkr').setVisible(false);
        screen.getControl('ActivityTypePkr').setEditable(false);
        screen.getControl('ActivityTypePkr').setValue('', false);
        screen.getControl('VarianceReasonPkr').setEditable(false);
        screen.getControl('AcctIndicatorPkr').setVisible(false);
        screen.getControl('AcctIndicatorPkr').setEditable(false);
        screen.getControl('AcctIndicatorPkr').setValue('', false);
        screen.getControl('IsFinalConfirmation').setVisible(false);
        screen.getControl('IsFinalConfirmation').setEditable(false);
        screen.getControl('IsFinalConfirmation').setValue(false, false);

        if (defaultVariance) {
            screen.getControl('VarianceReasonPkr').setValue(defaultVariance, false);
            screen.getControl('VarianceReasonPkr').setVisible(true);
        } else {
            screen.getControl('VarianceReasonPkr').setValue('', false);
            screen.getControl('VarianceReasonPkr').setVisible(false);
        }
        screen.getControl('DescriptionNote').setEditable(false); //Note is not editable for cooperations
        context.setCaption(context.localizeText(`cooperation_${captionDescriptor}_title`)); //Set screen caption for cooperation
    } else {
        if (captionDescriptor === 'update') { //Edited confirmations cannot be changed to cooperations
            screen.getControl('CooperationSeg').setEditable(false);
        }
    }
}

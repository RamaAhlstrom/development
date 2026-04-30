import failureModeGroupValue from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateQMCodeGroupValue'
import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import DocumentFieldsAddRequired from '../../../../SAPAssetManager/Rules/Documents/Create/DocumentFieldsAddRequired';
import CommonLib from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';



export default function RequiredFields(context) {
    const formcellContainerProxy = context.getPageProxy().getControl('FormCellContainer');
    const required = [];
    const notificationMandatoryFields = ['NotificationDescription', 'TypeLstPkr', 'PriorityLstPkr'];
    const currentPage = CommonLib.getPageName(context);
     /////////////////While completeing operation we meed to make few fiuelds are Manditory//////
         const onCreate = CommonLib.IsOnCreate(context);
     //  try {
    //     if(context.evaluateTargetPathForAPI('#Control:GeoLocation').getValue().length>40)
    //         {
    //            required.push('GeoLocation');
    //         }
    //  } catch (error) {
        
    //  }
     if ((function() { try { return context.evaluateTargetPathForAPI('#Control:EffectListPicker').visible; } catch (exc) { return false; } })()) {
        required.push('EffectListPicker');
    }
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:MainWorkCenterListPicker').visible; } catch (exc) { return false; } })()) {
        required.push('MainWorkCenterListPicker');
    }
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:QMCodeGroupListPicker').visible; } catch (exc) { return false; } })()) {
        required.push('QMCodeGroupListPicker');
    }
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:DetectionGroupListPicker').visible; } catch (exc) { return false; } })()) {
        if(onCreate && context.evaluateTargetPathForAPI('#Control:DetectionGroupListPicker').getValue().length==0)
            {
               // alert("inside")
            required.push('DetectionGroupListPicker');
            }
    }
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:LongTextNote').visible; } catch (exc) { return false; } })()) {
        if(onCreate)
        {
            
        required.push('LongTextNote');
        }
    }
    //  if ((function() { try { return context.evaluateTargetPathForAPI('#Control:Persnal_Num').visible; } catch (exc) { return false; } })()) {
    //     if(onCreate)
    //     {
            
    //     required.push('Persnal_Num');
    //     }
    // }
    try {
        if(context.evaluateTargetPathForAPI('#Control:EquipHierarchyExtensionControl').getValue()==undefined && context.evaluateTargetPathForAPI('#Control:FuncLocHierarchyExtensionControl').getValue()==undefined)
        {
            required.push('FuncLocHierarchyExtensionControl');
        }
    } catch (error) {
        
    }
    /////////////////While completeing operation we meed to make few fiuelds are Manditory//////

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker1').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker1');
    }

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker2').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker2');
    }

    //If a Failure Mode Group has been entered then Failure Mode Code is required or else backend will throw an error
    if (failureModeGroupValue(context)) {
        required.push('QMCodeListPicker');
    }

    // If Processing Context has been specified, Equipment and/or FLOC is required
    if (context.evaluateTargetPath('#Control:NPCSeg/#SelectedValue') === '01') {
        if (!context.evaluateTargetPath('#Control:EquipHierarchyExtensionControl').getValue() &&
            !context.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue()) {
            required.push('EquipHierarchyExtensionControl', 'FuncLocHierarchyExtensionControl');
        }
    }

    DocumentFieldsAddRequired(context, required);

    required.push(...NotificationItemRequiredFields(formcellContainerProxy), ...NotificationItemCauseRequiredFields(formcellContainerProxy));
    if (currentPage === 'NotificationAddPage') { // on the NotificationUpdateMalfunctionEnd page these fields are not existing
        required.push(
            ...GetUnpopulatedChildControlNamesWithPopulatedParentControl([notificationMandatoryFields], formcellContainerProxy),
            ...NotificationItemDetectionRequiredFields(formcellContainerProxy));
    }

    return required;
}

export function NotificationItemRequiredFields(formcellContainerProxy) {
    let itemSwitch = formcellContainerProxy.getControl('ShowAdditionalFieldsSwitch');

    if ((itemSwitch && itemSwitch.getValue()) || !itemSwitch) {
        return GetUnpopulatedChildControlNamesWithPopulatedParentControl([
            ['PartGroupLstPkr', 'PartDetailsLstPkr'],  // If 'Part Group' is entered, 'Part' should be mandatory
            ['DamageGroupLstPkr', 'DamageDetailsLstPkr']],  // if 'Damage Group' is entered, 'Damage' should be mandatory
            formcellContainerProxy);
    } else {
        return '';
    }
}

export function NotificationItemCauseRequiredFields(formcellContainerProxy) {
    let itemSwitch = formcellContainerProxy.getControl('ShowAdditionalFieldsSwitch');

    if ((itemSwitch && itemSwitch.getValue()) || !itemSwitch) {
        return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['CauseGroupLstPkr', 'CodeLstPkr']], formcellContainerProxy);  // if 'Cause Group' is entered, 'Cause Code' should be mandatory
    } else {
        return '';
    }
}

export function NotificationItemDetectionRequiredFields(formcellContainerProxy) {
    return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['DetectionGroupListPicker', 'DetectionMethodListPicker']], formcellContainerProxy); //If a detection group has been entered then the method is required
}

function GetUnpopulatedChildControlNamesWithPopulatedParentControl(parentChildControlNames, formcellContainerProxy) {
    return parentChildControlNames.filter(([parentName, _]) => isControlPopulated(parentName, formcellContainerProxy))  // eslint-disable-line no-unused-vars
        .map(([_, childName]) => childName);  // eslint-disable-line no-unused-vars
}

export function isControlPopulated(controlName, formcellContainerProxy) {
    return !ValidationLibrary.evalIsEmpty(formcellContainerProxy.getControl(controlName).getValue());
}

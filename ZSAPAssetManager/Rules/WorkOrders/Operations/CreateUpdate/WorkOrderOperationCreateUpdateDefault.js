// import WorkCenterControl from '../../../Common/Controls/WorkCenterControl';
// import WorkCenterPlant from '../../../Common/Controls/WorkCenterPlantControl';
// import CommonLibrary from '../../../Common/Library/CommonLibrary';
// import Logger from '../../../Log/Logger';
// import EquipFLocIsAllowed from '../WorkOrderOperationIsEquipFuncLocAllowed';
// import { PrivateMethodLibrary as libPrivate } from '../WorkOrderOperationLibrary';
import WorkCenterControl from '../../../../../SAPAssetManager/Rules/Common/Controls/WorkCenterControl';
import WorkCenterPlant from '../../../../../SAPAssetManager/Rules/Common/Controls/WorkCenterPlantControl';
import CommonLibrary from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../../SAPAssetManager/Rules/Log/Logger';
import EquipFLocIsAllowed from '../../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationIsEquipFuncLocAllowed';
import { PrivateMethodLibrary as libPrivate } from '../../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationLibrary';

export default async function WorkOrderOperationCreateUpdateDefault(control) {
    let controlName = control.getName();
    let binding = control.getPageProxy().binding;
    let isOnEdit = !CommonLibrary.IsOnCreate(control.getPageProxy());
////////////////////////////////////////////////////////////
    const mymaditory = await CheckManditory1(control.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.OrderType,control.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.MaintenancePlant,control.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.MaintenanceActivityType);
    
    function CheckManditory1(ordertype, plant,MaintenanceActivityType) {
        let filter = '';
        filter = "$filter=ZAUART eq '"+ordertype+"'";
        filter += " and ZWERKS eq '"+plant+"'";
        filter += " and ZILART eq '"+MaintenanceActivityType+"'";
        //alert(filter);
        return control.getPageProxy().read('/SAPAssetManager/Services/AssetManager.service', 'Zmobilecmplt', ['ZWERKS','ZAUART','ZCATLOG','ZTECHOBJ','ZMSCAN'], filter).then(result => {
            if (result.length > 0) {
              //  alert(JSON.stringify(JSON.stringify(result.getItem(0))));
                return result.getItem(0);
            }
            return undefined;
        });
    }
    //alert(controlName)
////////////////////////////////////////////////////////////
    switch (controlName) {
        case 'EquipHierarchyExtensionControl': {
            if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
                control.getPageProxy().getClientData().overrideValue = false;
                return '';
            }

            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getExtension();
            // Based on some backend config a notification sometimes is auto-created when creating a work order. 
            // Typically it is linked to WO header only, but with Objects List Assignment setting being 3, the notification is also linked to the first operation.
            return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                if (!result && isOnEdit) {
                    //extension.setEditable(false);
                    extension.setEditable(true);
                } //Default to operation first, then notification
                if (!binding.OperationFunctionLocation && !binding.OperationEquipment && CommonLibrary.isDefined(binding.NotifNum)) {
                    return setHierarchyListPickerValue(control, binding, extension, 'Equipment', 'EquipId');
                } else {
                    if (result === true || isOnEdit) {
                        /// Set the Equipment picker using the Header or Operation Functional Location
                        if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                            extension.setData(binding.HeaderEquipment);
                        } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                          // extension.setData(binding.OperationEquipment);
                           if(isOnEdit)
                            {
                                if(mymaditory!=undefined && mymaditory.ZMSCAN=="X")
                                {
                                }
                                else
                                {
                                    extension.setData(binding.OperationEquipment);
                                }
                            
                            }
                            else
                            {
                                extension.setData(binding.OperationEquipment);
                            }
                        } else { //Default operation during WO add                    
                            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);
                            return parentWorkOrderPromise.then(parentWorkOrder => {
                                if (parentWorkOrder && parentWorkOrder.Equipment) {
                                    extension.setData(parentWorkOrder.Equipment);
                                }
                                return true;
                            });
                        }
                    } else {
                        extension.setEditable(false);
                        extension.setEditable(true);extension.setEditable(false);
                    }
                    return true;
                }
            });
        }
        case 'FuncLocHierarchyExtensionControl': {
            if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
                control.getPageProxy().getClientData().overrideValue = false;
                return '';
            }
            
            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getExtension();
            // Based on some backend config a notification sometimes is auto-created when creating a work order. 
            // Typically it is linked to WO header only, but with Objects List Assignment setting being 3, the notification is also linked to the first operation.
            // For that reason we need to check the Notification associated with the operation first.
            return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                if (!result && isOnEdit) {
                   extension.setEditable(false);
                   extension.setEditable(true);
                } //Default to operation first, then notification
                if (!binding.OperationFunctionLocation && !binding.OperationEquipment && CommonLibrary.isDefined(binding.NotifNum)) {
                    if(mymaditory!=undefined && mymaditory.ZMSCAN=="X")
                        {
                            binding.ZMSCAN="X"
                        }
                        else
                        {
                            binding.ZMSCAN=""
                        }
                  //  return setHierarchyListPickerValue(control, binding, extension, 'FunctionalLocation', 'FuncLocId');
                    return setHierarchyListPickerValue(control, binding, extension, 'FunctionalLocation', 'FuncLocIdIntern');
                } else {
                    if (result === true || isOnEdit) {
                        /// Set the FLOC picker using the Header or Operation Functional Location
                        if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                            extension.setData(binding.HeaderFunctionLocation);
                        } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                             //extension.setData(binding.OperationFunctionLocation);
                             //
                              
                            //gowriequip
                            if(isOnEdit)
                                {
                                    if(mymaditory!=undefined && mymaditory.ZMSCAN=="X")
                                    {
                                    }
                                    else
                                    {
                                        extension.setData(binding.OperationFunctionLocation);
                                    }
                                }
                                else
                                {
                                    extension.setData(binding.OperationFunctionLocation);
                                }
                            extension.setData(binding.OperationFunctionLocation);
                        } else { //Default operation during WO add                    
                            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);
                            return parentWorkOrderPromise.then(parentWorkOrder => {
                                if (parentWorkOrder && parentWorkOrder.FunctionalLocation) {
                                    extension.setData(parentWorkOrder.FunctionalLocation);
                                }
                                return Promise.resolve(true);
                            });
                        }
                    } else {
                        extension.setEditable(true);
                    }
                    return Promise.resolve(true);
                }
            });
        }
        case 'WorkCenterLstPkr':
            return WorkCenterControl.getOperationPageDefaultValue(control);
        case 'WorkCenterPlantLstPkr':
            return WorkCenterPlant.getOperationPageDefaultValue(control);
        case 'DescriptionNote': {
            const isOnWOChangeset = CommonLibrary.isOnWOChangeset(control.getPageProxy());
            
            //Default description from parent work order or operation
            if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' && !isOnWOChangeset) {
                return control.getPageProxy().binding.OrderDescription;
            } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return control.getPageProxy().binding.OperationShortText;
            } else { //Default operation during WO add                    
                let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);                        
                return parentWorkOrderPromise.then(parentWorkOrder => {
                    if (parentWorkOrder && parentWorkOrder.Description) {
                        return parentWorkOrder.Description;
                    }
                    return control.getPageProxy().binding.OperationShortText || '';                                    
                });
            }
        }
        default:
            return '';
    }
}

function setHierarchyListPickerValue(control, binding, extension, readEntity, writeEntity) {
    return control.getPageProxy()
        .read('/SAPAssetManager/Services/AssetManager.service',
            `MyNotificationHeaders('${binding.NotifNum}')/${readEntity}`, [], '')
        .then(function setExtentionData(equipmentArray) {
            if(binding.ZMSCAN=="X")
                {
                 extension.setData("");
                }
                else
                {
            let equipment = equipmentArray.getItem(0);
            extension.setData(equipment[writeEntity]);
                }
            return Promise.resolve(true);
        })
        .catch(function processError(error) {
            Logger.error('Error in setHierarchyListPickerValue: ' + error);
            extension.setData('');
            return Promise.resolve(false);
        });
}

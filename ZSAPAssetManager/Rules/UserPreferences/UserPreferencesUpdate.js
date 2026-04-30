// import CommonLibrary from '../Common/Library/CommonLibrary';
// import Logger from '../Log/Logger';
// import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
// import PersonaLibrary from '../Persona/PersonaLibrary';
// import PersonalizationPreferences from './PersonalizationPreferences';
// import isWindows from './../Common/IsWindows';
// import AutoSyncLibrary from '../ApplicationEvents/AutoSync/AutoSyncLibrary';
// import IsSyncProfileOverride from './IsSyncProfileOverride';
// import IsAutoSyncFeatureEnabled from './IsAutoSyncFeatureEnabled';

import CommonLibrary from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import LoadPersonaOverview from '../../../SAPAssetManager/Rules/Persona/LoadPersonaOverview';
import PersonaLibrary from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import PersonalizationPreferences from '../../../SAPAssetManager/Rules/UserPreferences/PersonalizationPreferences';
import isWindows from '../../../SAPAssetManager/Rules/Common/IsWindows';
import AutoSyncLibrary from '../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import IsSyncProfileOverride from '../../../SAPAssetManager/Rules/UserPreferences/IsSyncProfileOverride';
import IsAutoSyncFeatureEnabled from '../../../SAPAssetManager/Rules/UserPreferences/IsAutoSyncFeatureEnabled';

export default async function UserPreferencesUpdate(context) {
    try {
        let resultPromise = context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');  // close the modal with cancel to clear all pending actions
        if (context.getControls() && context.getControls().length > 0) {
            
            const fcContainer = context.getControls()[0];
            const [layout, reading, checklists, MyWorkser, filters, aiSwitch, serviceItems, ManualUpload, AutoSyncPeriod, AutoSyncStatus, AutoSyncAppLaunch, AutoSyncOfflineOnline] = ['LayoutSeg', 'ReadingsScreenSeg', 'CheckListScreenSeg', 'MyWorkser', 'FilterSwitch', 'AISwitch', 'ServiceItemsViewSeg', 'ManualUploadSwitch', 'AutoSyncPeriodicControl', 'AutoSyncStatusSwitch', 'AutoSyncAppLaunchSwitch', 'AutoSyncOfflineOnlineSwitch'].map(controlName => fcContainer.getControl(controlName));
            if (reading) {
                await PersonalizationPreferences.setMeasuringPointView(context, CommonLibrary.getListPickerValue(reading.getValue()));
            }

            /////////////////////////////////Gowri Logic///////////////////////
            if (MyWorkser) {
                let CommonLibrary1=CommonLibrary;
                console.log(CommonLibrary1.getListPickerValue(MyWorkser.getValue()))
                console.log("value above")

                let myworkselectedvalue = CommonLibrary.getListPickerValue(MyWorkser.getValue());
                if (myworkselectedvalue == "new") {                    
                 await PersonalizationPreferences.setDeltaSyncPreference(context, 'GowriMyworklayiut1', 'new');
                 await delay(1200);
                console.log(PersonalizationPreferences.getDeltaSyncPreference(context, 'GowriMyworklayiut1'));
                }
                else {
                 await PersonalizationPreferences.setDeltaSyncPreference(context, 'GowriMyworklayiut1', 'classic');
                 await delay(1200);
                console.log(PersonalizationPreferences.getDeltaSyncPreference(context, 'GowriMyworklayiut1'));
                }

            }
            /////////////////////////////////Gowri Logic///////////////////////
            if (checklists) {
                await PersonalizationPreferences.setInspectionCharacteristicsView(context, CommonLibrary.getListPickerValue(checklists.getValue()));
            }
            if (filters) {
                await PersonalizationPreferences.setPersistFilterPreference(context, filters.getValue());
            }
            if (aiSwitch) {
                await PersonalizationPreferences.setAISwitchPreference(context, aiSwitch.getValue());
            }
            if (serviceItems) {
                await PersonalizationPreferences.setServiceItemsView(context, CommonLibrary.getListPickerValue(serviceItems.getValue()));
            }

            if (IsSyncProfileOverride(context)) {
                if (ManualUpload) {
                    await PersonalizationPreferences.setDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/SyncConfiguration/UploadOnly.global').getValue(), ManualUpload.getValue());
                }
                
                if (IsAutoSyncFeatureEnabled(context)) {
                    if (AutoSyncPeriod) {
                        const perodicValue = AutoSyncPeriod.getValue();
                        if (perodicValue === 0) {
                            AutoSyncLibrary.clearPeriodicInterval(context); //clear the previous periodic interval
                        }
                        await PersonalizationPreferences.setDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), AutoSyncPeriod.getValue());
                        if (perodicValue > 0) {
                            AutoSyncLibrary.autoSyncPeriodically(context);
                        }
                    } 
                    if (AutoSyncStatus) {
                        await PersonalizationPreferences.setDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global').getValue(), AutoSyncStatus.getValue());
                    } 
                    if (AutoSyncAppLaunch) {
                        await PersonalizationPreferences.setDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global').getValue(), AutoSyncAppLaunch.getValue());
                    } 
                    if (AutoSyncOfflineOnline) {
                        await PersonalizationPreferences.setDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global').getValue(), AutoSyncOfflineOnline.getValue());
                    } 
                }
            }
            if (!isWindows(context)) {
                if (layout) {
                    const oldValue = await PersonalizationPreferences.getLayoutStylePreference(context);
                    const newValue = CommonLibrary.getListPickerValue(layout.getValue());
                    if (oldValue !== newValue) {
                        resultPromise = resultPromise
                            .then(() => PersonalizationPreferences.setLayoutStylePreference(context, newValue))
                            .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
                            .then(activityIndicatorId => LoadPersonaOverview(context)
                                .then(() => context.dismissActivityIndicator(activityIndicatorId)))
                            .then(() => getSectionedTableOnOverviewPage(context))
                            .then(sectionedTable => sectionedTable?.redraw());  // Reload the sectioned table on the persona overview
                    }
                    //return context.evaluateTargetPathForAPI('#Page:-Previous').redraw();  // Refresh the action bar
                    //return LoadPersonaOverview(context);
                }
            }
        }
        return resultPromise;
    } catch (error) {  // in case a sync fails halfway
        Logger.debug('USER PREFERENCES', error);
        return undefined;
    }
}

async function getSectionedTableOnOverviewPage(context) {
    const overviewPageName = PersonaLibrary.getPersonaOverviewStateVariablePage(context);
    const overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    return overviewPage?.getControls()?.find(c => c.getType() === 'Control.Type.SectionedTable');
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

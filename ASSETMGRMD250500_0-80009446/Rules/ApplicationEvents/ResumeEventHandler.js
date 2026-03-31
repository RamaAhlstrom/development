
import autoSyncOnResume from './AutoSync/AutoSyncOnResume';
import libCoop from '../Cooperation/CooperationLibrary';

export default function ResumeEventHandler(context) {
    libCoop.checkAppResumedDuringCountDown(context);
    return autoSyncOnResume(context);
}

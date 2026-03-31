import common from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import DownloadActionsOrRulesSequence from './DownloadActionsOrRulesSequence';
import telemetryLib from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function DownloadDefiningRequest(context) {
    const sequences = [...DownloadActionsOrRulesSequence(context), { Callable: (clientapi) => finishInitSequence(clientapi) }];
    return sequences.reduce((acc, step) => acc.then(async () => {
       const activityIndicatorIndex = context.showActivityIndicator(step.Caption || '');
        await Promise.resolve()
            .then(() => step.Callable(context))
            .catch(error => Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `Failed run defining request step : ${error}`));
        context.dismissActivityIndicator(activityIndicatorIndex);
    }), Promise.resolve());
}

function finishInitSequence(context) {
    return Promise.all([
        common.setInitialSync(context),
        common.setApplicationLaunch(context, true),
    ]).then(() => {
        telemetryLib.logSystemEventWithInitialSyncEnd(context, 'end');
    });
}

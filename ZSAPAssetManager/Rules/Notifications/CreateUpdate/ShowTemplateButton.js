// import common from '../../Common/Library/CommonLibrary';
// import Logger from '../../Log/Logger';

import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';

/**
* Show/hide "Use Template" button
* @param {IClientAPI} context
*/
export default function ShowTemplateButton(context) {
	if (common.IsOnCreate(context)) {
		//////////////////////Update we added//////////////////
		return Promise.resolve(false);
		//////////////////////Update we added//////////////////
		return context.count('/SAPAssetManager/Services/AssetManager.service', 'LongTextTemplates', '').then(count => {
			return count > 0;
		}).catch(error => {
			Logger.error('Error in ShowTemplateButton: ' + error);
			return false;
		});
	}

	return Promise.resolve(false);
}

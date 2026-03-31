import libCom from '../../Common/Library/CommonLibrary';
export default function BulkUpdateClosePage(context) {
      const previousPage = libCom.getPreviousPageName(context);
      return context.executeAction({
        Name: '/SAPAssetManager/Actions/Page/ClosePage.action',
        Properties: {
            DismissModal: (previousPage === 'BulkFLEdit') ? '' : 'Action.Type.ClosePage.Completed',
            NavigateBackToPage: previousPage,
        },
    });
}

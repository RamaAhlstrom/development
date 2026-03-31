import isAndroid from '../../../../SAPAssetManager/Rules/Common/IsAndroid';
export default function WorkOrderDetailsOnPageLoad(context) {
   
    let page = context.getPageProxy().getPageDefinition('/ZSAPAssetManager/Pages/WorkOrders/JSPSTATUS/Zmobilecmplt_Create.page');
    console.log(context);
    let Q111=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl1');
    let Q21=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl2');
    let Q31=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl3');
    let Q41=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl4');
   
    if (isAndroid(context)) {
        let Q111m=context.localizeText('nQ1')+"\n\n"+context.localizeText('nQ11');
        Q111.setCaption(Q111m);

        let Q211m=context.localizeText('nQ2')+"\n\n"+context.localizeText('nQ22');
        Q21.setCaption(Q211m);

        let Q311m=context.localizeText('nQ3')+"\n\n"+context.localizeText('nQ33');
        Q31.setCaption(Q311m);

        let Q411m=context.localizeText('nQ4')+"\n\n"+context.localizeText('nQ44');
        Q41.setCaption(Q411m);
    }
    else
    {
        // let qmer=context.localizeText('nQ1')+"\n\n"+context.localizeText('nQ11');
        // Q111.setCaption(qmer);
        // Q111.setHelperText

    }
}

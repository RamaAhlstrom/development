/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Zstatusgridtable(clientAPI) {
   let pagename=clientAPI?.getPageProxy?.()?._page?._definition?.getName?.() ?? clientAPI?.getPageProxy?.()?._page?._definition?.name ?? clientAPI?._page?._definition?.getName?.()
  // alert(pagename)
    //if (clientAPI.getPageProxy()._page._definition.getName() == "NotificationDetailsPage") {
        if (pagename == "NotificationDetailsPage") {
       // if (clientAPI.getPageProxy().binding.OrderId == "") {
        if (clientAPI.getPageProxy().binding.WorkOrder==null) {
            //alert("Order id not available");
            return false;
        }
        else {
            return clientAPI.executeAction("/ZSAPAssetManager/Actions/JSPStatus/JspStatusNav.action").then((open) => {
                console.log(open);
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    else {



        /*let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WorkOrders/JSPSTATUS/Zmobilecmplt_Create.page');
        console.log(clientAPI);
        page.Controls[0].Sections[0].Controls.push({
            "_Type": "Control.Type.FormCell.Note",
            "_Name": "Description1",
            "MaxNumberOfLines": 6,
            "MinNumberOfLines": 4,
            "PlaceHolder": "MaxNoOfLines  6 & MinNoOfLines 4"
            })
            return clientAPI.executeAction({
                'Name': '/SAPAssetManager/Actions/Forms/NavFormPage.action',
                'Properties': {
                    'PageMetadata': page,
                    'PageToOpen': '/SAPAssetManager/Pages/Forms/Empty.page',
                    'ClearHistory': true,
                    'Transition': {
                        'Name': 'None',
                    },
                },
                'Type': 'Action.Type.Navigation',
            });*/
         return clientAPI.executeAction("/ZSAPAssetManager/Actions/JSPStatus/JspStatusNav.action").then((open) => {
             console.log(open);
         }).catch((error) => {
             console.log(error);
         })
    }
    // if(clientAPI.getPageProxy()._page._definition.getName()==="WorkOrderDetailsPage")
    // {
    //     return true;
    // }
    // else
    // {
    //     return false;
    // }

}

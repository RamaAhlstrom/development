

export default async function NoteCreateOnCommitWO(context) {
    let orderid=context.binding.WOHeader.OrderId;
    let notes=context.evaluateTargetPathForAPI('#Control:LongTextNote').getValue();
    let pro={Property: "WorkOrderHeader", Target: {EntitySet: "MyWorkOrderHeaders", QueryOptions: "", ReadLink: "MyWorkOrderHeaders('"+orderid+"')","uniqueIdType":""}}
    let url="MyWorkOrderHeaderLongTexts('"+orderid+"')";
      
    return context.read('/SAPAssetManager/Services/AssetManager.service', url, [], '').then(function(ModifiedEntityResults) {
        if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
            let obj=ModifiedEntityResults.getItem(0);
            return context.executeAction({
                 'Name': '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWO.action',
                 'Properties': {
                "_Type": "Action.Type.ODataService.UpdateEntity",
                "Target": {
                    "EntitySet": "MyWorkOrderHeaderLongTexts",
                    "Service": "/SAPAssetManager/Services/AssetManager.service",
                    "ReadLink": obj["@odata.readLink"]  
                },
                "Properties": {
                    "OrderId": obj.OrderId,
                    "NewTextString": "\n\n " +" "+notes+"",
                    "TextString": obj.TextString + '\n\n' + " " +""+notes+""
                },
                "Headers": {
                     "OfflineOData.TransactionID": obj.OrderId 
                },
                "OnSuccess": "",
                "OnFailure": "",
                "UpdateLinks": [pro],
                "ShowActivityIndicator": true,
                "ActivityIndicatorText" : "  "
            }}).then(()=>{
                console.log("Done");
                context.executeAction("/SAPAssetManager/Actions/Page/ClosePage.action")
            })
        }
        else
        {
            return context.executeAction(
                {
                    'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                    'Properties': {
                        'Title': context.localizeText("Create_Job_Safety_assessment1"),
                        'Message': "nothing",//"Operation Technical Object Manditory",//context.localizeText(message)
                        'OKCaption': context.localizeText('ok'),
                        'OnOK': '',
                    },
                },
            );
        }
       // return clientAPI.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
    }).catch((error) => {
        console.log(error);

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWO.action', //Create the timesheet record
            'Properties': {
                'Properties': {
                    "OrderId": orderid,
                    "NewTextString":  "\n\n  " +""+notes+"",
                    "TextString":  "\n\n  " +""+notes+""
                },
                'Headers': {
                    "OfflineOData.RemoveAfterUpload": "true",
                    "OfflineOData.TransactionID": orderid,
                },
                'CreateLinks': [{Property: "WorkOrderHeader", Target: {EntitySet: "MyWorkOrderHeaders", QueryOptions: "", ReadLink: "MyWorkOrderHeaders('"+orderid+"')","uniqueIdType":""}}],
                "OnSuccess": "",
        "OnFailure": ""
            }}).then(()=>{
                console.log("Done");
                context.executeAction("/SAPAssetManager/Actions/Page/ClosePage.action")
                
            })
        
        
    });
}

//import libPart from '../../PartLibrary';
import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';

export default function PartIssueCreateLineItemSuccess(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

   // return libPart.partIssueCreateLineItemSuccess(pageClientAPI);
    let ghy=true;
    let ghyi=""
    if(ghy)
    {
        let url="MyWorkOrderOperationLongTexts(OperationNo='"+pageClientAPI.binding.OperationNo+"',OrderId='"+pageClientAPI.binding.OrderId+"')";
        let url1="MyWorkOrderOperations(OperationNo='"+pageClientAPI.binding.OperationNo+"',OrderId='"+pageClientAPI.binding.OrderId+"')"; 
        let pro={Property: "WorkOrderOperation", Target: {EntitySet: "MyWorkOrderOperations", QueryOptions: "", ReadLink: url1,"uniqueIdType":""}}
        let context=pageClientAPI;
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', url, [], '').then(function(ModifiedEntityResults) {
            if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
                let obj=ModifiedEntityResults.getItem(0);
                return pageClientAPI.executeAction({
                     'Name': '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOOperation.action',
                     'Properties': {
                    "_Type": "Action.Type.ODataService.UpdateEntity",
                    "Target": {
                        "EntitySet": "MyWorkOrderOperationLongTexts",
                        "Service": "/SAPAssetManager/Services/AssetManager.service",
                        "ReadLink": obj["@odata.readLink"]  
                    },
                    "Properties": {
                        "OrderId":pageClientAPI.binding.OrderId,
						"OperationNo": pageClientAPI.binding.OperationNo,
                        "NewTextString": "\n\n Material num : " +""+pageClientAPI.binding.MaterialNum+" issued",
                        "TextString": obj.TextString + '\n\n' + "Material num: " +""+pageClientAPI.binding.MaterialNum+""
                    },
                    "Headers": {
                         "OfflineOData.TransactionID": pageClientAPI.binding.OrderId 
                    },
                    "OnSuccess": "",
                    "OnFailure": "",
                    "UpdateLinks": [pro],
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText" : "  "
                }}).then(causeResult => {
                  //  alert("update")
                    return libPart.partIssueCreateLineItemSuccess(pageClientAPI);
                    });
            }
            else
            {
                return pageClientAPI.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                        'Properties': {
                            'Title': "Something went wrong",
                            'Message': "nothing",//"Operation Technical Object Manditory",//context.localizeText(message)
                            'OKCaption': pageClientAPI.localizeText('ok'),
                            'OnOK': '',
                        },
                    },
                );
            }
           // return clientAPI.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
        }).catch((error) => {
            console.log(error); 
            //let context=clientAPI;
    return pageClientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOOperation.action',
        'Properties': {        
            "Target": {
                "EntitySet": "MyWorkOrderOperationLongTexts",
                "Service": "/SAPAssetManager/Services/AssetManager.service"
            },
            "Properties": {
                "OrderId": pageClientAPI.binding.OrderId,
                "OperationNo": pageClientAPI.binding.OperationNo,
                "NewTextString": "Material num : " +""+pageClientAPI.binding.MaterialNum+" issued",
                "TextString": "Material num : " +""+pageClientAPI.binding.MaterialNum+" issued"
            },
            "Headers": {
                "OfflineOData.RemoveAfterUpload": "true",
                "OfflineOData.TransactionID": pageClientAPI.binding.OrderId
            },
            "OnSuccess": "/SAPAssetManager/Rules/Notes/NoteCreateOnSuccess.js",
            "OnFailure": "/SAPAssetManager/Actions/Notes/NoteCreateFailureMessage.action",
            "CreateLinks":  [{
                                    'Property' : 'WorkOrderOperation',
                                    'Target':
                                    {
                                        'EntitySet' : 'MyWorkOrderOperations',
                                        'ReadLink' : url1,
                                    },
                                }]
         },
        }).then(causeResult => {
       // alert("Done");
        return libPart.partIssueCreateLineItemSuccess(pageClientAPI);
        });
    ////////////

           
            
            
        });
    }

}

import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function ZmobilecmpltCreate(context) {
    
    let binding = context.getBindingObject();
    let status = context.getBindingObject();
    let typen="update"; 
    let orderid;
    if(context.evaluateTargetPath("#Page:-Previous").context.binding["@odata.readLink"].includes("MyWorkOrderOperations"))
    {
        orderid=context.evaluateTargetPath("#Page:-Previous").context.binding.WOHeader.OrderId
    }
    else
    {
        orderid=context.evaluateTargetPath("#Page:-Previous").context.binding.OrderId

    }
    let pro={Property: "WorkOrderHeader", Target: {EntitySet: "MyWorkOrderHeaders", QueryOptions: "", ReadLink: "MyWorkOrderHeaders('"+orderid+"')","uniqueIdType":""}}
    let url="MyWorkOrderHeaderLongTexts('"+orderid+"')";
    //////////////////////////////////////new logic///////////////////////////////////////////
    
    let notes=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellNote0').getValue();
    let Q111=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl1').getValue();
   let Q21=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl2').getValue();
   let Q31=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl3').getValue();
   let Q41=context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FormCellSegmentedControl4').getValue();
   if (Q111.length==0 || Q21.length==0 || Q31.length==0 || Q41.length==0) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText("Create_Job_Safety_assessment1"),
                'Message': context.localizeText("Create_Job_Safety_assessment12"),//"Operation Technical Object Manditory",//context.localizeText(message)
                'OKCaption': context.localizeText('ok'),
                'OnOK': '',
            },
        },
    );
    
   } else {
    status="XX";
    // if (Q111[0].ReturnValue=="No" || Q21[0].ReturnValue=="No" || Q31[0].ReturnValue=="No" || Q41[0].ReturnValue=="No") {
    //     status="X";
    // }
    let No= context.localizeText('No');
    if (Q111[0].ReturnValue==No || Q21[0].ReturnValue==No || Q31[0].ReturnValue==No || Q41[0].ReturnValue==No) {
        status="X";
    }
    context.binding.statusre=status;

   // context.evaluateTargetPathForAPI('#Page:Zmobilecmplt_Create/#Control:FinalresultDescription').setValue(status);
    ///////////////////////////////////////
    let mydate=new Date().toISOString().split('.')[0].replace(/[^\d]/gi,'');
    console.log(mydate);
    return context.executeAction({
        'Name': '/ZSAPAssetManager/Actions/WorkOrders/JSPSTATUS/Zmobilecmplt_Create.action',
        'Properties':
        {
        "CreateLinks": [],
        "OnFailure": "/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action",
        "OnSuccess": "/ZSAPAssetManager/Actions/WorkOrders/JSPSTATUS/WorkOrderUpdate.action",
        "Properties": {
            "ZOrder": "/ZSAPAssetManager/Rules/WorkOrders/JSPSTATUS/Zmobilecmplt_Orderid.js",
            "ZLastChanged": mydate,
            "ZPlant": "/ZSAPAssetManager/Rules/WorkOrders/JSPSTATUS/Zmobilecmplt_Plant.js",
            "ZUserName": libCom.getSapUserName(context),
            "ZQNO1": Q111[0].ReturnValue,
            "ZQNO2": Q21[0].ReturnValue,
            "ZQNO3": Q31[0].ReturnValue,
            "ZQNO4": Q41[0].ReturnValue,
            "ZQNO5": "",
            "ZQNO6": "",
            "ZQNO7": "",
            "ZQNO8": "",
            "ZQNO9": "",
            "ZQNO10": "",
            "ZQNO11": "",
            "ZQNO12": "",
        },
        "Target": {
            "EntitySet": "ZJSARESPONSESet",
            "Service":"/SAPAssetManager/Services/AssetManager.service",
        },
        "ActionResult": {
            "_Name": "create"
        },
        "_Type": "Action.Type.ODataService.CreateEntity"
    }
    }).then(()=>{
        if (notes==undefined) {
console.log("No notes to post");

            
        } else {  
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
                        "NewTextString": "\n\n Take 2 Comments: " +""+notes+"",
                        "TextString": obj.TextString + '\n\n' + "Take 2 Comments: " +""+notes+""
                    },
                    "Headers": {
                         "OfflineOData.TransactionID": obj.OrderId 
                    },
                    "OnSuccess": "",
                    "OnFailure": "",
                    "UpdateLinks": [pro],
                    "ShowActivityIndicator": true,
                    "ActivityIndicatorText" : "  "
                }})
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
                        "NewTextString":  "\n\n Take 2 Comments : " +""+notes+"",
                        "TextString":  "\n\n Take 2 Comments : " +""+notes+""
                    },
                    'Headers': {
                        "OfflineOData.RemoveAfterUpload": "true",
                        "OfflineOData.TransactionID": orderid,
                    },
                    'CreateLinks': [{Property: "WorkOrderHeader", Target: {EntitySet: "MyWorkOrderHeaders", QueryOptions: "", ReadLink: "MyWorkOrderHeaders('"+orderid+"')","uniqueIdType":""}}],
                    "OnSuccess": "",
            "OnFailure": ""
                }})
            
            
        });

    }

    })

    
   }
   
}

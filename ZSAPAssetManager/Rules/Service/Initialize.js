export default function Initialize(context) {

    // Perform pre data initialization task

    // Initialize all your Data sources
    let _DEST_SAM2505_ONLINE_PPROP = context.executeAction('/ZSAPAssetManager/Actions/DEST_SAM2505_ONLINE_PPROP/Service/InitializeOffline.action');
    let _DEST_SAM2505_PPROP = context.executeAction('/ZSAPAssetManager/Actions/DEST_SAM2505_PPROP/Service/InitializeOffline.action');

    //You can add more service initialize actions here

    return Promise.all([_DEST_SAM2505_ONLINE_PPROP, _DEST_SAM2505_PPROP]).then(() => {
        // After Initializing the DB connections

        // Display successful initialization  message to the user
        return context.executeAction({

            "Name": "/ZSAPAssetManager/Actions/GenericToastMessage.action",
            "Properties": {
                "Message": "Application Services Initialized",
                "Animated": true,
                "Duration": 1,
                "IsIconHidden": true,
                "NumberOfLines": 1
            }
        });
    }).catch(() => {
        return false;
    });
}
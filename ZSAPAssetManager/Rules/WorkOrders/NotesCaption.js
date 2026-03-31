// export default function NotesCaption(context) {
//     try {
//         if(context.currentPage.id.includes("WorkOrderDetails"))
//         {
//             return context.localizeText("add_note1");
//         }
//         else
//         {
//             return context.localizeText("add_note");
//         }
        
//     } catch (error) {
        
//     }
// }



export default function NotesCaption(context) {
    try {
        if(context.currentPage.id.includes("WorkOrderDetails"))
        {
            return context.localizeText("add_note1");
        }
        else if(context.currentPage.id.includes("WorkOrderOperationDetails"))
        {
            return context.localizeText("add_note1_op");

        }
        else if(context.currentPage.id.includes("PartDetailsPage"))
        {
            return context.localizeText("add_note1_part");
        }
        else if(context.currentPage.id.includes("NotificationDetailsPage"))
        {
            return context.localizeText("add_note_notification");
        }
        else
        {
            return context.localizeText("add_note");
        }
        
    } catch (error) {
        
    }
}

// export default function BOMMaterialPicketItems(context) {
//     let jsonResult = [];
//     let desc = '';
//     if (context.binding.MaterialDesc) {
//         desc = context.binding.MaterialDesc + ' (' + context.binding.MaterialNum + ')';
//     }
//     jsonResult.push(
//     {
//         'DisplayValue': `${desc}`,
//         'ReturnValue': `${context.binding.MaterialNum}`,
//     });
//     return jsonResult;
// }

export default async function BOMMaterialPicketItems(context) {
    let jsonResult = [];
    let desc = '';
    let qundes="";
    let Manditoryinfo=await CheckQuantity(context);
    if(Manditoryinfo!=undefined)
        {
             qundes=context.localizeText('available_qty_x_x', [Manditoryinfo.UnrestrictedQuantity, Manditoryinfo.Material.BaseUOM])
        }
    //$(L,available_qty_x_x, {{#Property:UnrestrictedQuantity}},{{#Property:Material/#Property:BaseUOM}})
    //let qundes=context.localizeText('available_qty_x_x', [context.binding.Quantity, context.binding.UoM])
    //desc=qundes+"  ";
    if (context.binding.MaterialDesc) {
        desc = context.binding.MaterialDesc + ' (' + context.binding.MaterialNum + ') \n'+qundes;
    }
    jsonResult.push(
    {
        'DisplayValue': `${desc}`,
        'ReturnValue': `${context.binding.MaterialNum}`,
    });
    return jsonResult;
}
function CheckQuantity(context) {
    let filter = '';
    filter = "$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=MaterialNum eq '"+context.binding.MaterialNum+"'";
    //alert(filter);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', [], filter).then(result => {
        if (result.length > 0) {
           // alert(JSON.stringify(JSON.stringify(result.getItem(0))));
            return result.getItem(0);
        }
        return undefined;
    });
}
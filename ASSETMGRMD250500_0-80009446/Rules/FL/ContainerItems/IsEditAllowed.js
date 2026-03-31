import { ContainerItemStatus } from '../Common/FLLibrary';
export default function IsEditAllowed(clientAPI) {
    const icon = "$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png,'',/SAPAssetManager/Images/edit-accessory.ios.png)";
    return (clientAPI.binding.VoyageUUID && clientAPI.binding.ContainerItemStatus === ContainerItemStatus.Dispatched || clientAPI.binding.ContainerItemStatus === ContainerItemStatus.Received || clientAPI.binding.ContainerItemStatus === ContainerItemStatus.NotFound)? '' : icon;
}

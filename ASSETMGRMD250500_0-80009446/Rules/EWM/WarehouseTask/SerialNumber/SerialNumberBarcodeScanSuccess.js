import { GetSerialNumberMap, UpdateControls, GetSerialNumberCount, GetSelectedCount } from './SerialNumberLib';
/**
* This function calls the barcode scan action until as many serial numbers are scanned as per the quantity entered
* @param {IClientAPI} context
*/
export default function SerialNumberBarcodeScanSuccess(context) {
  const actionResult = context.getActionResult('BarcodeScanner');
  if (!actionResult) {
    return '';
  }
  const serialNumbers = GetSerialNumberMap(context);
  const scanSerialNumber = actionResult.data;

  if (scanSerialNumber) {
    // locate in the map
    const serialNumber = serialNumbers.find((item) => item.entry.SerialNumber === String(scanSerialNumber));

    if (serialNumber) {
      if (serialNumber.selected) {
        context.binding.ScanResultMessage = context.localizeText('already_scanned');
      } else {
        serialNumber.selected = true;
      }
    } else {
      context.binding.ScanResultMessage = context.localizeText('scan_serno_not_listed_x', [scanSerialNumber]);
    }
  } else {
    context.binding.ScanResultMessage = context.localizeText('scan_failed');
  }
  if (context.binding.ScanResultMessage) {
    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberScanFailed.action').then(() => {
      context.binding.ScanResultMessage = undefined;
      return;
    });
  }
  UpdateControls(context, serialNumbers);

  context.binding.ScanResultMessage = context.localizeText('scan_msg', [GetSelectedCount(serialNumbers), GetSerialNumberCount(context)]);
  return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberScanSuccess.action').then(() => {
    context.binding.ScanResultMessage = undefined;
    return;
  });
}

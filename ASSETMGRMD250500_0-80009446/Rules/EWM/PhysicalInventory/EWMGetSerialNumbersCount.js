export default function EWMGetSerialNumbersCount(context) {
    const sernumqty = context.binding?.length || 0;
    return context.localizeText('ewm_serial_serial_numbers_x', [sernumqty]);
}

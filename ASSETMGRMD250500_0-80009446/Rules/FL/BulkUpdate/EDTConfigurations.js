import DeviceType from '../../Common/DeviceType';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
// Following configurations have been tested in several simulators for iOS and Android of different screen sizes and resolutions.
export default function EDTColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                sloc: 90,
                hdec: 230,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                sloc: 220,
                hdec: 320,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                sloc: 90,
                hdec: 190,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                sloc: 220,
                hdec: 320,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}

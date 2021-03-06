import { FontStyle, FontWeight } from '@src/model/Font';
import { Environment } from '@src/Environment';
/**
 * This public class stores text widths for several fonts and allows width calculation
 * @partial
 */
export class FontSizes {
    /**
     * @target web
     * @partial
     */
    static generateFontLookup(family) {
        if (FontSizes.FontSizeLookupTables.has(family)) {
            return;
        }
        if (!Environment.isRunningInWorker) {
            let canvas = document.createElement('canvas');
            let measureContext = canvas.getContext('2d');
            measureContext.font = `11px ${family}`;
            let sizes = [];
            for (let i = 0x20; i < 255; i++) {
                let s = String.fromCharCode(i);
                sizes.push(measureContext.measureText(s).width);
            }
            let data = new Uint8Array(sizes);
            FontSizes.FontSizeLookupTables.set(family, data);
        }
        else {
            FontSizes.FontSizeLookupTables.set(family, new Uint8Array([8]));
        }
    }
    static measureString(s, family, size, style, weight) {
        let data;
        let dataSize = 11;
        if (!FontSizes.FontSizeLookupTables.has(family)) {
            FontSizes.generateFontLookup(family);
        }
        data = FontSizes.FontSizeLookupTables.get(family);
        let factor = 1;
        if (style === FontStyle.Italic) {
            factor *= 1.2;
        }
        if (weight === FontWeight.Bold) {
            factor *= 1.2;
        }
        let stringSize = 0;
        for (let i = 0; i < s.length; i++) {
            let code = Math.min(data.length - 1, s.charCodeAt(i) - 32);
            if (code >= 0) {
                stringSize += (data[code] * size) / dataSize;
            }
        }
        return stringSize * factor;
    }
}
// prettier-ignore
FontSizes.Georgia = new Uint8Array([
    3, 4, 5, 7, 7, 9, 8, 2, 4, 4, 5, 7, 3, 4, 3, 5, 7, 5, 6, 6, 6, 6, 6, 6, 7, 6, 3, 3, 7,
    7, 7, 5, 10, 7, 7, 7, 8, 7, 7, 8, 9, 4, 6, 8, 7, 10, 8, 8, 7, 8, 8, 6, 7, 8, 7, 11, 8,
    7, 7, 4, 5, 4, 7, 7, 6, 6, 6, 5, 6, 5, 4, 6, 6, 3, 3, 6, 3, 10, 6, 6, 6, 6, 5, 5, 4, 6,
    5, 8, 6, 5, 5, 5, 4, 5, 7, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3, 4, 6, 7, 6, 7, 4, 6, 6, 10, 6, 6, 7, 0, 10, 7,
    5, 7, 6, 6, 6, 6, 6, 3, 6, 6, 6, 6, 12, 12, 12, 5, 7, 7, 7, 7, 7, 7, 11, 7, 7, 7, 7, 7,
    4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 7, 7, 6, 6, 6, 6, 6, 6, 6, 8, 5, 5,
    5, 5, 5, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 6
]);
// prettier-ignore
FontSizes.Arial = new Uint8Array([
    3, 3, 4, 6, 6, 10, 7, 2, 4, 4, 4, 6, 3, 4, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 3, 6,
    6, 6, 6, 11, 7, 7, 8, 8, 7, 7, 9, 8, 3, 6, 7, 6, 9, 8, 9, 7, 9, 8, 7, 7, 8, 7, 10, 7, 7,
    7, 3, 3, 3, 5, 6, 4, 6, 6, 6, 6, 6, 3, 6, 6, 2, 2, 6, 2, 9, 6, 6, 6, 6, 4, 6, 3, 6, 6,
    8, 6, 6, 6, 4, 3, 4, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 6, 6, 6, 6, 3, 6, 4, 8, 4, 6, 6, 0, 8, 6, 4,
    6, 4, 4, 4, 6, 6, 4, 4, 4, 4, 6, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7, 11, 8, 7, 7, 7, 7, 3, 3,
    3, 3, 8, 8, 9, 9, 9, 9, 9, 6, 9, 8, 8, 8, 8, 7, 7, 7, 6, 6, 6, 6, 6, 6, 10, 6, 6, 6, 6,
    6, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6
]);
FontSizes.FontSizeLookupTables = new Map([
    ['Arial', FontSizes.Arial],
    ["'Arial'", FontSizes.Arial],
    ['"Arial"', FontSizes.Arial],
    ['Georgia', FontSizes.Georgia],
    ["'Georgia'", FontSizes.Georgia],
    ['"Georgia"', FontSizes.Georgia]
]);
FontSizes.ControlChars = 0x20;
//# sourceMappingURL=FontSizes.js.map
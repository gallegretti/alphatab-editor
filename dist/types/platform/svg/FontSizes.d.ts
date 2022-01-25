import { FontStyle, FontWeight } from '@src/model/Font';
/**
 * This public class stores text widths for several fonts and allows width calculation
 * @partial
 */
export declare class FontSizes {
    static Georgia: Uint8Array;
    static Arial: Uint8Array;
    static FontSizeLookupTables: Map<string, Uint8Array>;
    static readonly ControlChars: number;
    /**
     * @target web
     * @partial
     */
    static generateFontLookup(family: string): void;
    static measureString(s: string, family: string, size: number, style: FontStyle, weight: FontWeight): number;
}

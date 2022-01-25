import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class DigitGlyph extends MusicFontGlyph {
    private _digit;
    private _scale;
    constructor(x: number, y: number, digit: number, scale: number);
    doLayout(): void;
    private getDigitWidth;
    private static getSymbol;
}

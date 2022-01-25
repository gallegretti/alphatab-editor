import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class DiamondNoteHeadGlyph extends MusicFontGlyph {
    private _isGrace;
    constructor(x: number, y: number, duration: Duration, isGrace: boolean);
    private static getSymbol;
    doLayout(): void;
}

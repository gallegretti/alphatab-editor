import { AccidentalType } from '@src/model/AccidentalType';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class AccidentalGlyph extends MusicFontGlyph {
    private _isGrace;
    private _accidentalType;
    constructor(x: number, y: number, accidentalType: AccidentalType, isGrace?: boolean);
    private static getMusicSymbol;
    doLayout(): void;
}

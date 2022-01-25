import { DynamicValue } from '@src/model/DynamicValue';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class DynamicsGlyph extends MusicFontGlyph {
    constructor(x: number, y: number, dynamics: DynamicValue);
    doLayout(): void;
    private static getSymbol;
}

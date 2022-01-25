import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class TremoloPickingGlyph extends MusicFontGlyph {
    constructor(x: number, y: number, duration: Duration);
    doLayout(): void;
    private static getSymbol;
}

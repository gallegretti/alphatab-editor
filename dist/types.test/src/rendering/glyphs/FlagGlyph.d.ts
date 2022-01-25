import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class FlagGlyph extends MusicFontGlyph {
    static readonly FlagWidth: number;
    constructor(x: number, y: number, duration: Duration, direction: BeamDirection, isGrace: boolean);
    doLayout(): void;
    private static getSymbol;
}

import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
export declare class ScoreRestGlyph extends MusicFontGlyph {
    private _duration;
    beamingHelper: BeamingHelper;
    constructor(x: number, y: number, duration: Duration);
    static getSymbol(duration: Duration): MusicFontSymbol;
    static getSize(duration: Duration): number;
    doLayout(): void;
    updateBeamingHelper(cx: number): void;
}

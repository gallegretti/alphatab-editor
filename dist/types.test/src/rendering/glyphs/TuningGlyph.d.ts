import { Tuning } from '@src/model/Tuning';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export declare class TuningGlyph extends GlyphGroup {
    private _tuning;
    private _trackLabel;
    constructor(x: number, y: number, tuning: Tuning, trackLabel: string);
    doLayout(): void;
    /**
     * The height of the GuitarString# glyphs at scale 1
     */
    private static readonly CircleNumberHeight;
    private createGlyphs;
}

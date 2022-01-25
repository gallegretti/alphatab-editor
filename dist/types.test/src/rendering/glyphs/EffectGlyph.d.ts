import { Beat } from '@src/model/Beat';
import { Glyph } from '@src/rendering/glyphs/Glyph';
/**
 * Effect-Glyphs implementing this public interface get notified
 * as they are expanded over multiple beats.
 */
export declare class EffectGlyph extends Glyph {
    /**
     * Gets or sets the beat where the glyph belongs to.
     */
    beat: Beat | null;
    /**
     * Gets or sets the next glyph of the same type in case
     * the effect glyph is expanded when using {@link EffectBarGlyphSizing.groupedOnBeat}.
     */
    nextGlyph: EffectGlyph | null;
    /**
     * Gets or sets the previous glyph of the same type in case
     * the effect glyph is expanded when using {@link EffectBarGlyphSizing.groupedOnBeat}.
     */
    previousGlyph: EffectGlyph | null;
    constructor(x?: number, y?: number);
}

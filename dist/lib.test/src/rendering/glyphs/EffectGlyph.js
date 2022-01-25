import { Glyph } from '@src/rendering/glyphs/Glyph';
/**
 * Effect-Glyphs implementing this public interface get notified
 * as they are expanded over multiple beats.
 */
export class EffectGlyph extends Glyph {
    constructor(x = 0, y = 0) {
        super(x, y);
        /**
         * Gets or sets the beat where the glyph belongs to.
         */
        this.beat = null;
        /**
         * Gets or sets the next glyph of the same type in case
         * the effect glyph is expanded when using {@link EffectBarGlyphSizing.groupedOnBeat}.
         */
        this.nextGlyph = null;
        /**
         * Gets or sets the previous glyph of the same type in case
         * the effect glyph is expanded when using {@link EffectBarGlyphSizing.groupedOnBeat}.
         */
        this.previousGlyph = null;
    }
}
//# sourceMappingURL=EffectGlyph.js.map
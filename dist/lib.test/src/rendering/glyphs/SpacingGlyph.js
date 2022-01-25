import { Glyph } from '@src/rendering/glyphs/Glyph';
/**
 * This simple glyph allows to put an empty region in to a BarRenderer.
 */
export class SpacingGlyph extends Glyph {
    constructor(x, y, width) {
        super(x, y);
        this.width = width;
    }
}
//# sourceMappingURL=SpacingGlyph.js.map
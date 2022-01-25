import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export class LeftToRightLayoutingGlyphGroup extends GlyphGroup {
    constructor() {
        super(0, 0);
        this.glyphs = [];
    }
    addGlyph(g) {
        g.x =
            this.glyphs.length === 0
                ? 0
                : this.glyphs[this.glyphs.length - 1].x + this.glyphs[this.glyphs.length - 1].width;
        g.renderer = this.renderer;
        g.doLayout();
        this.width = g.x + g.width;
        super.addGlyph(g);
    }
}
//# sourceMappingURL=LeftToRightLayoutingGlyphGroup.js.map
import { Glyph } from '@src/rendering/glyphs/Glyph';
/**
 * This glyph allows to group several other glyphs to be
 * drawn at the same x position
 */
export class GlyphGroup extends Glyph {
    constructor(x, y) {
        super(x, y);
        this.glyphs = null;
    }
    get isEmpty() {
        return !this.glyphs || this.glyphs.length === 0;
    }
    doLayout() {
        if (!this.glyphs || this.glyphs.length === 0) {
            this.width = 0;
            return;
        }
        let w = 0;
        for (let i = 0, j = this.glyphs.length; i < j; i++) {
            let g = this.glyphs[i];
            g.renderer = this.renderer;
            g.doLayout();
            w = Math.max(w, g.width);
        }
        this.width = w;
    }
    addGlyph(g) {
        if (!this.glyphs) {
            this.glyphs = [];
        }
        if (this.renderer) {
            g.renderer = this.renderer;
        }
        this.glyphs.push(g);
    }
    paint(cx, cy, canvas) {
        let glyphs = this.glyphs;
        if (!glyphs || glyphs.length === 0) {
            return;
        }
        for (let g of glyphs) {
            g.paint(cx + this.x, cy + this.y, canvas);
        }
    }
}
//# sourceMappingURL=GlyphGroup.js.map
/**
 * A glyph is a single symbol which can be added to a GlyphBarRenderer for automated
 * layouting and drawing of stacked symbols.
 */
export class Glyph {
    constructor(x, y) {
        this.width = 0;
        this.height = 0;
        this.x = x;
        this.y = y;
    }
    get scale() {
        return this.renderer.scale;
    }
    doLayout() {
        // to be implemented in subclass
    }
    paint(cx, cy, canvas) {
        // to be implemented in subclass
    }
}
//# sourceMappingURL=Glyph.js.map
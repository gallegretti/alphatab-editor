import { TextAlign } from '@src/platform/ICanvas';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export class RowGlyphContainer extends GlyphGroup {
    constructor(x, y, align = TextAlign.Center) {
        super(x, y);
        this._glyphWidth = 0;
        this.glyphs = [];
        this._align = align;
    }
    doLayout() {
        let x = 0;
        switch (this._align) {
            case TextAlign.Left:
                x = 0;
                break;
            case TextAlign.Center:
                x = (this.width - this._glyphWidth) / 2;
                break;
            case TextAlign.Right:
                x = this.width - this._glyphWidth;
                break;
        }
        for (let glyph of this.glyphs) {
            glyph.x = x;
            x += glyph.width;
        }
    }
    addGlyphToRow(glyph) {
        this.glyphs.push(glyph);
        this._glyphWidth += glyph.width;
        if (glyph.height > this.height) {
            this.height = glyph.height;
        }
    }
}
//# sourceMappingURL=RowGlyphContainer.js.map
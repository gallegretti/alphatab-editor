import { DigitGlyph } from '@src/rendering/glyphs/DigitGlyph';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export class NumberGlyph extends GlyphGroup {
    constructor(x, y, num, scale = 1.0) {
        super(x, y);
        this._number = 0;
        this._scale = 0;
        this._number = num;
        this._scale = scale;
    }
    doLayout() {
        let i = this._number;
        while (i > 0) {
            let num = i % 10;
            let gl = new DigitGlyph(0, 0, num, this._scale);
            this.addGlyph(gl);
            i = (i / 10) | 0;
        }
        if (this.glyphs) {
            this.glyphs.reverse();
            let cx = 0;
            for (let j = 0, k = this.glyphs.length; j < k; j++) {
                let g = this.glyphs[j];
                g.x = cx;
                g.y = 0;
                g.renderer = this.renderer;
                g.doLayout();
                cx += g.width;
            }
            this.width = cx;
        }
    }
}
NumberGlyph.numberHeight = 18;
//# sourceMappingURL=NumberGlyph.js.map
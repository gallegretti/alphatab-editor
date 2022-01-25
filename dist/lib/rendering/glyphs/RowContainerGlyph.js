import { TextAlign } from '@src/platform/ICanvas';
import { RowGlyphContainer } from '@src/rendering/glyphs/RowGlyphContainer';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export class RowContainerGlyph extends GlyphGroup {
    constructor(x, y, align = TextAlign.Center) {
        super(x, y);
        this._rows = [];
        this.height = 0.0;
        this.glyphs = [];
        this._align = align;
    }
    doLayout() {
        let x = 0;
        let y = 0;
        let padding = 2 * RowContainerGlyph.Padding * this.scale;
        this._rows = [];
        let row = new RowGlyphContainer(x, y, this._align);
        row.width = this.width;
        for (let g of this.glyphs) {
            if (x + g.width < this.width) {
                row.addGlyphToRow(g);
                x += g.width;
            }
            else {
                if (!row.isEmpty) {
                    row.doLayout();
                    this._rows.push(row);
                    y += row.height + padding;
                }
                x = 0;
                row = new RowGlyphContainer(x, y, this._align);
                row.width = this.width;
                row.addGlyphToRow(g);
                x += g.width;
            }
        }
        if (!row.isEmpty) {
            row.doLayout();
            this._rows.push(row);
            y += row.height + padding;
        }
        this.height = y + padding;
    }
    paint(cx, cy, canvas) {
        for (let row of this._rows) {
            row.paint(cx + this.x, cy + this.y + RowContainerGlyph.Padding * this.scale, canvas);
        }
    }
}
RowContainerGlyph.Padding = 3;
//# sourceMappingURL=RowContainerGlyph.js.map
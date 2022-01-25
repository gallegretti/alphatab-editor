import { Glyph } from '@src/rendering/glyphs/Glyph';
export class CircleGlyph extends Glyph {
    constructor(x, y, size) {
        super(x, y);
        this._size = 0;
        this._size = size;
    }
    doLayout() {
        this.width = this._size + 3 * this.scale;
    }
    paint(cx, cy, canvas) {
        canvas.fillCircle(cx + this.x, cy + this.y, this._size);
    }
}
//# sourceMappingURL=CircleGlyph.js.map
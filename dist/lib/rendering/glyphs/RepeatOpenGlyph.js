import { Glyph } from '@src/rendering/glyphs/Glyph';
export class RepeatOpenGlyph extends Glyph {
    constructor(x, y, circleSize, dotOffset) {
        super(x, y);
        this._dotOffset = 0;
        this._circleSize = 0;
        this._dotOffset = 0.0;
        this._circleSize = 0.0;
        this._dotOffset = dotOffset;
        this._circleSize = circleSize;
    }
    doLayout() {
        this.width = 13 * this.scale;
    }
    paint(cx, cy, canvas) {
        let blockWidth = 4 * this.scale;
        let top = cy + this.y + this.renderer.topPadding;
        let bottom = cy + this.y + this.renderer.height - this.renderer.bottomPadding;
        let left = cx + this.x + 0.5;
        // big bar
        let h = bottom - top;
        canvas.fillRect(left, top, blockWidth, h);
        // line
        left += blockWidth * 2 - 0.5;
        canvas.beginPath();
        canvas.moveTo(left, top);
        canvas.lineTo(left, bottom);
        canvas.stroke();
        // circles
        left += 3 * this.scale;
        let circleSize = this._circleSize * this.scale;
        let middle = (top + bottom) / 2;
        canvas.fillCircle(left, middle - circleSize * this._dotOffset, circleSize);
        canvas.fillCircle(left, middle + circleSize * this._dotOffset, circleSize);
    }
}
//# sourceMappingURL=RepeatOpenGlyph.js.map
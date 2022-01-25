import { Glyph } from '@src/rendering/glyphs/Glyph';
export class RepeatCloseGlyph extends Glyph {
    constructor(x, y) {
        super(x, y);
    }
    doLayout() {
        this.width = 11 * this.scale;
    }
    paint(cx, cy, canvas) {
        let blockWidth = 4 * this.scale;
        let top = cy + this.y + this.renderer.topPadding;
        let bottom = cy + this.y + this.renderer.height - this.renderer.bottomPadding;
        let left = cx + this.x;
        let h = bottom - top;
        // circles
        let circleSize = 1.5 * this.scale;
        let middle = (top + bottom) / 2;
        let dotOffset = 3;
        canvas.fillCircle(left, middle - circleSize * dotOffset, circleSize);
        canvas.fillCircle(left, middle + circleSize * dotOffset, circleSize);
        // line
        left += 4 * this.scale;
        canvas.beginPath();
        canvas.moveTo(left, top);
        canvas.lineTo(left, bottom);
        canvas.stroke();
        // big bar
        left += 3 * this.scale + 0.5;
        canvas.fillRect(left, top, blockWidth, h);
    }
}
//# sourceMappingURL=RepeatCloseGlyph.js.map
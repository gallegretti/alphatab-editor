import { Glyph } from '@src/rendering/glyphs/Glyph';
export class BarNumberGlyph extends Glyph {
    constructor(x, y, num) {
        super(x, y);
        this._number = 0;
        this._number = num;
    }
    doLayout() {
        this.renderer.scoreRenderer.canvas.font = this.renderer.resources.barNumberFont;
        this.width = this.renderer.scoreRenderer.canvas.measureText(this._number.toString()) + 5 * this.scale;
    }
    paint(cx, cy, canvas) {
        if (!this.renderer.staff.isFirstInAccolade) {
            return;
        }
        let res = this.renderer.resources;
        let c = canvas.color;
        canvas.color = res.barNumberColor;
        canvas.font = res.barNumberFont;
        canvas.fillText(this._number.toString(), cx + this.x, cy + this.y);
        canvas.color = c;
    }
}
//# sourceMappingURL=BarNumberGlyph.js.map
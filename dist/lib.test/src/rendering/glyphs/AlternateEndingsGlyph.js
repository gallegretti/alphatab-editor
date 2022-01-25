import { TextBaseline } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MasterBar } from '@src/model/MasterBar';
export class AlternateEndingsGlyph extends EffectGlyph {
    constructor(x, y, alternateEndings) {
        super(x, y);
        this._endingsString = "";
        this._endings = [];
        for (let i = 0; i < MasterBar.MaxAlternateEndings; i++) {
            if ((alternateEndings & (0x01 << i)) !== 0) {
                this._endings.push(i);
            }
        }
    }
    doLayout() {
        super.doLayout();
        this.height = this.renderer.resources.wordsFont.size + (AlternateEndingsGlyph.Padding * this.scale + 2);
        let endingsStrings = '';
        for (let i = 0, j = this._endings.length; i < j; i++) {
            endingsStrings += this._endings[i] + 1;
            endingsStrings += '. ';
        }
        this._endingsString = endingsStrings;
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy, canvas);
        let baseline = canvas.textBaseline;
        canvas.textBaseline = TextBaseline.Top;
        if (this._endings.length > 0) {
            let res = this.renderer.resources;
            canvas.font = res.wordsFont;
            canvas.moveTo(cx + this.x, cy + this.y + this.height);
            canvas.lineTo(cx + this.x, cy + this.y);
            canvas.lineTo(cx + this.x + this.width, cy + this.y);
            canvas.stroke();
            canvas.fillText(this._endingsString, cx + this.x + AlternateEndingsGlyph.Padding * this.scale, cy + this.y * this.scale);
        }
        canvas.textBaseline = baseline;
    }
}
AlternateEndingsGlyph.Padding = 3;
//# sourceMappingURL=AlternateEndingsGlyph.js.map
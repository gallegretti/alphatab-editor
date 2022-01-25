import { TextAlign } from '@src/platform/ICanvas';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export class LineRangedGlyph extends GroupedEffectGlyph {
    constructor(label) {
        super(BeatXPosition.OnNotes);
        this._label = label;
    }
    doLayout() {
        if (this.renderer.settings.notation.extendLineEffectsToBeatEnd) {
            this.endPosition = BeatXPosition.EndBeat;
            this.forceGroupedRendering = true;
        }
        super.doLayout();
        this.height = this.renderer.resources.effectFont.size;
    }
    paintNonGrouped(cx, cy, canvas) {
        let res = this.renderer.resources;
        canvas.font = res.effectFont;
        let x = canvas.textAlign;
        canvas.textAlign = TextAlign.Center;
        canvas.fillText(this._label, cx + this.x, cy + this.y);
        canvas.textAlign = x;
    }
    paintGrouped(cx, cy, endX, canvas) {
        this.paintNonGrouped(cx, cy, canvas);
        let lineSpacing = 3 * this.scale;
        let textWidth = canvas.measureText(this._label);
        let startX = cx + this.x + textWidth / 2 + lineSpacing;
        let lineY = cy + this.y + 4 * this.scale;
        let lineSize = 8 * this.scale;
        if (endX > startX) {
            let lineX = startX;
            while (lineX < endX) {
                canvas.beginPath();
                canvas.moveTo(lineX, lineY | 0);
                canvas.lineTo(Math.min(lineX + lineSize, endX), lineY | 0);
                lineX += lineSize + lineSpacing;
                canvas.stroke();
            }
            canvas.beginPath();
            canvas.moveTo(endX, (lineY - 5 * this.scale) | 0);
            canvas.lineTo(endX, (lineY + 5 * this.scale) | 0);
            canvas.stroke();
        }
    }
}
LineRangedGlyph.LineSpacing = 3;
LineRangedGlyph.LineTopPadding = 4;
LineRangedGlyph.LineTopOffset = 5;
LineRangedGlyph.LineSize = 8;
//# sourceMappingURL=LineRangedGlyph.js.map
import { BrushType } from '@src/model/BrushType';
import { VibratoType } from '@src/model/VibratoType';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NoteVibratoGlyph } from '@src/rendering/glyphs/NoteVibratoGlyph';
import { NoteYPosition } from '../BarRendererBase';
export class ScoreBrushGlyph extends Glyph {
    constructor(beat) {
        super(0, 0);
        this._beat = beat;
    }
    doLayout() {
        this.width = 10 * this.scale;
    }
    paint(cx, cy, canvas) {
        let scoreBarRenderer = this.renderer;
        let lineSize = scoreBarRenderer.lineOffset;
        let startY = cy + this.y + (scoreBarRenderer.getNoteY(this._beat.maxNote, NoteYPosition.Bottom) - lineSize);
        let endY = cy + this.y + scoreBarRenderer.getNoteY(this._beat.minNote, NoteYPosition.Top) + lineSize;
        let arrowX = cx + this.x + this.width / 2;
        let arrowSize = 8 * this.scale;
        if (this._beat.brushType !== BrushType.None) {
            let glyph = new NoteVibratoGlyph(0, 0, VibratoType.Slight, 1.2, true);
            glyph.renderer = this.renderer;
            glyph.doLayout();
            let waveOffset = -glyph.height / 2;
            if (this._beat.brushType === BrushType.ArpeggioUp) {
                let lineStartY = startY + arrowSize;
                let lineEndY = endY - arrowSize;
                glyph.width = Math.abs(lineEndY - lineStartY);
                canvas.beginRotate(cx + this.x + 5 * this.scale, lineEndY, -90);
                glyph.paint(0, waveOffset, canvas);
                canvas.endRotate();
                canvas.beginPath();
                canvas.moveTo(arrowX, endY);
                canvas.lineTo(arrowX + arrowSize / 2, endY - arrowSize);
                canvas.lineTo(arrowX - arrowSize / 2, endY - arrowSize);
                canvas.closePath();
                canvas.fill();
            }
            else if (this._beat.brushType === BrushType.ArpeggioDown) {
                let lineStartY = startY + arrowSize;
                let lineEndY = endY;
                glyph.width = Math.abs(lineEndY - lineStartY);
                canvas.beginRotate(cx + this.x + 5 * this.scale, lineStartY, 90);
                glyph.paint(0, waveOffset, canvas);
                canvas.endRotate();
                canvas.beginPath();
                canvas.moveTo(arrowX, startY);
                canvas.lineTo(arrowX + arrowSize / 2, startY + arrowSize);
                canvas.lineTo(arrowX - arrowSize / 2, startY + arrowSize);
                canvas.closePath();
                canvas.fill();
            }
        }
    }
}
//# sourceMappingURL=ScoreBrushGlyph.js.map
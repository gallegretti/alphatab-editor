import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { VibratoType } from '@src/model/VibratoType';
import { NoteXPosition, NoteYPosition } from '@src/rendering/BarRendererBase';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NoteVibratoGlyph } from '@src/rendering/glyphs/NoteVibratoGlyph';
export class ScoreSlideLineGlyph extends Glyph {
    constructor(inType, outType, startNote, parent) {
        super(0, 0);
        this._outType = outType;
        this._inType = inType;
        this._startNote = startNote;
        this._parent = parent;
    }
    doLayout() {
        this.width = 0;
    }
    paint(cx, cy, canvas) {
        this.paintSlideIn(cx, cy, canvas);
        this.drawSlideOut(cx, cy, canvas);
    }
    paintSlideIn(cx, cy, canvas) {
        let startNoteRenderer = this.renderer;
        let sizeX = 12 * this.scale;
        let endX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Left) - 2 * this.scale;
        let endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
        let startX = endX - sizeX;
        let startY = cy + startNoteRenderer.y;
        switch (this._inType) {
            case SlideInType.IntoFromBelow:
                startY += startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Bottom);
                break;
            case SlideInType.IntoFromAbove:
                startY += startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Top);
                break;
            default:
                return;
        }
        let accidentalsWidth = this.getAccidentalsWidth(startNoteRenderer, this._startNote.beat);
        startX -= accidentalsWidth;
        endX -= accidentalsWidth;
        this.paintSlideLine(canvas, false, startX, endX, startY, endY);
    }
    getAccidentalsWidth(renderer, beat) {
        let preNotes = renderer.getPreNotesGlyphForBeat(beat);
        if (preNotes && preNotes.accidentals) {
            return preNotes.accidentals.width;
        }
        return 0;
    }
    drawSlideOut(cx, cy, canvas) {
        let startNoteRenderer = this.renderer;
        let sizeX = 12 * this.scale;
        let startOffsetX = 3 * this.scale;
        let endOffsetX = 1 * this.scale;
        let offsetY = 2 * this.scale;
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let waves = false;
        switch (this._outType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                startX =
                    cx +
                        startNoteRenderer.x +
                        startNoteRenderer.getBeatX(this._startNote.beat, BeatXPosition.PostNotes) +
                        startOffsetX;
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                if (this._startNote.slideTarget) {
                    let endNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, this._startNote.slideTarget.beat.voice.bar);
                    if (!endNoteRenderer || endNoteRenderer.staff !== startNoteRenderer.staff) {
                        endX = cx + startNoteRenderer.x + this._parent.x;
                        endY = startY;
                    }
                    else {
                        endX =
                            cx +
                                endNoteRenderer.x +
                                endNoteRenderer.getBeatX(this._startNote.slideTarget.beat, BeatXPosition.PreNotes) -
                                endOffsetX;
                        endY = cy + endNoteRenderer.y + endNoteRenderer.getNoteY(this._startNote.slideTarget, NoteYPosition.Center);
                    }
                    if (this._startNote.slideTarget.realValue > this._startNote.realValue) {
                        startY += offsetY;
                        endY -= offsetY;
                    }
                    else {
                        startY -= offsetY;
                        endY += offsetY;
                    }
                }
                else {
                    endX = cx + startNoteRenderer.x + this._parent.x;
                    endY = startY;
                }
                break;
            case SlideOutType.OutUp:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endX = startX + sizeX;
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Top);
                break;
            case SlideOutType.OutDown:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endX = startX + sizeX;
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Bottom);
                break;
            case SlideOutType.PickSlideUp:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right) + startOffsetX;
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Top);
                endX = cx + startNoteRenderer.x + startNoteRenderer.width;
                if (this._startNote.beat.nextBeat &&
                    this._startNote.beat.nextBeat.voice === this._startNote.beat.voice) {
                    endX =
                        cx +
                            startNoteRenderer.x +
                            startNoteRenderer.getBeatX(this._startNote.beat.nextBeat, BeatXPosition.PreNotes);
                }
                waves = true;
                break;
            case SlideOutType.PickSlideDown:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right) + startOffsetX;
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Bottom);
                endX = cx + startNoteRenderer.x + startNoteRenderer.width;
                if (this._startNote.beat.nextBeat &&
                    this._startNote.beat.nextBeat.voice === this._startNote.beat.voice) {
                    endX =
                        cx +
                            startNoteRenderer.x +
                            startNoteRenderer.getBeatX(this._startNote.beat.nextBeat, BeatXPosition.PreNotes);
                }
                waves = true;
                break;
            default:
                return;
        }
        this.paintSlideLine(canvas, waves, startX, endX, startY, endY);
    }
    paintSlideLine(canvas, waves, startX, endX, startY, endY) {
        if (waves) {
            let glyph = new NoteVibratoGlyph(0, 0, VibratoType.Slight, 1.2);
            glyph.renderer = this.renderer;
            glyph.doLayout();
            startY -= glyph.height / 2;
            endY -= glyph.height / 2;
            let b = endX - startX;
            let a = endY - startY;
            let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            glyph.width = b;
            let angle = Math.asin(a / c) * (180 / Math.PI);
            canvas.beginRotate(startX, startY, angle);
            glyph.paint(0, 0, canvas);
            canvas.endRotate();
        }
        else {
            canvas.beginPath();
            canvas.moveTo(startX, startY);
            canvas.lineTo(endX, endY);
            canvas.stroke();
        }
    }
}
//# sourceMappingURL=ScoreSlideLineGlyph.js.map
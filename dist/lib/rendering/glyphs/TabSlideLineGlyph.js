import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { VibratoType } from '@src/model/VibratoType';
import { NoteYPosition, NoteXPosition } from '@src/rendering/BarRendererBase';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NoteVibratoGlyph } from '@src/rendering/glyphs/NoteVibratoGlyph';
export class TabSlideLineGlyph extends Glyph {
    constructor(inType, outType, startNote, parent) {
        super(0, 0);
        this._inType = inType;
        this._outType = outType;
        this._startNote = startNote;
        this._parent = parent;
    }
    doLayout() {
        this.width = 0;
    }
    paint(cx, cy, canvas) {
        this.paintSlideIn(cx, cy, canvas);
        this.paintSlideOut(cx, cy, canvas);
    }
    paintSlideIn(cx, cy, canvas) {
        let startNoteRenderer = this.renderer;
        let sizeX = 12 * this.scale;
        let sizeY = 3 * this.scale;
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        switch (this._inType) {
            case SlideInType.IntoFromBelow:
                endX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Left);
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                startX = endX - sizeX;
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center) + sizeY;
                break;
            case SlideInType.IntoFromAbove:
                endX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Left);
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                startX = endX - sizeX;
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center) - sizeY;
                break;
            default:
                return;
        }
        this.paintSlideLine(canvas, false, startX, endX, startY, endY);
    }
    paintSlideOut(cx, cy, canvas) {
        let startNoteRenderer = this.renderer;
        let sizeX = 12 * this.scale;
        let sizeY = 3 * this.scale;
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let waves = false;
        const endXOffset = 2 * this.scale;
        switch (this._outType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                startX =
                    cx +
                        startNoteRenderer.x +
                        startNoteRenderer.getBeatX(this._startNote.beat, BeatXPosition.PostNotes);
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
                                endNoteRenderer.getBeatX(this._startNote.slideTarget.beat, BeatXPosition.OnNotes)
                                - endXOffset;
                        endY =
                            cy +
                                endNoteRenderer.y +
                                endNoteRenderer.getNoteY(this._startNote.slideTarget, NoteYPosition.Center);
                    }
                    if (this._startNote.slideTarget.fret > this._startNote.fret) {
                        startY += sizeY;
                        endY -= sizeY;
                    }
                    else {
                        startY -= sizeY;
                        endY += sizeY;
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
                endX = startX + sizeX - endXOffset;
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center) - sizeY;
                break;
            case SlideOutType.OutDown:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endX = startX + sizeX - endXOffset;
                endY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center) + sizeY;
                break;
            case SlideOutType.PickSlideDown:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endX =
                    cx + startNoteRenderer.x + startNoteRenderer.getBeatX(this._startNote.beat, BeatXPosition.EndBeat);
                endY = startY + sizeY * 3;
                waves = true;
                break;
            case SlideOutType.PickSlideUp:
                startX = cx + startNoteRenderer.x + startNoteRenderer.getNoteX(this._startNote, NoteXPosition.Right);
                startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(this._startNote, NoteYPosition.Center);
                endX =
                    cx + startNoteRenderer.x + startNoteRenderer.getBeatX(this._startNote.beat, BeatXPosition.EndBeat);
                endY = startY - sizeY * 3;
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
//# sourceMappingURL=TabSlideLineGlyph.js.map
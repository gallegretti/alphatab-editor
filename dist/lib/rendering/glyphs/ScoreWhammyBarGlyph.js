import { BendStyle } from '@src/model/BendStyle';
import { WhammyType } from '@src/model/WhammyType';
import { NotationMode } from '@src/NotationSettings';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { BendNoteHeadGroupGlyph } from '@src/rendering/glyphs/BendNoteHeadGroupGlyph';
import { ScoreHelperNotesBaseGlyph } from '@src/rendering/glyphs/ScoreHelperNotesBaseGlyph';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { TabWhammyBarGlyph } from '@src/rendering/glyphs/TabWhammyBarGlyph';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
import { NoteYPosition } from '../BarRendererBase';
export class ScoreWhammyBarGlyph extends ScoreHelperNotesBaseGlyph {
    constructor(beat) {
        super(0, 0);
        this._beat = beat;
    }
    doLayout() {
        let whammyMode = this.renderer.settings.notation.notationMode;
        switch (this._beat.whammyBarType) {
            case WhammyType.None:
            case WhammyType.Custom:
            case WhammyType.Hold:
                return;
            case WhammyType.Dive:
            case WhammyType.PrediveDive:
                {
                    let endGlyphs = new BendNoteHeadGroupGlyph(this._beat, false);
                    endGlyphs.renderer = this.renderer;
                    let lastWhammyPoint = this._beat.whammyBarPoints[this._beat.whammyBarPoints.length - 1];
                    for (let note of this._beat.notes) {
                        if (!note.isTieOrigin) {
                            endGlyphs.addGlyph(this.getBendNoteValue(note, lastWhammyPoint), lastWhammyPoint.value % 2 !== 0);
                        }
                    }
                    endGlyphs.doLayout();
                    this.BendNoteHeads.push(endGlyphs);
                }
                break;
            case WhammyType.Dip:
                {
                    if (whammyMode === NotationMode.SongBook) {
                        let res = this.renderer.resources;
                        this.renderer.simpleWhammyOverflow =
                            res.tablatureFont.size * 1.5 +
                                ScoreWhammyBarGlyph.SimpleDipHeight * this.scale +
                                ScoreWhammyBarGlyph.SimpleDipPadding * this.scale;
                    }
                    else {
                        let middleGlyphs = new BendNoteHeadGroupGlyph(this._beat, false);
                        middleGlyphs.renderer = this.renderer;
                        if (this.renderer.settings.notation.notationMode === NotationMode.GuitarPro) {
                            let middleBendPoint = this._beat.whammyBarPoints[1];
                            for (let note of this._beat.notes) {
                                middleGlyphs.addGlyph(this.getBendNoteValue(note, this._beat.whammyBarPoints[1]), middleBendPoint.value % 2 !== 0);
                            }
                        }
                        middleGlyphs.doLayout();
                        this.BendNoteHeads.push(middleGlyphs);
                        let endGlyphs = new BendNoteHeadGroupGlyph(this._beat, false);
                        endGlyphs.renderer = this.renderer;
                        if (this.renderer.settings.notation.notationMode === NotationMode.GuitarPro) {
                            let lastBendPoint = this._beat.whammyBarPoints[this._beat.whammyBarPoints.length - 1];
                            for (let note of this._beat.notes) {
                                endGlyphs.addGlyph(this.getBendNoteValue(note, lastBendPoint), lastBendPoint.value % 2 !== 0);
                            }
                        }
                        endGlyphs.doLayout();
                        this.BendNoteHeads.push(endGlyphs);
                    }
                }
                break;
            case WhammyType.Predive:
                break;
        }
        super.doLayout();
    }
    paint(cx, cy, canvas) {
        let beat = this._beat;
        switch (beat.whammyBarType) {
            case WhammyType.None:
            case WhammyType.Custom:
                return;
        }
        let whammyMode = this.renderer.settings.notation.notationMode;
        let startNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, beat.voice.bar);
        let startX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(beat, BeatXPosition.MiddleNotes);
        let beatDirection = this.getTieDirection(beat, startNoteRenderer);
        let direction = this._beat.notes.length === 1 ? beatDirection : BeamDirection.Up;
        let textalign = canvas.textAlign;
        for (let i = 0; i < beat.notes.length; i++) {
            let note = beat.notes[i];
            let startY = cy + startNoteRenderer.y;
            if (i > 0 && i >= ((this._beat.notes.length / 2) | 0)) {
                direction = BeamDirection.Down;
            }
            if (direction === BeamDirection.Down) {
                startY += startNoteRenderer.getNoteY(note, NoteYPosition.Bottom);
            }
            else {
                startY += startNoteRenderer.getNoteY(note, NoteYPosition.Top);
            }
            let endX = cx + startNoteRenderer.x;
            if (beat.isLastOfVoice) {
                endX += startNoteRenderer.width;
            }
            else {
                endX += startNoteRenderer.getBeatX(beat, BeatXPosition.EndBeat);
            }
            endX -= 8 * this.scale;
            let slurText = beat.whammyStyle === BendStyle.Gradual && i === 0 ? 'grad.' : '';
            let endNoteRenderer = null;
            if (note.isTieOrigin) {
                endNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, note.tieDestination.beat.voice.bar);
                if (endNoteRenderer && endNoteRenderer.staff === startNoteRenderer.staff) {
                    endX =
                        cx +
                            endNoteRenderer.x +
                            endNoteRenderer.getBeatX(note.tieDestination.beat, BeatXPosition.MiddleNotes);
                }
                else {
                    endNoteRenderer = null;
                }
            }
            let heightOffset = NoteHeadGlyph.NoteHeadHeight * this.scale * NoteHeadGlyph.GraceScale * 0.5;
            if (direction === BeamDirection.Up) {
                heightOffset = -heightOffset;
            }
            let endValue = beat.whammyBarPoints.length > 0
                ? this.getBendNoteValue(note, beat.whammyBarPoints[beat.whammyBarPoints.length - 1])
                : 0;
            let endY = 0;
            let bendTie = false;
            if (this.BendNoteHeads.length > 0 && this.BendNoteHeads[0].containsNoteValue(endValue)) {
                endY = this.BendNoteHeads[0].getNoteValueY(endValue) + heightOffset;
                bendTie = true;
            }
            else if (endNoteRenderer &&
                ((note.isTieOrigin && note.tieDestination.beat.hasWhammyBar) || note.beat.isContinuedWhammy)) {
                endY = cy + endNoteRenderer.y + endNoteRenderer.getNoteY(note.tieDestination, NoteYPosition.Top);
                bendTie = true;
                if (direction === BeamDirection.Down) {
                    endY += NoteHeadGlyph.NoteHeadHeight * this.scale;
                }
            }
            else if (note.isTieOrigin) {
                if (!endNoteRenderer) {
                    endY = startY;
                }
                else {
                    endY = cy + endNoteRenderer.y + endNoteRenderer.getNoteY(note.tieDestination, NoteYPosition.Top);
                }
                if (direction === BeamDirection.Down) {
                    endY += NoteHeadGlyph.NoteHeadHeight * this.scale;
                }
            }
            switch (beat.whammyBarType) {
                case WhammyType.Hold:
                    if (note.isTieOrigin) {
                        TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, beatDirection === BeamDirection.Down, 22, 4);
                    }
                    break;
                case WhammyType.Dive:
                    if (i === 0) {
                        this.BendNoteHeads[0].x = endX - this.BendNoteHeads[0].noteHeadOffset;
                        this.BendNoteHeads[0].y = cy + startNoteRenderer.y;
                        this.BendNoteHeads[0].paint(0, 0, canvas);
                        if (this.BendNoteHeads[0].containsNoteValue(endValue)) {
                            endY += this.BendNoteHeads[0].y;
                        }
                    }
                    if (bendTie) {
                        this.drawBendSlur(canvas, startX, startY, endX, endY, direction === BeamDirection.Down, this.scale, slurText);
                    }
                    else if (note.isTieOrigin) {
                        TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, beatDirection === BeamDirection.Down, 22, 4);
                    }
                    break;
                case WhammyType.Dip:
                    if (whammyMode === NotationMode.SongBook) {
                        if (i === 0) {
                            let simpleStartX = cx +
                                startNoteRenderer.x +
                                startNoteRenderer.getBeatX(this._beat, BeatXPosition.OnNotes) -
                                2 * this.scale;
                            let simpleEndX = cx +
                                startNoteRenderer.x +
                                startNoteRenderer.getBeatX(this._beat, BeatXPosition.PostNotes) +
                                2 * this.scale;
                            let middleX = (simpleStartX + simpleEndX) / 2;
                            let text = (((this._beat.whammyBarPoints[1].value - this._beat.whammyBarPoints[0].value) / 4) |
                                0).toString();
                            canvas.font = this.renderer.resources.tablatureFont;
                            canvas.fillText(text, middleX, cy + this.y);
                            let simpleStartY = cy + this.y + canvas.font.size + 2 * this.scale;
                            let simpleEndY = simpleStartY + ScoreWhammyBarGlyph.SimpleDipHeight * this.scale;
                            if (this._beat.whammyBarPoints[1].value > this._beat.whammyBarPoints[0].value) {
                                canvas.moveTo(simpleStartX, simpleEndY);
                                canvas.lineTo(middleX, simpleStartY);
                                canvas.lineTo(simpleEndX, simpleEndY);
                            }
                            else {
                                canvas.moveTo(simpleStartX, simpleStartY);
                                canvas.lineTo(middleX, simpleEndY);
                                canvas.lineTo(simpleEndX, simpleStartY);
                            }
                            canvas.stroke();
                        }
                        if (note.isTieOrigin) {
                            TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, beatDirection === BeamDirection.Down, 22, 4);
                        }
                    }
                    else {
                        let middleX = (startX + endX) / 2;
                        this.BendNoteHeads[0].x = middleX - this.BendNoteHeads[0].noteHeadOffset;
                        this.BendNoteHeads[0].y = cy + startNoteRenderer.y;
                        this.BendNoteHeads[0].paint(0, 0, canvas);
                        let middleValue = this.getBendNoteValue(note, beat.whammyBarPoints[1]);
                        let middleY = this.BendNoteHeads[0].getNoteValueY(middleValue) + heightOffset;
                        this.drawBendSlur(canvas, startX, startY, middleX, middleY, direction === BeamDirection.Down, this.scale, slurText);
                        this.BendNoteHeads[1].x = endX - this.BendNoteHeads[1].noteHeadOffset;
                        this.BendNoteHeads[1].y = cy + startNoteRenderer.y;
                        this.BendNoteHeads[1].paint(0, 0, canvas);
                        endY = this.BendNoteHeads[1].getNoteValueY(endValue) + heightOffset;
                        this.drawBendSlur(canvas, middleX, middleY, endX, endY, direction === BeamDirection.Down, this.scale, slurText);
                    }
                    break;
                case WhammyType.PrediveDive:
                case WhammyType.Predive:
                    let preX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(note.beat, BeatXPosition.PreNotes);
                    preX += startNoteRenderer.getPreNotesGlyphForBeat(note.beat)
                        .prebendNoteHeadOffset;
                    let preY = cy +
                        startNoteRenderer.y +
                        startNoteRenderer.getScoreY(startNoteRenderer.accidentalHelper.getNoteLineForValue(note.displayValue - ((note.beat.whammyBarPoints[0].value / 2) | 0), false)) +
                        heightOffset;
                    this.drawBendSlur(canvas, preX, preY, startX, startY, direction === BeamDirection.Down, this.scale, slurText);
                    if (this.BendNoteHeads.length > 0) {
                        this.BendNoteHeads[0].x = endX - this.BendNoteHeads[0].noteHeadOffset;
                        this.BendNoteHeads[0].y = cy + startNoteRenderer.y;
                        this.BendNoteHeads[0].paint(0, 0, canvas);
                        this.drawBendSlur(canvas, startX, startY, endX, endY, direction === BeamDirection.Down, this.scale, slurText);
                    }
                    break;
            }
        }
        canvas.textAlign = textalign;
    }
    getBendNoteValue(note, bendPoint) {
        // NOTE: bendpoints are in 1/4 tones, but the note values are in 1/2 notes.
        return note.displayValueWithoutBend + ((bendPoint.value / 2) | 0);
    }
}
ScoreWhammyBarGlyph.SimpleDipHeight = TabWhammyBarGlyph.PerHalfSize * 2;
ScoreWhammyBarGlyph.SimpleDipPadding = 2;
//# sourceMappingURL=ScoreWhammyBarGlyph.js.map
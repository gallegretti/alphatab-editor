import { BendStyle } from '@src/model/BendStyle';
import { BendType } from '@src/model/BendType';
import { GraceType } from '@src/model/GraceType';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { BendNoteHeadGroupGlyph } from '@src/rendering/glyphs/BendNoteHeadGroupGlyph';
import { ScoreHelperNotesBaseGlyph } from '@src/rendering/glyphs/ScoreHelperNotesBaseGlyph';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
import { NoteYPosition } from '../BarRendererBase';
export class ScoreBendGlyph extends ScoreHelperNotesBaseGlyph {
    constructor(beat) {
        super(0, 0);
        this._notes = [];
        this._endNoteGlyph = null;
        this._middleNoteGlyph = null;
        this._beat = beat;
    }
    addBends(note) {
        this._notes.push(note);
        if (note.isTieOrigin) {
            return;
        }
        switch (note.bendType) {
            case BendType.Bend:
            case BendType.PrebendRelease:
            case BendType.PrebendBend:
                {
                    let endGlyphs = this._endNoteGlyph;
                    if (!endGlyphs) {
                        endGlyphs = new BendNoteHeadGroupGlyph(note.beat, false);
                        endGlyphs.renderer = this.renderer;
                        this._endNoteGlyph = endGlyphs;
                        this.BendNoteHeads.push(endGlyphs);
                    }
                    let lastBendPoint = note.bendPoints[note.bendPoints.length - 1];
                    endGlyphs.addGlyph(this.getBendNoteValue(note, lastBendPoint), lastBendPoint.value % 2 !== 0);
                }
                break;
            case BendType.Release:
                {
                    if (!note.isTieOrigin) {
                        let endGlyphs = this._endNoteGlyph;
                        if (!endGlyphs) {
                            endGlyphs = new BendNoteHeadGroupGlyph(note.beat, false);
                            endGlyphs.renderer = this.renderer;
                            this._endNoteGlyph = endGlyphs;
                            this.BendNoteHeads.push(endGlyphs);
                        }
                        let lastBendPoint = note.bendPoints[note.bendPoints.length - 1];
                        endGlyphs.addGlyph(this.getBendNoteValue(note, lastBendPoint), lastBendPoint.value % 2 !== 0);
                    }
                }
                break;
            case BendType.BendRelease:
                {
                    let middleGlyphs = this._middleNoteGlyph;
                    if (!middleGlyphs) {
                        middleGlyphs = new BendNoteHeadGroupGlyph(note.beat, false);
                        this._middleNoteGlyph = middleGlyphs;
                        middleGlyphs.renderer = this.renderer;
                        this.BendNoteHeads.push(middleGlyphs);
                    }
                    let middleBendPoint = note.bendPoints[1];
                    middleGlyphs.addGlyph(this.getBendNoteValue(note, note.bendPoints[1]), middleBendPoint.value % 2 !== 0);
                    let endGlyphs = this._endNoteGlyph;
                    if (!endGlyphs) {
                        endGlyphs = new BendNoteHeadGroupGlyph(note.beat, false);
                        endGlyphs.renderer = this.renderer;
                        this._endNoteGlyph = endGlyphs;
                        this.BendNoteHeads.push(endGlyphs);
                    }
                    let lastBendPoint = note.bendPoints[note.bendPoints.length - 1];
                    endGlyphs.addGlyph(this.getBendNoteValue(note, lastBendPoint), lastBendPoint.value % 2 !== 0);
                }
                break;
        }
    }
    paint(cx, cy, canvas) {
        // Draw note heads
        let startNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, this._beat.voice.bar);
        let startX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(this._beat, BeatXPosition.MiddleNotes);
        let endBeatX = cx + startNoteRenderer.x;
        if (this._beat.isLastOfVoice) {
            endBeatX += startNoteRenderer.postBeatGlyphsStart;
        }
        else {
            endBeatX += startNoteRenderer.getBeatX(this._beat.nextBeat, BeatXPosition.PreNotes);
        }
        endBeatX -= 8 * this.scale;
        let middleX = (startX + endBeatX) / 2;
        if (this._middleNoteGlyph) {
            this._middleNoteGlyph.x = middleX - this._middleNoteGlyph.noteHeadOffset;
            this._middleNoteGlyph.y = cy + startNoteRenderer.y;
            this._middleNoteGlyph.paint(0, 0, canvas);
        }
        if (this._endNoteGlyph) {
            this._endNoteGlyph.x = endBeatX - this._endNoteGlyph.noteHeadOffset;
            this._endNoteGlyph.y = cy + startNoteRenderer.y;
            this._endNoteGlyph.paint(0, 0, canvas);
        }
        this._notes.sort((a, b) => {
            return b.displayValue - a.displayValue;
        });
        let directionBeat = this._beat.graceType === GraceType.BendGrace ? this._beat.nextBeat : this._beat;
        let direction = this._notes.length === 1 ? this.getTieDirection(directionBeat, startNoteRenderer) : BeamDirection.Up;
        // draw slurs
        for (let i = 0; i < this._notes.length; i++) {
            let note = this._notes[i];
            if (i > 0 && i >= ((this._notes.length / 2) | 0)) {
                direction = BeamDirection.Down;
            }
            let startY = cy + startNoteRenderer.y + startNoteRenderer.getNoteY(note, NoteYPosition.Top);
            let heightOffset = NoteHeadGlyph.NoteHeadHeight * this.scale * NoteHeadGlyph.GraceScale * 0.5;
            if (direction === BeamDirection.Down) {
                startY += NoteHeadGlyph.NoteHeadHeight * this.scale;
            }
            let slurText = note.bendStyle === BendStyle.Gradual ? 'grad.' : '';
            if (note.isTieOrigin) {
                let endNote = note.tieDestination;
                let endNoteRenderer = !endNote
                    ? null
                    : this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, endNote.beat.voice.bar);
                // if we have a line break we draw only a line until the end
                if (!endNoteRenderer || endNoteRenderer.staff !== startNoteRenderer.staff) {
                    let endX = cx + startNoteRenderer.x + startNoteRenderer.width;
                    let noteValueToDraw = note.tieDestination.realValue;
                    startNoteRenderer.accidentalHelper.applyAccidentalForValue(note.beat, noteValueToDraw, false, true);
                    let endY = cy +
                        startNoteRenderer.y +
                        startNoteRenderer.getScoreY(startNoteRenderer.accidentalHelper.getNoteLineForValue(noteValueToDraw, false));
                    if (note.bendType === BendType.Hold || note.bendType === BendType.Prebend) {
                        TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, direction === BeamDirection.Down, 22, 4);
                    }
                    else {
                        this.drawBendSlur(canvas, startX, startY, endX, endY, direction === BeamDirection.Down, this.scale, slurText);
                    }
                }
                else {
                    let endX = cx + endNoteRenderer.x + endNoteRenderer.getBeatX(endNote.beat, BeatXPosition.MiddleNotes);
                    let endY = cy + endNoteRenderer.y + endNoteRenderer.getNoteY(endNote, NoteYPosition.Top);
                    if (direction === BeamDirection.Down) {
                        endY += NoteHeadGlyph.NoteHeadHeight * this.scale;
                    }
                    if (note.bendType === BendType.Hold || note.bendType === BendType.Prebend) {
                        TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, direction === BeamDirection.Down, 22, 4);
                    }
                    else {
                        this.drawBendSlur(canvas, startX, startY, endX, endY, direction === BeamDirection.Down, this.scale, slurText);
                    }
                }
                switch (note.bendType) {
                    case BendType.Prebend:
                    case BendType.PrebendBend:
                    case BendType.PrebendRelease:
                        let preX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(note.beat, BeatXPosition.PreNotes);
                        preX += startNoteRenderer.getPreNotesGlyphForBeat(note.beat)
                            .prebendNoteHeadOffset;
                        let preY = cy +
                            startNoteRenderer.y +
                            startNoteRenderer.getScoreY(startNoteRenderer.accidentalHelper.getNoteLineForValue(note.displayValue - ((note.bendPoints[0].value / 2) | 0), false)) +
                            heightOffset;
                        this.drawBendSlur(canvas, preX, preY, startX, startY, direction === BeamDirection.Down, this.scale);
                        break;
                }
            }
            else {
                if (direction === BeamDirection.Up) {
                    heightOffset = -heightOffset;
                }
                let endValue = 0;
                let endY = 0;
                switch (note.bendType) {
                    case BendType.Bend:
                        endValue = this.getBendNoteValue(note, note.bendPoints[note.bendPoints.length - 1]);
                        endY = this._endNoteGlyph.getNoteValueY(endValue) + heightOffset;
                        this.drawBendSlur(canvas, startX, startY, endBeatX, endY, direction === BeamDirection.Down, this.scale, slurText);
                        break;
                    case BendType.BendRelease:
                        let middleValue = this.getBendNoteValue(note, note.bendPoints[1]);
                        let middleY = this._middleNoteGlyph.getNoteValueY(middleValue) + heightOffset;
                        this.drawBendSlur(canvas, startX, startY, middleX, middleY, direction === BeamDirection.Down, this.scale, slurText);
                        endValue = this.getBendNoteValue(note, note.bendPoints[note.bendPoints.length - 1]);
                        endY = this._endNoteGlyph.getNoteValueY(endValue) + heightOffset;
                        this.drawBendSlur(canvas, middleX, middleY, endBeatX, endY, direction === BeamDirection.Down, this.scale, slurText);
                        break;
                    case BendType.Release:
                        if (this.BendNoteHeads.length > 0) {
                            endValue = this.getBendNoteValue(note, note.bendPoints[note.bendPoints.length - 1]);
                            endY = this.BendNoteHeads[0].getNoteValueY(endValue) + heightOffset;
                            this.drawBendSlur(canvas, startX, startY, endBeatX, endY, direction === BeamDirection.Down, this.scale, slurText);
                        }
                        break;
                    case BendType.Prebend:
                    case BendType.PrebendBend:
                    case BendType.PrebendRelease:
                        let preX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(note.beat, BeatXPosition.PreNotes);
                        preX += startNoteRenderer.getPreNotesGlyphForBeat(note.beat)
                            .prebendNoteHeadOffset;
                        let preY = cy +
                            startNoteRenderer.y +
                            startNoteRenderer.getScoreY(startNoteRenderer.accidentalHelper.getNoteLineForValue(note.displayValue - ((note.bendPoints[0].value / 2) | 0), false)) +
                            heightOffset;
                        this.drawBendSlur(canvas, preX, preY, startX, startY, direction === BeamDirection.Down, this.scale);
                        if (this.BendNoteHeads.length > 0) {
                            endValue = this.getBendNoteValue(note, note.bendPoints[note.bendPoints.length - 1]);
                            endY = this.BendNoteHeads[0].getNoteValueY(endValue) + heightOffset;
                            this.drawBendSlur(canvas, startX, startY, endBeatX, endY, direction === BeamDirection.Down, this.scale, slurText);
                        }
                        break;
                }
            }
        }
    }
    getBendNoteValue(note, bendPoint) {
        // NOTE: bendpoints are in 1/4 tones, but the note values are in 1/2 notes.
        return note.displayValueWithoutBend + ((bendPoint.value / 2) | 0);
    }
}
//# sourceMappingURL=ScoreBendGlyph.js.map
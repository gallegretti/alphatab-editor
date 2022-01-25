import { BeatBeamingMode } from '@src/model/Beat';
import { Duration } from '@src/model/Duration';
import { Fingers } from '@src/model/Fingers';
import { GraceType } from '@src/model/GraceType';
import { HarmonicType } from '@src/model/HarmonicType';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { ModelUtils } from '@src/model/ModelUtils';
import { MidiUtils } from '@src/midi/MidiUtils';
import { AccidentalHelper } from './AccidentalHelper';
import { NoteYPosition } from '../BarRendererBase';
class BeatLinePositions {
    constructor() {
        this.staffId = '';
        this.up = 0;
        this.down = 0;
    }
}
export class BeamingHelperDrawInfo {
    constructor() {
        this.startBeat = null;
        this.startX = 0;
        this.startY = 0;
        this.endBeat = null;
        this.endX = 0;
        this.endY = 0;
    }
    // 
    /**
     * calculates the Y-position given a X-pos using the current start end point
     * @param x
     */
    calcY(x) {
        // get the y position of the given beat on this curve
        if (this.startX === this.endX) {
            return this.startY;
        }
        // y(x)  = ( (y2 - y1) / (x2 - x1) )  * (x - x1) + y1;
        return ((this.endY - this.startY) / (this.endX - this.startX)) * (x - this.startX) + this.startY;
    }
}
/**
 * This public class helps drawing beams and bars for notes.
 */
export class BeamingHelper {
    constructor(staff, renderer) {
        this._beatLineXPositions = new Map();
        this._firstNonRestBeat = null;
        this._lastNonRestBeat = null;
        this.voice = null;
        this.beats = [];
        this.shortestDuration = Duration.QuadrupleWhole;
        /**
         * the number of fingering indicators that will be drawn
         */
        this.fingeringCount = 0;
        /**
         * an indicator whether any beat has a tuplet on it.
         */
        this.hasTuplet = false;
        this._firstBeatLowestNoteCompareValue = -1;
        this._firstBeatHighestNoteCompareValue = -1;
        this._lastBeatLowestNoteCompareValue = -1;
        this._lastBeatHighestNoteCompareValue = -1;
        this.lowestNoteInHelper = null;
        this._lowestNoteCompareValueInHelper = -1;
        this.highestNoteInHelper = null;
        this._highestNoteCompareValueInHelper = -1;
        this.invertBeamDirection = false;
        this.preferredBeamDirection = null;
        this.isGrace = false;
        this.minRestLine = null;
        this.beatOfMinRestLine = null;
        this.maxRestLine = null;
        this.beatOfMaxRestLine = null;
        this.direction = BeamDirection.Up;
        this.drawingInfos = new Map();
        this._staff = staff;
        this._renderer = renderer;
        this.beats = [];
    }
    get isRestBeamHelper() {
        return this.beats.length === 1 && this.beats[0].isRest;
    }
    get hasLine() {
        return this.beats.length === 1 && this.beats[0].duration > Duration.Whole;
    }
    get hasFlag() {
        return (this.beats.length === 1 &&
            !this.beats[0].isRest &&
            (this.beats[0].duration > Duration.Quarter || this.beats[0].graceType !== GraceType.None));
    }
    getBeatLineX(beat) {
        if (this.hasBeatLineX(beat)) {
            if (this.direction === BeamDirection.Up) {
                return this._beatLineXPositions.get(beat.index).up;
            }
            return this._beatLineXPositions.get(beat.index).down;
        }
        return 0;
    }
    hasBeatLineX(beat) {
        return this._beatLineXPositions.has(beat.index);
    }
    registerBeatLineX(staffId, beat, up, down) {
        let positions = this.getOrCreateBeatPositions(beat);
        positions.staffId = staffId;
        positions.up = up;
        positions.down = down;
        for (const v of this.drawingInfos.values()) {
            if (v.startBeat == beat) {
                v.startX = this.getBeatLineX(beat);
            }
            else if (v.endBeat == beat) {
                v.endX = this.getBeatLineX(beat);
            }
        }
    }
    getOrCreateBeatPositions(beat) {
        if (!this._beatLineXPositions.has(beat.index)) {
            this._beatLineXPositions.set(beat.index, new BeatLinePositions());
        }
        return this._beatLineXPositions.get(beat.index);
    }
    finish() {
        this.direction = this.calculateDirection();
    }
    calculateDirection() {
        let direction = null;
        if (!this.voice) {
            // no proper voice (should not happen usually)
            direction = BeamDirection.Up;
        }
        else if (this.preferredBeamDirection !== null) {
            // we have a preferred direction
            direction = this.preferredBeamDirection;
        }
        else if (this.voice.index > 0) {
            // on multi-voice setups secondary voices are always down
            direction = this.invert(BeamDirection.Down);
        }
        else if (this.voice.bar.isMultiVoice) {
            // on multi-voice setups primary voices are always up
            direction = this.invert(BeamDirection.Up);
        }
        else if (this.beats[0].graceType !== GraceType.None) {
            // grace notes are always up
            direction = this.invert(BeamDirection.Up);
        }
        // the average line is used for determination
        //      key lowerequal than middle line -> up
        //      key higher than middle line -> down
        if (this.highestNoteInHelper && this.lowestNoteInHelper) {
            let highestNotePosition = this._renderer.getNoteY(this.highestNoteInHelper, NoteYPosition.Center);
            let lowestNotePosition = this._renderer.getNoteY(this.lowestNoteInHelper, NoteYPosition.Center);
            if (direction === null) {
                const avg = (highestNotePosition + lowestNotePosition) / 2;
                direction = this.invert(this._renderer.middleYPosition < avg ? BeamDirection.Up : BeamDirection.Down);
            }
            this._renderer.completeBeamingHelper(this);
        }
        else {
            direction = this.invert(BeamDirection.Up);
            this._renderer.completeBeamingHelper(this);
        }
        return direction;
    }
    static computeLineHeightsForRest(duration) {
        switch (duration) {
            case Duration.QuadrupleWhole:
                return [2, 2];
            case Duration.DoubleWhole:
                return [2, 2];
            case Duration.Whole:
                return [0, 1];
            case Duration.Half:
                return [1, 0];
            case Duration.Quarter:
                return [3, 3];
            case Duration.Eighth:
                return [2, 2];
            case Duration.Sixteenth:
                return [2, 4];
            case Duration.ThirtySecond:
                return [4, 4];
            case Duration.SixtyFourth:
                return [4, 6];
            case Duration.OneHundredTwentyEighth:
                return [6, 6];
            case Duration.TwoHundredFiftySixth:
                return [6, 8];
        }
        return [0, 0];
    }
    /**
     * Registers a rest beat within the accidental helper so the rest
     * symbol is considered properly during beaming.
     * @param beat The rest beat.
     * @param line The line on which the rest symbol is placed
     */
    applyRest(beat, line) {
        // do not accept rests after the last beat which has notes
        if (this._lastNonRestBeat && beat.index >= this._lastNonRestBeat.index ||
            this._firstNonRestBeat && beat.index <= this._firstNonRestBeat.index) {
            return;
        }
        // correct the line of the glyph to a note which would
        // be placed at the upper / lower end of the glyph.
        let aboveRest = line;
        let belowRest = line;
        const offsets = BeamingHelper.computeLineHeightsForRest(beat.duration);
        aboveRest -= offsets[0];
        belowRest += offsets[1];
        const minRestLine = this.minRestLine;
        const maxRestLine = this.maxRestLine;
        if (minRestLine === null || minRestLine > aboveRest) {
            this.minRestLine = aboveRest;
            this.beatOfMinRestLine = beat;
        }
        if (maxRestLine === null || maxRestLine < belowRest) {
            this.maxRestLine = belowRest;
            this.beatOfMaxRestLine = beat;
        }
    }
    invert(direction) {
        if (!this.invertBeamDirection) {
            return direction;
        }
        switch (direction) {
            case BeamDirection.Down:
                return BeamDirection.Up;
            // case BeamDirection.Up:
            default:
                return BeamDirection.Down;
        }
    }
    checkBeat(beat) {
        if (beat.invertBeamDirection) {
            this.invertBeamDirection = true;
        }
        if (!this.voice) {
            this.voice = beat.voice;
        }
        // allow adding if there are no beats yet
        let add = false;
        if (this.beats.length === 0) {
            add = true;
        }
        else {
            switch (this.beats[this.beats.length - 1].beamingMode) {
                case BeatBeamingMode.Auto:
                    add = BeamingHelper.canJoin(this.beats[this.beats.length - 1], beat);
                    break;
                case BeatBeamingMode.ForceSplitToNext:
                    add = false;
                    break;
                case BeatBeamingMode.ForceMergeWithNext:
                    add = true;
                    break;
            }
        }
        if (add) {
            if (beat.preferredBeamDirection !== null) {
                this.preferredBeamDirection = beat.preferredBeamDirection;
            }
            if (!beat.isRest) {
                if (this.isRestBeamHelper) {
                    this.beats = [];
                }
                this.beats.push(beat);
                if (beat.graceType !== GraceType.None) {
                    this.isGrace = true;
                }
                if (beat.hasTuplet) {
                    this.hasTuplet = true;
                }
                let fingeringCount = 0;
                for (let n = 0; n < beat.notes.length; n++) {
                    let note = beat.notes[n];
                    if (note.leftHandFinger !== Fingers.Unknown || note.rightHandFinger !== Fingers.Unknown) {
                        fingeringCount++;
                    }
                }
                if (fingeringCount > this.fingeringCount) {
                    this.fingeringCount = fingeringCount;
                }
                this.checkNote(beat.minNote);
                this.checkNote(beat.maxNote);
                if (this.shortestDuration < beat.duration) {
                    this.shortestDuration = beat.duration;
                }
                if (!this._firstNonRestBeat) {
                    this._firstNonRestBeat = beat;
                }
                this._lastNonRestBeat = beat;
            }
            else if (this.beats.length === 0) {
                this.beats.push(beat);
            }
            if (beat.hasTuplet) {
                this.hasTuplet = true;
            }
        }
        return add;
    }
    checkNote(note) {
        if (!note) {
            return;
        }
        // a note can expand to 2 note heads if it has a harmonic
        let lowestValueForNote;
        let highestValueForNote;
        // For percussion we use the line as value to compare whether it is
        // higher or lower.
        if (this.voice && note.isPercussion) {
            lowestValueForNote = -AccidentalHelper.getPercussionLine(this.voice.bar, AccidentalHelper.getNoteValue(note));
            highestValueForNote = lowestValueForNote;
        }
        else {
            lowestValueForNote = AccidentalHelper.getNoteValue(note);
            highestValueForNote = lowestValueForNote;
            if (note.harmonicType !== HarmonicType.None && note.harmonicType !== HarmonicType.Natural) {
                highestValueForNote = note.realValue - this._staff.displayTranspositionPitch;
            }
        }
        if (this.beats.length === 1 && this.beats[0] === note.beat) {
            if (this._firstBeatLowestNoteCompareValue === -1 || lowestValueForNote < this._firstBeatLowestNoteCompareValue) {
                this._firstBeatLowestNoteCompareValue = lowestValueForNote;
            }
            if (this._firstBeatHighestNoteCompareValue === -1 || highestValueForNote > this._firstBeatHighestNoteCompareValue) {
                this._firstBeatHighestNoteCompareValue = highestValueForNote;
            }
        }
        if (this._lastBeatLowestNoteCompareValue === -1 || lowestValueForNote < this._lastBeatLowestNoteCompareValue) {
            this._lastBeatLowestNoteCompareValue = lowestValueForNote;
        }
        if (this._lastBeatHighestNoteCompareValue === -1 || highestValueForNote > this._lastBeatHighestNoteCompareValue) {
            this._lastBeatHighestNoteCompareValue = highestValueForNote;
        }
        if (!this.lowestNoteInHelper || lowestValueForNote < this._lowestNoteCompareValueInHelper) {
            this.lowestNoteInHelper = note;
            this._lowestNoteCompareValueInHelper = lowestValueForNote;
        }
        if (!this.highestNoteInHelper || highestValueForNote > this._highestNoteCompareValueInHelper) {
            this.highestNoteInHelper = note;
            this._highestNoteCompareValueInHelper = highestValueForNote;
        }
    }
    // TODO: Check if this beaming is really correct, I'm not sure if we are connecting beats correctly
    static canJoin(b1, b2) {
        // is this a voice we can join with?
        if (!b1 ||
            !b2 ||
            b1.graceType !== b2.graceType ||
            b1.graceType === GraceType.BendGrace ||
            b2.graceType === GraceType.BendGrace) {
            return false;
        }
        if (b1.graceType !== GraceType.None && b2.graceType !== GraceType.None) {
            return true;
        }
        let m1 = b1.voice.bar;
        let m2 = b2.voice.bar;
        // only join on same measure
        if (m1 !== m2) {
            return false;
        }
        // get times of those voices and check if the times
        // are in the same division
        let start1 = b1.playbackStart;
        let start2 = b2.playbackStart;
        // we can only join 8th, 16th, 32th and 64th voices
        if (!BeamingHelper.canJoinDuration(b1.duration) || !BeamingHelper.canJoinDuration(b2.duration)) {
            return start1 === start2;
        }
        // break between different tuplet groups
        if (b1.tupletGroup !== b2.tupletGroup) {
            return false;
        }
        if (b1.hasTuplet && b2.hasTuplet) {
            // force joining for full tuplet groups
            if (b1.tupletGroup === b2.tupletGroup && b1.tupletGroup.isFull) {
                return true;
            }
        }
        // TODO: create more rules for automatic beaming
        let divisionLength = MidiUtils.QuarterTime;
        switch (m1.masterBar.timeSignatureDenominator) {
            case 8:
                if (m1.masterBar.timeSignatureNumerator % 3 === 0) {
                    divisionLength += (MidiUtils.QuarterTime / 2) | 0;
                }
                break;
        }
        // check if they are on the same division
        let division1 = ((divisionLength + start1) / divisionLength) | 0 | 0;
        let division2 = ((divisionLength + start2) / divisionLength) | 0 | 0;
        return division1 === division2;
    }
    static canJoinDuration(d) {
        switch (d) {
            case Duration.Whole:
            case Duration.Half:
            case Duration.Quarter:
                return false;
            default:
                return true;
        }
    }
    static isFullBarJoin(a, b, barIndex) {
        // TODO: this getindex call seems expensive since we call this method very often.
        return ModelUtils.getIndex(a.duration) - 2 - barIndex > 0 && ModelUtils.getIndex(b.duration) - 2 - barIndex > 0;
    }
    get beatOfLowestNote() {
        return this.lowestNoteInHelper.beat;
    }
    get beatOfHighestNote() {
        return this.highestNoteInHelper.beat;
    }
    /**
     * Returns whether the the position of the given beat, was registered by the staff of the given ID
     * @param staffId
     * @param beat
     * @returns
     */
    isPositionFrom(staffId, beat) {
        if (!this._beatLineXPositions.has(beat.index)) {
            return true;
        }
        return (this._beatLineXPositions.get(beat.index).staffId === staffId ||
            !this._beatLineXPositions.get(beat.index).staffId);
    }
}
//# sourceMappingURL=BeamingHelper.js.map
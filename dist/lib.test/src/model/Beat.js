import { MidiUtils } from '@src/midi/MidiUtils';
import { Automation, AutomationType } from '@src/model/Automation';
import { BendPoint } from '@src/model/BendPoint';
import { BendStyle } from '@src/model/BendStyle';
import { BendType } from '@src/model/BendType';
import { BrushType } from '@src/model/BrushType';
import { CrescendoType } from '@src/model/CrescendoType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { GraceType } from '@src/model/GraceType';
import { Note } from '@src/model/Note';
import { Ottavia } from '@src/model/Ottavia';
import { PickStroke } from '@src/model/PickStroke';
import { TupletGroup } from '@src/model/TupletGroup';
import { VibratoType } from '@src/model/VibratoType';
import { WhammyType } from '@src/model/WhammyType';
import { NotationMode } from '@src/NotationSettings';
import { Logger } from '@src/Logger';
import { BeatCloner } from '@src/generated/model/BeatCloner';
import { GraceGroup } from './GraceGroup';
/**
 * Lists the different modes on how beaming for a beat should be done.
 */
export var BeatBeamingMode;
(function (BeatBeamingMode) {
    /**
     * Automatic beaming based on the timing rules.
     */
    BeatBeamingMode[BeatBeamingMode["Auto"] = 0] = "Auto";
    /**
     * Force a split to the next beat.
     */
    BeatBeamingMode[BeatBeamingMode["ForceSplitToNext"] = 1] = "ForceSplitToNext";
    /**
     * Force a merge with the next beat.
     */
    BeatBeamingMode[BeatBeamingMode["ForceMergeWithNext"] = 2] = "ForceMergeWithNext";
})(BeatBeamingMode || (BeatBeamingMode = {}));
/**
 * A beat is a single block within a bar. A beat is a combination
 * of several notes played at the same time.
 * @json
 * @cloneable
 */
export class Beat {
    constructor() {
        /**
         * Gets or sets the unique id of this beat.
         * @clone_ignore
         */
        this.id = Beat._globalBeatId++;
        /**
         * Gets or sets the zero-based index of this beat within the voice.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets the previous beat within the whole song.
         * @json_ignore
         * @clone_ignore
         */
        this.previousBeat = null;
        /**
         * Gets or sets the next beat within the whole song.
         * @json_ignore
         * @clone_ignore
         */
        this.nextBeat = null;
        /**
         * Gets or sets the list of notes contained in this beat.
         * @json_add addNote
         * @clone_add addNote
         */
        this.notes = [];
        /**
         * Gets the lookup where the notes per string are registered.
         * If this staff contains string based notes this lookup allows fast access.
         * @json_ignore
         */
        this.noteStringLookup = new Map();
        /**
         * Gets the lookup where the notes per value are registered.
         * If this staff contains string based notes this lookup allows fast access.
         * @json_ignore
         */
        this.noteValueLookup = new Map();
        /**
         * Gets or sets a value indicating whether this beat is considered empty.
         */
        this.isEmpty = false;
        /**
         * Gets or sets which whammy bar style should be used for this bar.
         */
        this.whammyStyle = BendStyle.Default;
        /**
         * Gets or sets the ottava applied to this beat.
         */
        this.ottava = Ottavia.Regular;
        /**
         * Gets or sets the fermata applied to this beat.
         * @clone_ignore
         * @json_ignore
         */
        this.fermata = null;
        /**
         * Gets a value indicating whether this beat starts a legato slur.
         */
        this.isLegatoOrigin = false;
        /**
         * Gets or sets the note with the lowest pitch in this beat. Only visible notes are considered.
         * @json_ignore
         * @clone_ignore
         */
        this.minNote = null;
        /**
         * Gets or sets the note with the highest pitch in this beat. Only visible notes are considered.
         * @json_ignore
         * @clone_ignore
         */
        this.maxNote = null;
        /**
         * Gets or sets the note with the highest string number in this beat. Only visible notes are considered.
         * @json_ignore
         * @clone_ignore
         */
        this.maxStringNote = null;
        /**
         * Gets or sets the note with the lowest string number in this beat. Only visible notes are considered.
         * @json_ignore
         * @clone_ignore
         */
        this.minStringNote = null;
        /**
         * Gets or sets the duration of this beat.
         */
        this.duration = Duration.Quarter;
        /**
         * Gets or sets whether any note in this beat has a let-ring applied.
         * @json_ignore
         */
        this.isLetRing = false;
        /**
         * Gets or sets whether any note in this beat has a palm-mute paplied.
         * @json_ignore
         */
        this.isPalmMute = false;
        /**
         * Gets or sets a list of all automations on this beat.
         */
        this.automations = [];
        /**
         * Gets or sets the number of dots applied to the duration of this beat.
         */
        this.dots = 0;
        /**
         * Gets or sets a value indicating whether this beat is fade-in.
         */
        this.fadeIn = false;
        /**
         * Gets or sets the lyrics shown on this beat.
         */
        this.lyrics = null;
        /**
         * Gets or sets a value indicating whether the beat is played in rasgueado style.
         */
        this.hasRasgueado = false;
        /**
         * Gets or sets a value indicating whether the notes on this beat are played with a pop-style (bass).
         */
        this.pop = false;
        /**
         * Gets or sets a value indicating whether the notes on this beat are played with a slap-style (bass).
         */
        this.slap = false;
        /**
         * Gets or sets a value indicating whether the notes on this beat are played with a tap-style (bass).
         */
        this.tap = false;
        /**
         * Gets or sets the text annotation shown on this beat.
         */
        this.text = null;
        /**
         * Gets or sets the brush type applied to the notes of this beat.
         */
        this.brushType = BrushType.None;
        /**
         * Gets or sets the duration of the brush between the notes in midi ticks.
         */
        this.brushDuration = 0;
        /**
         * Gets or sets the tuplet denominator.
         */
        this.tupletDenominator = -1;
        /**
         * Gets or sets the tuplet numerator.
         */
        this.tupletNumerator = -1;
        /**
         * @clone_ignore
         * @json_ignore
         */
        this.tupletGroup = null;
        /**
         * Gets or sets whether this beat continues a whammy effect.
         */
        this.isContinuedWhammy = false;
        /**
         * Gets or sets the whammy bar style of this beat.
         */
        this.whammyBarType = WhammyType.None;
        /**
         * Gets or sets the points defining the whammy bar usage.
         * @json_add addWhammyBarPoint
         * @clone_add addWhammyBarPoint
         */
        this.whammyBarPoints = [];
        /**
         * Gets or sets the highest point with for the highest whammy bar value.
         * @json_ignore
         * @clone_ignore
         */
        this.maxWhammyPoint = null;
        /**
         * Gets or sets the highest point with for the lowest whammy bar value.
         * @json_ignore
         * @clone_ignore
         */
        this.minWhammyPoint = null;
        /**
         * Gets or sets the vibrato effect used on this beat.
         */
        this.vibrato = VibratoType.None;
        /**
         * Gets or sets the ID of the chord used on this beat.
         */
        this.chordId = null;
        /**
         * Gets or sets the grace style of this beat.
         */
        this.graceType = GraceType.None;
        /**
         * Gets or sets the grace group this beat belongs to.
         * If this beat is not a grace note, it holds the group which belongs to this beat.
         * @json_ignore
         * @clone_ignore
         */
        this.graceGroup = null;
        /**
         * Gets or sets the index of this beat within the grace group if
         * this is a grace beat.
         * @json_ignore
         * @clone_ignore
         */
        this.graceIndex = -1;
        /**
         * Gets or sets the pickstroke applied on this beat.
         */
        this.pickStroke = PickStroke.None;
        /**
         * Gets or sets the speed of the tremolo effect.
         */
        this.tremoloSpeed = null;
        /**
         * Gets or sets whether a crescendo/decrescendo is applied on this beat.
         */
        this.crescendo = CrescendoType.None;
        /**
         * The timeline position of the voice within the current bar as it is displayed. (unit: midi ticks)
         * This might differ from the actual playback time due to special grace types.
         */
        this.displayStart = 0;
        /**
         * The timeline position of the voice within the current bar as it is played. (unit: midi ticks)
         * This might differ from the actual playback time due to special grace types.
         */
        this.playbackStart = 0;
        /**
         * Gets or sets the duration that is used for the display of this beat. It defines the size/width of the beat in
         * the music sheet. (unit: midi ticks).
         */
        this.displayDuration = 0;
        /**
         * Gets or sets the duration that the note is played during the audio generation.
         */
        this.playbackDuration = 0;
        /**
         * Gets or sets the dynamics applied to this beat.
         */
        this.dynamics = DynamicValue.F;
        /**
         * Gets or sets a value indicating whether the beam direction should be inverted.
         */
        this.invertBeamDirection = false;
        /**
         * Gets or sets the preferred beam direction as specified in the input source.
         */
        this.preferredBeamDirection = null;
        /**
         * @json_ignore
         */
        this.isEffectSlurOrigin = false;
        /**
         * @clone_ignore
         * @json_ignore
         */
        this.effectSlurOrigin = null;
        /**
         * @clone_ignore
         * @json_ignore
         */
        this.effectSlurDestination = null;
        /**
         * Gets or sets how the beaming should be done for this beat.
         */
        this.beamingMode = BeatBeamingMode.Auto;
    }
    get isLastOfVoice() {
        return this.index === this.voice.beats.length - 1;
    }
    get isLegatoDestination() {
        return !!this.previousBeat && this.previousBeat.isLegatoOrigin;
    }
    get isRest() {
        return this.isEmpty || this.notes.length === 0;
    }
    /**
     * Gets a value indicating whether this beat is a full bar rest.
     */
    get isFullBarRest() {
        return this.isRest && this.voice.beats.length === 1 && this.duration === Duration.Whole;
    }
    get hasTuplet() {
        return (!(this.tupletDenominator === -1 && this.tupletNumerator === -1) &&
            !(this.tupletDenominator === 1 && this.tupletNumerator === 1));
    }
    get hasWhammyBar() {
        return this.whammyBarType !== WhammyType.None;
    }
    get hasChord() {
        return !!this.chordId;
    }
    get chord() {
        return this.chordId ? this.voice.bar.staff.chords.get(this.chordId) : null;
    }
    get isTremolo() {
        return !!this.tremoloSpeed;
    }
    get absoluteDisplayStart() {
        return this.voice.bar.masterBar.start + this.displayStart;
    }
    get absolutePlaybackStart() {
        return this.voice.bar.masterBar.start + this.playbackStart;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    addWhammyBarPoint(point) {
        this.whammyBarPoints.push(point);
        if (!this.maxWhammyPoint || point.value > this.maxWhammyPoint.value) {
            this.maxWhammyPoint = point;
        }
        if (!this.minWhammyPoint || point.value < this.minWhammyPoint.value) {
            this.minWhammyPoint = point;
        }
        if (this.whammyBarType === WhammyType.None) {
            this.whammyBarType = WhammyType.Custom;
        }
    }
    removeWhammyBarPoint(index) {
        // check index
        if (index < 0 || index >= this.whammyBarPoints.length) {
            return;
        }
        // remove point
        this.whammyBarPoints.splice(index, 1);
        let point = this.whammyBarPoints[index];
        // update maxWhammy point if required
        if (point === this.maxWhammyPoint) {
            this.maxWhammyPoint = null;
            for (let currentPoint of this.whammyBarPoints) {
                if (!this.maxWhammyPoint || currentPoint.value > this.maxWhammyPoint.value) {
                    this.maxWhammyPoint = currentPoint;
                }
            }
        }
        if (point === this.minWhammyPoint) {
            this.minWhammyPoint = null;
            for (let currentPoint of this.whammyBarPoints) {
                if (!this.minWhammyPoint || currentPoint.value < this.minWhammyPoint.value) {
                    this.minWhammyPoint = currentPoint;
                }
            }
        }
    }
    addNote(note) {
        note.beat = this;
        note.index = this.notes.length;
        this.notes.push(note);
        if (note.isStringed) {
            this.noteStringLookup.set(note.string, note);
        }
    }
    removeNote(note) {
        let index = this.notes.indexOf(note);
        if (index >= 0) {
            this.notes.splice(index, 1);
        }
    }
    getAutomation(type) {
        for (let i = 0, j = this.automations.length; i < j; i++) {
            let automation = this.automations[i];
            if (automation.type === type) {
                return automation;
            }
        }
        return null;
    }
    getNoteOnString(noteString) {
        if (this.noteStringLookup.has(noteString)) {
            return this.noteStringLookup.get(noteString);
        }
        return null;
    }
    calculateDuration() {
        if (this.isFullBarRest) {
            return this.voice.bar.masterBar.calculateDuration();
        }
        let ticks = MidiUtils.toTicks(this.duration);
        if (this.dots === 2) {
            ticks = MidiUtils.applyDot(ticks, true);
        }
        else if (this.dots === 1) {
            ticks = MidiUtils.applyDot(ticks, false);
        }
        if (this.tupletDenominator > 0 && this.tupletNumerator >= 0) {
            ticks = MidiUtils.applyTuplet(ticks, this.tupletNumerator, this.tupletDenominator);
        }
        return ticks;
    }
    updateDurations() {
        let ticks = this.calculateDuration();
        this.playbackDuration = ticks;
        switch (this.graceType) {
            case GraceType.BeforeBeat:
            case GraceType.OnBeat:
                switch (this.duration) {
                    case Duration.Sixteenth:
                        this.playbackDuration = MidiUtils.toTicks(Duration.SixtyFourth);
                        break;
                    case Duration.ThirtySecond:
                        this.playbackDuration = MidiUtils.toTicks(Duration.OneHundredTwentyEighth);
                        break;
                    default:
                        this.playbackDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                        break;
                }
                this.displayDuration = 0;
                break;
            case GraceType.BendGrace:
                this.playbackDuration /= 2;
                this.displayDuration = 0;
                break;
            default:
                this.displayDuration = ticks;
                let previous = this.previousBeat;
                if (previous && previous.graceType === GraceType.BendGrace) {
                    this.playbackDuration = previous.playbackDuration;
                }
                break;
        }
    }
    finishTuplet() {
        let previousBeat = this.previousBeat;
        let currentTupletGroup = previousBeat ? previousBeat.tupletGroup : null;
        if (this.hasTuplet || (this.graceType !== GraceType.None && currentTupletGroup)) {
            if (!previousBeat || !currentTupletGroup || !currentTupletGroup.check(this)) {
                currentTupletGroup = new TupletGroup(this.voice);
                currentTupletGroup.check(this);
            }
            this.tupletGroup = currentTupletGroup;
        }
    }
    finish(settings) {
        if (this.getAutomation(AutomationType.Instrument) === null &&
            this.index === 0 &&
            this.voice.index === 0 &&
            this.voice.bar.index === 0 &&
            this.voice.bar.staff.index === 0) {
            this.automations.push(Automation.buildInstrumentAutomation(false, 0, this.voice.bar.staff.track.playbackInfo.program));
        }
        switch (this.graceType) {
            case GraceType.OnBeat:
            case GraceType.BeforeBeat:
                let numberOfGraceBeats = this.graceGroup.beats.length;
                // set right duration for beaming/display
                if (numberOfGraceBeats === 1) {
                    this.duration = Duration.Eighth;
                }
                else if (numberOfGraceBeats === 2) {
                    this.duration = Duration.Sixteenth;
                }
                else {
                    this.duration = Duration.ThirtySecond;
                }
                break;
        }
        let displayMode = !settings ? NotationMode.GuitarPro : settings.notation.notationMode;
        let isGradual = this.text === 'grad' || this.text === 'grad.';
        if (isGradual && displayMode === NotationMode.SongBook) {
            this.text = '';
        }
        let needCopyBeatForBend = false;
        this.minNote = null;
        this.maxNote = null;
        this.minStringNote = null;
        this.maxStringNote = null;
        let visibleNotes = 0;
        let isEffectSlurBeat = false;
        for (let i = 0, j = this.notes.length; i < j; i++) {
            let note = this.notes[i];
            note.dynamics = this.dynamics;
            note.finish(settings);
            if (note.isLetRing) {
                this.isLetRing = true;
            }
            if (note.isPalmMute) {
                this.isPalmMute = true;
            }
            if (displayMode === NotationMode.SongBook && note.hasBend && this.graceType !== GraceType.BendGrace) {
                if (!note.isTieOrigin) {
                    switch (note.bendType) {
                        case BendType.Bend:
                        case BendType.PrebendRelease:
                        case BendType.PrebendBend:
                            needCopyBeatForBend = true;
                            break;
                    }
                }
                if (isGradual || note.bendStyle === BendStyle.Gradual) {
                    isGradual = true;
                    note.bendStyle = BendStyle.Gradual;
                    needCopyBeatForBend = false;
                }
                else {
                    note.bendStyle = BendStyle.Fast;
                }
            }
            if (note.isVisible) {
                visibleNotes++;
                if (!this.minNote || note.realValue < this.minNote.realValue) {
                    this.minNote = note;
                }
                if (!this.maxNote || note.realValue > this.maxNote.realValue) {
                    this.maxNote = note;
                }
                if (!this.minStringNote || note.string < this.minStringNote.string) {
                    this.minStringNote = note;
                }
                if (!this.maxStringNote || note.string > this.maxStringNote.string) {
                    this.maxStringNote = note;
                }
                if (note.hasEffectSlur) {
                    isEffectSlurBeat = true;
                }
            }
        }
        if (isEffectSlurBeat) {
            if (this.effectSlurOrigin) {
                this.effectSlurOrigin.effectSlurDestination = this.nextBeat;
                if (this.effectSlurOrigin.effectSlurDestination) {
                    this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                }
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = this.nextBeat;
                if (this.effectSlurDestination) {
                    this.effectSlurDestination.effectSlurOrigin = this;
                }
            }
        }
        if (this.notes.length > 0 && visibleNotes === 0) {
            this.isEmpty = true;
        }
        // we need to clean al letring/palmmute flags for rests
        // in case the effect is not continued on this beat
        if (!this.isRest && (!this.isLetRing || !this.isPalmMute)) {
            let currentBeat = this.previousBeat;
            while (currentBeat && currentBeat.isRest) {
                if (!this.isLetRing) {
                    currentBeat.isLetRing = false;
                }
                if (!this.isPalmMute) {
                    currentBeat.isPalmMute = false;
                }
                currentBeat = currentBeat.previousBeat;
            }
        }
        else if (this.isRest &&
            this.previousBeat &&
            settings &&
            settings.notation.notationMode === NotationMode.GuitarPro) {
            if (this.previousBeat.isLetRing) {
                this.isLetRing = true;
            }
            if (this.previousBeat.isPalmMute) {
                this.isPalmMute = true;
            }
        }
        // try to detect what kind of bend was used and cleans unneeded points if required
        // Guitar Pro 6 and above (gpif.xml) uses exactly 4 points to define all whammys
        if (this.whammyBarPoints.length > 0 && this.whammyBarType === WhammyType.Custom) {
            if (displayMode === NotationMode.SongBook) {
                this.whammyStyle = isGradual ? BendStyle.Gradual : BendStyle.Fast;
            }
            let isContinuedWhammy = !!this.previousBeat && this.previousBeat.hasWhammyBar;
            this.isContinuedWhammy = isContinuedWhammy;
            if (this.whammyBarPoints.length === 4) {
                let origin = this.whammyBarPoints[0];
                let middle1 = this.whammyBarPoints[1];
                let middle2 = this.whammyBarPoints[2];
                let destination = this.whammyBarPoints[3];
                // the middle points are used for holds, anything else is a new feature we do not support yet
                if (middle1.value === middle2.value) {
                    // constant decrease or increase
                    if ((origin.value < middle1.value && middle1.value < destination.value) ||
                        (origin.value > middle1.value && middle1.value > destination.value)) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.PrediveDive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Dive;
                        }
                        this.whammyBarPoints.splice(2, 1);
                        this.whammyBarPoints.splice(1, 1);
                    }
                    else if ((origin.value > middle1.value && middle1.value < destination.value) ||
                        (origin.value < middle1.value && middle1.value > destination.value)) {
                        this.whammyBarType = WhammyType.Dip;
                        if (middle1.offset === middle2.offset || displayMode === NotationMode.SongBook) {
                            this.whammyBarPoints.splice(2, 1);
                        }
                    }
                    else if (origin.value === middle1.value && middle1.value === destination.value) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.Predive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Hold;
                        }
                        this.whammyBarPoints.splice(2, 1);
                        this.whammyBarPoints.splice(1, 1);
                    }
                    else {
                        Logger.warning('Model', 'Unsupported whammy type detected, fallback to custom', null);
                    }
                }
                else {
                    Logger.warning('Model', 'Unsupported whammy type detected, fallback to custom', null);
                }
            }
        }
        this.updateDurations();
        if (needCopyBeatForBend) {
            // if this beat is a simple bend convert it to a grace beat
            // and generate a placeholder beat with tied notes
            let cloneBeat = BeatCloner.clone(this);
            cloneBeat.id = Beat._globalBeatId++;
            cloneBeat.pickStroke = PickStroke.None;
            for (let i = 0, j = cloneBeat.notes.length; i < j; i++) {
                let cloneNote = cloneBeat.notes[i];
                let note = this.notes[i];
                // remove bend on cloned note
                cloneNote.bendType = BendType.None;
                cloneNote.maxBendPoint = null;
                cloneNote.bendPoints = [];
                cloneNote.bendStyle = BendStyle.Default;
                cloneNote.id = Note.GlobalNoteId++;
                // fix ties
                if (note.isTieOrigin) {
                    cloneNote.tieDestinationNoteId = note.tieDestination.id;
                    note.tieDestination.tieOriginNoteId = cloneNote.id;
                }
                if (note.isTieDestination) {
                    cloneNote.tieOriginNoteId = note.tieOrigin ? note.tieOrigin.id : -1;
                    note.tieOrigin.tieDestinationNoteId = cloneNote.id;
                }
                // if the note has a bend which is continued on the next note
                // we need to convert this note into a hold bend
                if (note.hasBend && note.isTieOrigin) {
                    let tieDestination = Note.findTieOrigin(note);
                    if (tieDestination && tieDestination.hasBend) {
                        cloneNote.bendType = BendType.Hold;
                        let lastPoint = note.bendPoints[note.bendPoints.length - 1];
                        cloneNote.addBendPoint(new BendPoint(0, lastPoint.value));
                        cloneNote.addBendPoint(new BendPoint(BendPoint.MaxPosition, lastPoint.value));
                    }
                }
                // mark as tied note
                cloneNote.isTieDestination = true;
            }
            this.graceType = GraceType.BendGrace;
            this.graceGroup = new GraceGroup();
            this.graceGroup.addBeat(this);
            this.graceGroup.isComplete = true;
            this.graceGroup.finish();
            this.updateDurations();
            this.voice.insertBeat(this, cloneBeat);
            // ensure cloned beat has also a grace simple grace group for itself
            // (see Voice.finish where every beat gets one)
            // this ensures later that grace rods are assigned correctly to this beat. 
            cloneBeat.graceGroup = new GraceGroup();
            cloneBeat.graceGroup.addBeat(this);
            cloneBeat.graceGroup.isComplete = true;
            cloneBeat.graceGroup.finish();
        }
    }
    /**
     * Checks whether the current beat is timewise before the given beat.
     * @param beat
     * @returns
     */
    isBefore(beat) {
        return (this.voice.bar.index < beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index < beat.index));
    }
    /**
     * Checks whether the current beat is timewise after the given beat.
     * @param beat
     * @returns
     */
    isAfter(beat) {
        return (this.voice.bar.index > beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index > beat.index));
    }
    hasNoteOnString(noteString) {
        return this.noteStringLookup.has(noteString);
    }
    getNoteWithRealValue(noteRealValue) {
        if (this.noteValueLookup.has(noteRealValue)) {
            return this.noteValueLookup.get(noteRealValue);
        }
        return null;
    }
    chain() {
        for (const n of this.notes) {
            this.noteValueLookup.set(n.realValue, n);
            n.chain();
        }
    }
}
Beat._globalBeatId = 0;
//# sourceMappingURL=Beat.js.map
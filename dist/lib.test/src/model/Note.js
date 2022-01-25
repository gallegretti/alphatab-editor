import { AccentuationType } from '@src/model/AccentuationType';
import { BendStyle } from '@src/model/BendStyle';
import { BendType } from '@src/model/BendType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { Fingers } from '@src/model/Fingers';
import { HarmonicType } from '@src/model/HarmonicType';
import { NoteAccidentalMode } from '@src/model/NoteAccidentalMode';
import { Ottavia } from '@src/model/Ottavia';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { VibratoType } from '@src/model/VibratoType';
import { NotationMode } from '@src/NotationSettings';
import { Lazy } from '@src/util/Lazy';
import { Logger } from '@src/Logger';
import { ModelUtils } from '@src/model/ModelUtils';
import { PickStroke } from './PickStroke';
import { PercussionMapper } from '@src/model/PercussionMapper';
/**
 * A note is a single played sound on a fretted instrument.
 * It consists of a fret offset and a string on which the note is played on.
 * It also can be modified by a lot of different effects.
 * @cloneable
 * @json
 */
export class Note {
    constructor() {
        /**
         * Gets or sets the unique id of this note.
         * @clone_ignore
         */
        this.id = Note.GlobalNoteId++;
        /**
         * Gets or sets the zero-based index of this note within the beat.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets the accentuation of this note.
         */
        this.accentuated = AccentuationType.None;
        /**
         * Gets or sets the bend type for this note.
         */
        this.bendType = BendType.None;
        /**
         * Gets or sets the bend style for this note.
         */
        this.bendStyle = BendStyle.Default;
        /**
         * Gets or sets the note from which this note continues the bend.
         * @clone_ignore
         * @json_ignore
         */
        this.bendOrigin = null;
        /**
         * Gets or sets whether this note continues a bend from a previous note.
         */
        this.isContinuedBend = false;
        /**
         * Gets or sets a list of the points defining the bend behavior.
         * @clone_add addBendPoint
         * @json_add addBendPoint
         */
        this.bendPoints = [];
        /**
         * Gets or sets the bend point with the highest bend value.
         * @clone_ignore
         * @json_ignore
         */
        this.maxBendPoint = null;
        /**
         * Gets or sets the fret on which this note is played on the instrument.
         */
        this.fret = -1;
        /**
         * Gets or sets the string number where the note is placed.
         * 1 is the lowest string on the guitar and the bottom line on the tablature.
         * It then increases the the number of strings on available on the track.
         */
        this.string = -1;
        /**
         * Gets or sets the octave on which this note is played.
         */
        this.octave = -1;
        /**
         * Gets or sets the tone of this note within the octave.
         */
        this.tone = -1;
        /**
         * Gets or sets the index of percussion articulation in the related `track.percussionArticulations`.
         * If the articulation is not listed in `track.percussionArticulations` the following list based on GP7 applies:
         * - 029 Ride (choke)
         * - 030 Cymbal (hit)
         * - 031 Snare (side stick)
         * - 033 Snare (side stick)
         * - 034 Snare (hit)
         * - 035 Kick (hit)
         * - 036 Kick (hit)
         * - 037 Snare (side stick)
         * - 038 Snare (hit)
         * - 039 Hand Clap (hit)
         * - 040 Snare (hit)
         * - 041 Low Floor Tom (hit)
         * - 042 Hi-Hat (closed)
         * - 043 Very Low Tom (hit)
         * - 044 Pedal Hi-Hat (hit)
         * - 045 Low Tom (hit)
         * - 046 Hi-Hat (open)
         * - 047 Mid Tom (hit)
         * - 048 High Tom (hit)
         * - 049 Crash high (hit)
         * - 050 High Floor Tom (hit)
         * - 051 Ride (middle)
         * - 052 China (hit)
         * - 053 Ride (bell)
         * - 054 Tambourine (hit)
         * - 055 Splash (hit)
         * - 056 Cowbell medium (hit)
         * - 057 Crash medium (hit)
         * - 058 Vibraslap (hit)
         * - 059 Ride (edge)
         * - 060 Hand (hit)
         * - 061 Hand (hit)
         * - 062 Conga high (mute)
         * - 063 Conga high (hit)
         * - 064 Conga low (hit)
         * - 065 Timbale high (hit)
         * - 066 Timbale low (hit)
         * - 067 Agogo high (hit)
         * - 068 Agogo tow (hit)
         * - 069 Cabasa (hit)
         * - 070 Left Maraca (hit)
         * - 071 Whistle high (hit)
         * - 072 Whistle low (hit)
         * - 073 Guiro (hit)
         * - 074 Guiro (scrap-return)
         * - 075 Claves (hit)
         * - 076 Woodblock high (hit)
         * - 077 Woodblock low (hit)
         * - 078 Cuica (mute)
         * - 079 Cuica (open)
         * - 080 Triangle (rnute)
         * - 081 Triangle (hit)
         * - 082 Shaker (hit)
         * - 083 Tinkle Bell (hat)
         * - 083 Jingle Bell (hit)
         * - 084 Bell Tree (hit)
         * - 085 Castanets (hit)
         * - 086 Surdo (hit)
         * - 087 Surdo (mute)
         * - 091 Snare (rim shot)
         * - 092 Hi-Hat (half)
         * - 093 Ride (edge)
         * - 094 Ride (choke)
         * - 095 Splash (choke)
         * - 096 China (choke)
         * - 097 Crash high (choke)
         * - 098 Crash medium (choke)
         * - 099 Cowbell low (hit)
         * - 100 Cowbell low (tip)
         * - 101 Cowbell medium (tip)
         * - 102 Cowbell high (hit)
         * - 103 Cowbell high (tip)
         * - 104 Hand (mute)
         * - 105 Hand (slap)
         * - 106 Hand (mute)
         * - 107 Hand (slap)
         * - 108 Conga low (slap)
         * - 109 Conga low (mute)
         * - 110 Conga high (slap)
         * - 111 Tambourine (return)
         * - 112 Tambourine (roll)
         * - 113 Tambourine (hand)
         * - 114 Grancassa (hit)
         * - 115 Piatti (hat)
         * - 116 Piatti (hand)
         * - 117 Cabasa (return)
         * - 118 Left Maraca (return)
         * - 119 Right Maraca (hit)
         * - 120 Right Maraca (return)
         * - 122 Shaker (return)
         * - 123 Bell Tee (return)
         * - 124 Golpe (thumb)
         * - 125 Golpe (finger)
         * - 126 Ride (middle)
         * - 127 Ride (bell)
         */
        this.percussionArticulation = -1;
        /**
         * Gets or sets whether this note is visible on the music sheet.
         */
        this.isVisible = true;
        /**
         * Gets a value indicating whether the note is left hand tapped.
         */
        this.isLeftHandTapped = false;
        /**
         * Gets or sets whether this note starts a hammeron or pulloff.
         */
        this.isHammerPullOrigin = false;
        /**
         * Gets the origin note id of the hammeron/pull-off of this note.
         */
        this.hammerPullOriginNoteId = -1;
        /**
         * Gets the destination note id of the hammeron/pull-off of this note.
         */
        this.hammerPullDestinationNoteId = -1;
        /**
         * Gets or sets whether this note finishes a slur.
         */
        this.isSlurDestination = false;
        /**
         * Gets the note id where the slur of this note starts.
         */
        this.slurOriginNoteId = -1;
        /**
         * Gets or sets the note id where the slur of this note ends.
         */
        this.slurDestinationNoteId = -1;
        /**
         * Gets or sets the harmonic type applied to this note.
         */
        this.harmonicType = HarmonicType.None;
        /**
         * Gets or sets the value defining the harmonic pitch.
         */
        this.harmonicValue = 0;
        /**
         * Gets or sets whether the note is a ghost note and shown in parenthesis. Also this will make the note a bit more silent.
         */
        this.isGhost = false;
        /**
         * Gets or sets whether this note has a let-ring effect.
         */
        this.isLetRing = false;
        /**
         * Gets or sets the destination note for the let-ring effect.
         * @clone_ignore
         * @json_ignore
         */
        this.letRingDestination = null;
        /**
         * Gets or sets whether this note has a palm-mute effect.
         */
        this.isPalmMute = false;
        /**
         * Gets or sets the destination note for the palm-mute effect.
         * @clone_ignore
         * @json_ignore
         */
        this.palmMuteDestination = null;
        /**
         * Gets or sets whether the note is shown and played as dead note.
         */
        this.isDead = false;
        /**
         * Gets or sets whether the note is played as staccato.
         */
        this.isStaccato = false;
        /**
         * Gets or sets the slide-in type this note is played with.
         */
        this.slideInType = SlideInType.None;
        /**
         * Gets or sets the slide-out type this note is played with.
         */
        this.slideOutType = SlideOutType.None;
        /**
         * Gets or sets the target note for several slide types.
         * @clone_ignore
         * @json_ignore
         */
        this.slideTarget = null;
        /**
         * Gets or sets the source note for several slide types.
         * @clone_ignore
         * @json_ignore
         */
        this.slideOrigin = null;
        /**
         * Gets or sets whether a vibrato is played on the note.
         */
        this.vibrato = VibratoType.None;
        /**
         * Gets the origin note id of the tied if this note is tied.
         */
        this.tieOriginNoteId = -1;
        /**
         * Gets the desination note id of the tie.
         */
        this.tieDestinationNoteId = -1;
        /**
         * Gets or sets whether this note is ends a tied note.
         */
        this.isTieDestination = false;
        /**
         * Gets or sets the fingers used for this note on the left hand.
         */
        this.leftHandFinger = Fingers.Unknown;
        /**
         * Gets or sets the fingers used for this note on the right hand.
         */
        this.rightHandFinger = Fingers.Unknown;
        /**
         * Gets or sets whether this note has fingering defined.
         */
        this.isFingering = false;
        /**
         * Gets or sets the target note value for the trill effect.
         */
        this.trillValue = -1;
        /**
         * Gets or sets the speed of the trill effect.
         */
        this.trillSpeed = Duration.ThirtySecond;
        /**
         * Gets or sets the percentual duration of the note relative to the overall beat duration .
         */
        this.durationPercent = 1;
        /**
         * Gets or sets how accidetnals for this note should  be handled.
         */
        this.accidentalMode = NoteAccidentalMode.Default;
        /**
         * Gets or sets the dynamics for this note.
         */
        this.dynamics = DynamicValue.F;
        /**
         * @clone_ignore
         * @json_ignore
         */
        this.isEffectSlurOrigin = false;
        /**
         * @clone_ignore
         * @json_ignore
         */
        this.hasEffectSlur = false;
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
    }
    get hasBend() {
        return this.bendType !== BendType.None;
    }
    get isStringed() {
        return this.string >= 0;
    }
    get isPiano() {
        return !this.isStringed && this.octave >= 0 && this.tone >= 0;
    }
    get isPercussion() {
        return !this.isStringed && this.percussionArticulation >= 0;
    }
    /**
     * Gets or sets the percusson element.
     * @deprecated
     */
    get element() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[0] : -1;
    }
    /**
     * Gets or sets the variation of this note.
     * @deprecated
     */
    get variation() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[1] : -1;
    }
    get isHammerPullDestination() {
        return !!this.hammerPullOrigin;
    }
    /**
     * Gets the origin of the hammeron/pulloff of this note.
     */
    get hammerPullOrigin() {
        return this.hammerPullOriginNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.hammerPullOriginNoteId);
    }
    /**
     * Gets the destination for the hammeron/pullof started by this note.
     */
    get hammerPullDestination() {
        return this.hammerPullDestinationNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.hammerPullDestinationNoteId);
    }
    get isSlurOrigin() {
        return !!this.slurDestination;
    }
    /**
     * Gets or sets the note where the slur of this note starts.
     */
    get slurOrigin() {
        return this.slurOriginNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.slurOriginNoteId);
    }
    /**
     * Gets or sets the note where the slur of this note ends.
     */
    get slurDestination() {
        return this.slurDestinationNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.slurDestinationNoteId);
    }
    get isHarmonic() {
        return this.harmonicType !== HarmonicType.None;
    }
    /**
     * Gets the origin of the tied if this note is tied.
     */
    get tieOrigin() {
        return this.tieOriginNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.tieOriginNoteId);
    }
    /**
     * Gets the desination of the tie.
     */
    get tieDestination() {
        return this.tieDestinationNoteId === -1 ? null : this.beat.voice.bar.staff.track.score.getNoteById(this.tieDestinationNoteId);
    }
    get isTieOrigin() {
        return this.tieDestinationNoteId !== -1;
    }
    get trillFret() {
        return this.trillValue - this.stringTuning;
    }
    get isTrill() {
        return this.trillValue >= 0;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    get stringTuning() {
        return this.beat.voice.bar.staff.capo + Note.getStringTuning(this.beat.voice.bar.staff, this.string);
    }
    static getStringTuning(staff, noteString) {
        if (staff.tuning.length > 0) {
            return staff.tuning[staff.tuning.length - (noteString - 1) - 1];
        }
        return 0;
    }
    get realValue() {
        let realValue = this.realValueWithoutHarmonic;
        if (this.isStringed) {
            if (this.harmonicType === HarmonicType.Natural) {
                realValue = this.harmonicPitch + this.stringTuning - this.beat.voice.bar.staff.transpositionPitch;
            }
            else {
                realValue += this.harmonicPitch;
            }
        }
        return realValue;
    }
    get realValueWithoutHarmonic() {
        if (this.isPercussion) {
            return this.percussionArticulation;
        }
        if (this.isStringed) {
            return this.fret + this.stringTuning - this.beat.voice.bar.staff.transpositionPitch;
        }
        if (this.isPiano) {
            return this.octave * 12 + this.tone - this.beat.voice.bar.staff.transpositionPitch;
        }
        return 0;
    }
    get harmonicPitch() {
        if (this.harmonicType === HarmonicType.None || !this.isStringed) {
            return 0;
        }
        let value = this.harmonicValue;
        // add semitones to reach corresponding harmonic frets
        if (ModelUtils.isAlmostEqualTo(value, 2.4)) {
            return 36;
        }
        if (ModelUtils.isAlmostEqualTo(value, 2.7)) {
            // Fret 3 2nd octave + minor seventh
            return 34;
        }
        if (value < 3) {
            // no natural harmonics below fret 3
            return 0;
        }
        if (value <= 3.5) {
            // Fret 3 2nd octave + fifth
            return 31;
        }
        if (value <= 4) {
            return 28;
        }
        if (value <= 5) {
            return 24;
        }
        if (value <= 6) {
            return 34;
        }
        if (value <= 7) {
            return 19;
        }
        if (value <= 8.5) {
            return 36;
        }
        if (value <= 9) {
            return 28;
        }
        if (value <= 10) {
            return 34;
        }
        if (value <= 11) {
            return 0;
        }
        if (value <= 12) {
            return 12;
        }
        if (value < 14) {
            // fret 13,14 stay
            return 0;
        }
        if (value <= 15) {
            return 34;
        }
        if (value <= 16) {
            return 28;
        }
        if (value <= 17) {
            return 36;
        }
        if (value <= 18) {
            return 0;
        }
        if (value <= 19) {
            return 19;
        }
        if (value <= 21) {
            //  20,21 stay
            return 0;
        }
        if (value <= 22) {
            return 36;
        }
        if (value <= 24) {
            return 24;
        }
        return 0;
    }
    get initialBendValue() {
        if (this.hasBend) {
            return Math.floor(this.bendPoints[0].value / 2);
        }
        else if (this.bendOrigin) {
            return Math.floor(this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.isTieDestination && this.tieOrigin.bendOrigin) {
            return Math.floor(this.tieOrigin.bendOrigin.bendPoints[this.tieOrigin.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.beat.hasWhammyBar) {
            return Math.floor(this.beat.whammyBarPoints[0].value / 2);
        }
        else if (this.beat.isContinuedWhammy) {
            return Math.floor(this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value / 2);
        }
        return 0;
    }
    get displayValue() {
        return this.displayValueWithoutBend + this.initialBendValue;
    }
    get displayValueWithoutBend() {
        let noteValue = this.realValue;
        if (this.harmonicType !== HarmonicType.Natural && this.harmonicType !== HarmonicType.None) {
            noteValue -= this.harmonicPitch;
        }
        switch (this.beat.ottava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        switch (this.beat.voice.bar.clefOttava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        return noteValue - this.beat.voice.bar.staff.displayTranspositionPitch;
    }
    get hasQuarterToneOffset() {
        if (this.hasBend) {
            return this.bendPoints[0].value % 2 !== 0;
        }
        if (this.bendOrigin) {
            return this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value % 2 !== 0;
        }
        if (this.beat.hasWhammyBar) {
            return this.beat.whammyBarPoints[0].value % 2 !== 0;
        }
        if (this.beat.isContinuedWhammy) {
            return (this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value %
                2 !==
                0);
        }
        return false;
    }
    addBendPoint(point) {
        this.bendPoints.push(point);
        if (!this.maxBendPoint || point.value > this.maxBendPoint.value) {
            this.maxBendPoint = point;
        }
        if (this.bendType === BendType.None) {
            this.bendType = BendType.Custom;
        }
    }
    finish(settings) {
        let nextNoteOnLine = new Lazy(() => Note.nextNoteOnSameLine(this));
        let isSongBook = settings && settings.notation.notationMode === NotationMode.SongBook;
        // connect ties
        if (this.isTieDestination) {
            this.chain();
            // implicit let ring
            if (isSongBook && this.tieOrigin && this.tieOrigin.isLetRing) {
                this.isLetRing = true;
            }
        }
        // connect letring
        if (this.isLetRing) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isLetRing) {
                this.letRingDestination = this;
            }
            else {
                this.letRingDestination = nextNoteOnLine.value;
            }
            if (isSongBook && this.isTieDestination && !this.tieOrigin.hasBend) {
                this.isVisible = false;
            }
        }
        // connect palmmute
        if (this.isPalmMute) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isPalmMute) {
                this.palmMuteDestination = this;
            }
            else {
                this.palmMuteDestination = nextNoteOnLine.value;
            }
        }
        // set hammeron/pulloffs
        if (this.isHammerPullOrigin) {
            let hammerPullDestination = Note.findHammerPullDestination(this);
            if (!hammerPullDestination) {
                this.isHammerPullOrigin = false;
            }
            else {
                this.hammerPullDestinationNoteId = hammerPullDestination.id;
                hammerPullDestination.hammerPullOriginNoteId = this.id;
            }
        }
        // set slides
        switch (this.slideOutType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                this.slideTarget = nextNoteOnLine.value;
                if (!this.slideTarget) {
                    this.slideOutType = SlideOutType.None;
                }
                else {
                    this.slideTarget.slideOrigin = this;
                }
                break;
        }
        let effectSlurDestination = null;
        if (this.isHammerPullOrigin && this.hammerPullDestination) {
            effectSlurDestination = this.hammerPullDestination;
        }
        else if (this.slideOutType === SlideOutType.Legato && this.slideTarget) {
            effectSlurDestination = this.slideTarget;
        }
        if (effectSlurDestination) {
            this.hasEffectSlur = true;
            if (this.effectSlurOrigin && this.beat.pickStroke === PickStroke.None) {
                this.effectSlurOrigin.effectSlurDestination = effectSlurDestination;
                this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = effectSlurDestination;
                this.effectSlurDestination.effectSlurOrigin = this;
            }
        }
        // try to detect what kind of bend was used and cleans unneeded points if required
        // Guitar Pro 6 and above (gpif.xml) uses exactly 4 points to define all bends
        if (this.bendPoints.length > 0 && this.bendType === BendType.Custom) {
            let isContinuedBend = this.isTieDestination && this.tieOrigin.hasBend;
            this.isContinuedBend = isContinuedBend;
            if (this.bendPoints.length === 4) {
                let origin = this.bendPoints[0];
                let middle1 = this.bendPoints[1];
                let middle2 = this.bendPoints[2];
                let destination = this.bendPoints[3];
                // the middle points are used for holds, anything else is a new feature we do not support yet
                if (middle1.value === middle2.value) {
                    // bend higher?
                    if (destination.value > origin.value) {
                        if (middle1.value > destination.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (!isContinuedBend && origin.value > 0) {
                            this.bendType = BendType.PrebendBend;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Bend;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                    }
                    else if (destination.value < origin.value) {
                        // origin must be > 0 otherwise it's no release, we cannot bend negative
                        if (isContinuedBend) {
                            this.bendType = BendType.Release;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.PrebendRelease;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                    }
                    else {
                        if (middle1.value > origin.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (origin.value > 0 && !isContinuedBend) {
                            this.bendType = BendType.Prebend;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Hold;
                            this.bendPoints.splice(2, 1);
                            this.bendPoints.splice(1, 1);
                        }
                    }
                }
                else {
                    Logger.warning('Model', 'Unsupported bend type detected, fallback to custom', null);
                }
            }
            else if (this.bendPoints.length === 2) {
                let origin = this.bendPoints[0];
                let destination = this.bendPoints[1];
                // bend higher?
                if (destination.value > origin.value) {
                    if (!isContinuedBend && origin.value > 0) {
                        this.bendType = BendType.PrebendBend;
                    }
                    else {
                        this.bendType = BendType.Bend;
                    }
                }
                else if (destination.value < origin.value) {
                    // origin must be > 0 otherwise it's no release, we cannot bend negative
                    if (isContinuedBend) {
                        this.bendType = BendType.Release;
                    }
                    else {
                        this.bendType = BendType.PrebendRelease;
                    }
                }
                else {
                    this.bendType = BendType.Hold;
                }
            }
        }
        else if (this.bendPoints.length === 0) {
            this.bendType = BendType.None;
        }
        // initial bend pitch offsets and forced accidentals don't play well together
        // we reset it
        if (this.initialBendValue > 0) {
            this.accidentalMode = NoteAccidentalMode.Default;
        }
    }
    static nextNoteOnSameLine(note) {
        let nextBeat = note.beat.nextBeat;
        // keep searching in same bar
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findHammerPullDestination(note) {
        // For Hammer-Pull destinations we have 2 potential candidates
        // 1. A note on the same string
        // 2. A note on a different string, but with a left-hand-tapping applied
        // for the second case we have a special logic to search for notes:
        // 1. We first search on lower strings, then on higher strings
        // 2. If we find a note with a left-hand-tap applied it becomes the target
        // 3. If we find a note without a left-hand-tap we stop searching in this direction
        let nextBeat = note.beat.nextBeat;
        // keep searching in same bar
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            // 1. same string first
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            // 2. search toward lower strings
            for (let str = note.string; str > 0; str--) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            // 3. search toward higher strings
            for (let str = note.string; str <= note.beat.voice.bar.staff.tuning.length; str++) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            // nothing found, search on next beat
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findTieOrigin(note) {
        let previousBeat = note.beat.previousBeat;
        // keep searching in same bar
        while (previousBeat &&
            previousBeat.voice.bar.index >= note.beat.voice.bar.index - Note.MaxOffsetForSameLineSearch) {
            if (note.isStringed) {
                let noteOnString = previousBeat.getNoteOnString(note.string);
                if (noteOnString) {
                    return noteOnString;
                }
            }
            else {
                if (note.octave === -1 && note.tone === -1) {
                    // if the note has no value (e.g. alphaTex dash tie), we try to find a matching
                    // note on the previous beat by index.
                    if (note.index < previousBeat.notes.length) {
                        return previousBeat.notes[note.index];
                    }
                }
                else {
                    let noteWithValue = previousBeat.getNoteWithRealValue(note.realValue);
                    if (noteWithValue) {
                        return noteWithValue;
                    }
                }
            }
            previousBeat = previousBeat.previousBeat;
        }
        return null;
    }
    chain() {
        this.beat.voice.bar.staff.track.score.registerNote(this);
        if (!this.isTieDestination) {
            return;
        }
        let tieOrigin;
        if (this.tieOriginNoteId === -1) {
            tieOrigin = Note.findTieOrigin(this);
            this.tieOriginNoteId = tieOrigin ? tieOrigin.id : -1;
        }
        else {
            tieOrigin = this.tieOrigin;
        }
        if (!tieOrigin) {
            this.isTieDestination = false;
        }
        else {
            tieOrigin.tieDestinationNoteId = this.id;
            this.fret = tieOrigin.fret;
            this.octave = tieOrigin.octave;
            this.tone = tieOrigin.tone;
            if (tieOrigin.hasBend) {
                this.bendOrigin = this.tieOrigin;
            }
        }
    }
}
Note.GlobalNoteId = 0;
Note.MaxOffsetForSameLineSearch = 3;
//# sourceMappingURL=Note.js.map
import { AccentuationType } from '@src/model/AccentuationType';
import { Beat } from '@src/model/Beat';
import { BendPoint } from '@src/model/BendPoint';
import { BendStyle } from '@src/model/BendStyle';
import { BendType } from '@src/model/BendType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { Fingers } from '@src/model/Fingers';
import { HarmonicType } from '@src/model/HarmonicType';
import { NoteAccidentalMode } from '@src/model/NoteAccidentalMode';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { Staff } from '@src/model/Staff';
import { VibratoType } from '@src/model/VibratoType';
import { Settings } from '@src/Settings';
/**
 * A note is a single played sound on a fretted instrument.
 * It consists of a fret offset and a string on which the note is played on.
 * It also can be modified by a lot of different effects.
 * @cloneable
 * @json
 */
export declare class Note {
    static GlobalNoteId: number;
    /**
     * Gets or sets the unique id of this note.
     * @clone_ignore
     */
    id: number;
    /**
     * Gets or sets the zero-based index of this note within the beat.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the accentuation of this note.
     */
    accentuated: AccentuationType;
    /**
     * Gets or sets the bend type for this note.
     */
    bendType: BendType;
    /**
     * Gets or sets the bend style for this note.
     */
    bendStyle: BendStyle;
    /**
     * Gets or sets the note from which this note continues the bend.
     * @clone_ignore
     * @json_ignore
     */
    bendOrigin: Note | null;
    /**
     * Gets or sets whether this note continues a bend from a previous note.
     */
    isContinuedBend: boolean;
    /**
     * Gets or sets a list of the points defining the bend behavior.
     * @clone_add addBendPoint
     * @json_add addBendPoint
     */
    bendPoints: BendPoint[];
    /**
     * Gets or sets the bend point with the highest bend value.
     * @clone_ignore
     * @json_ignore
     */
    maxBendPoint: BendPoint | null;
    get hasBend(): boolean;
    get isStringed(): boolean;
    /**
     * Gets or sets the fret on which this note is played on the instrument.
     */
    fret: number;
    /**
     * Gets or sets the string number where the note is placed.
     * 1 is the lowest string on the guitar and the bottom line on the tablature.
     * It then increases the the number of strings on available on the track.
     */
    string: number;
    get isPiano(): boolean;
    /**
     * Gets or sets the octave on which this note is played.
     */
    octave: number;
    /**
     * Gets or sets the tone of this note within the octave.
     */
    tone: number;
    get isPercussion(): boolean;
    /**
     * Gets or sets the percusson element.
     * @deprecated
     */
    get element(): number;
    /**
     * Gets or sets the variation of this note.
     * @deprecated
     */
    get variation(): number;
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
    percussionArticulation: number;
    /**
     * Gets or sets whether this note is visible on the music sheet.
     */
    isVisible: boolean;
    /**
     * Gets a value indicating whether the note is left hand tapped.
     */
    isLeftHandTapped: boolean;
    /**
     * Gets or sets whether this note starts a hammeron or pulloff.
     */
    isHammerPullOrigin: boolean;
    get isHammerPullDestination(): boolean;
    /**
     * Gets the origin note id of the hammeron/pull-off of this note.
     */
    hammerPullOriginNoteId: number;
    /**
     * Gets the origin of the hammeron/pulloff of this note.
     */
    get hammerPullOrigin(): Note | null;
    /**
     * Gets the destination note id of the hammeron/pull-off of this note.
     */
    hammerPullDestinationNoteId: number;
    /**
     * Gets the destination for the hammeron/pullof started by this note.
     */
    get hammerPullDestination(): Note | null;
    get isSlurOrigin(): boolean;
    /**
     * Gets or sets whether this note finishes a slur.
     */
    isSlurDestination: boolean;
    /**
     * Gets the note id where the slur of this note starts.
     */
    slurOriginNoteId: number;
    /**
     * Gets or sets the note where the slur of this note starts.
     */
    get slurOrigin(): Note | null;
    /**
     * Gets or sets the note id where the slur of this note ends.
     */
    slurDestinationNoteId: number;
    /**
     * Gets or sets the note where the slur of this note ends.
     */
    get slurDestination(): Note | null;
    get isHarmonic(): boolean;
    /**
     * Gets or sets the harmonic type applied to this note.
     */
    harmonicType: HarmonicType;
    /**
     * Gets or sets the value defining the harmonic pitch.
     */
    harmonicValue: number;
    /**
     * Gets or sets whether the note is a ghost note and shown in parenthesis. Also this will make the note a bit more silent.
     */
    isGhost: boolean;
    /**
     * Gets or sets whether this note has a let-ring effect.
     */
    isLetRing: boolean;
    /**
     * Gets or sets the destination note for the let-ring effect.
     * @clone_ignore
     * @json_ignore
     */
    letRingDestination: Note | null;
    /**
     * Gets or sets whether this note has a palm-mute effect.
     */
    isPalmMute: boolean;
    /**
     * Gets or sets the destination note for the palm-mute effect.
     * @clone_ignore
     * @json_ignore
     */
    palmMuteDestination: Note | null;
    /**
     * Gets or sets whether the note is shown and played as dead note.
     */
    isDead: boolean;
    /**
     * Gets or sets whether the note is played as staccato.
     */
    isStaccato: boolean;
    /**
     * Gets or sets the slide-in type this note is played with.
     */
    slideInType: SlideInType;
    /**
     * Gets or sets the slide-out type this note is played with.
     */
    slideOutType: SlideOutType;
    /**
     * Gets or sets the target note for several slide types.
     * @clone_ignore
     * @json_ignore
     */
    slideTarget: Note | null;
    /**
     * Gets or sets the source note for several slide types.
     * @clone_ignore
     * @json_ignore
     */
    slideOrigin: Note | null;
    /**
     * Gets or sets whether a vibrato is played on the note.
     */
    vibrato: VibratoType;
    /**
     * Gets the origin note id of the tied if this note is tied.
     */
    tieOriginNoteId: number;
    /**
     * Gets the origin of the tied if this note is tied.
     */
    get tieOrigin(): Note | null;
    /**
     * Gets the desination note id of the tie.
     */
    tieDestinationNoteId: number;
    /**
     * Gets the desination of the tie.
     */
    get tieDestination(): Note | null;
    /**
     * Gets or sets whether this note is ends a tied note.
     */
    isTieDestination: boolean;
    get isTieOrigin(): boolean;
    /**
     * Gets or sets the fingers used for this note on the left hand.
     */
    leftHandFinger: Fingers;
    /**
     * Gets or sets the fingers used for this note on the right hand.
     */
    rightHandFinger: Fingers;
    /**
     * Gets or sets whether this note has fingering defined.
     */
    isFingering: boolean;
    /**
     * Gets or sets the target note value for the trill effect.
     */
    trillValue: number;
    get trillFret(): number;
    get isTrill(): boolean;
    /**
     * Gets or sets the speed of the trill effect.
     */
    trillSpeed: Duration;
    /**
     * Gets or sets the percentual duration of the note relative to the overall beat duration .
     */
    durationPercent: number;
    /**
     * Gets or sets how accidetnals for this note should  be handled.
     */
    accidentalMode: NoteAccidentalMode;
    /**
     * Gets or sets the reference to the parent beat to which this note belongs to.
     * @clone_ignore
     * @json_ignore
     */
    beat: Beat;
    /**
     * Gets or sets the dynamics for this note.
     */
    dynamics: DynamicValue;
    /**
     * @clone_ignore
     * @json_ignore
     */
    isEffectSlurOrigin: boolean;
    /**
     * @clone_ignore
     * @json_ignore
     */
    hasEffectSlur: boolean;
    get isEffectSlurDestination(): boolean;
    /**
     * @clone_ignore
     * @json_ignore
     */
    effectSlurOrigin: Note | null;
    /**
     * @clone_ignore
     * @json_ignore
     */
    effectSlurDestination: Note | null;
    get stringTuning(): number;
    static getStringTuning(staff: Staff, noteString: number): number;
    get realValue(): number;
    get realValueWithoutHarmonic(): number;
    get harmonicPitch(): number;
    get initialBendValue(): number;
    get displayValue(): number;
    get displayValueWithoutBend(): number;
    get hasQuarterToneOffset(): boolean;
    addBendPoint(point: BendPoint): void;
    finish(settings: Settings): void;
    private static readonly MaxOffsetForSameLineSearch;
    static nextNoteOnSameLine(note: Note): Note | null;
    static findHammerPullDestination(note: Note): Note | null;
    static findTieOrigin(note: Note): Note | null;
    chain(): void;
}

import { Automation, AutomationType } from '@src/model/Automation';
import { BendPoint } from '@src/model/BendPoint';
import { BendStyle } from '@src/model/BendStyle';
import { BrushType } from '@src/model/BrushType';
import { Chord } from '@src/model/Chord';
import { CrescendoType } from '@src/model/CrescendoType';
import { Duration } from '@src/model/Duration';
import { DynamicValue } from '@src/model/DynamicValue';
import { Fermata } from '@src/model/Fermata';
import { GraceType } from '@src/model/GraceType';
import { Note } from '@src/model/Note';
import { Ottavia } from '@src/model/Ottavia';
import { PickStroke } from '@src/model/PickStroke';
import { TupletGroup } from '@src/model/TupletGroup';
import { VibratoType } from '@src/model/VibratoType';
import { Voice } from '@src/model/Voice';
import { WhammyType } from '@src/model/WhammyType';
import { Settings } from '@src/Settings';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { GraceGroup } from './GraceGroup';
/**
 * Lists the different modes on how beaming for a beat should be done.
 */
export declare enum BeatBeamingMode {
    /**
     * Automatic beaming based on the timing rules.
     */
    Auto = 0,
    /**
     * Force a split to the next beat.
     */
    ForceSplitToNext = 1,
    /**
     * Force a merge with the next beat.
     */
    ForceMergeWithNext = 2
}
/**
 * A beat is a single block within a bar. A beat is a combination
 * of several notes played at the same time.
 * @json
 * @cloneable
 */
export declare class Beat {
    private static _globalBeatId;
    /**
     * Gets or sets the unique id of this beat.
     * @clone_ignore
     */
    id: number;
    /**
     * Gets or sets the zero-based index of this beat within the voice.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the previous beat within the whole song.
     * @json_ignore
     * @clone_ignore
     */
    previousBeat: Beat | null;
    /**
     * Gets or sets the next beat within the whole song.
     * @json_ignore
     * @clone_ignore
     */
    nextBeat: Beat | null;
    get isLastOfVoice(): boolean;
    /**
     * Gets or sets the reference to the parent voice this beat belongs to.
     * @json_ignore
     * @clone_ignore
     */
    voice: Voice;
    /**
     * Gets or sets the list of notes contained in this beat.
     * @json_add addNote
     * @clone_add addNote
     */
    notes: Note[];
    /**
     * Gets the lookup where the notes per string are registered.
     * If this staff contains string based notes this lookup allows fast access.
     * @json_ignore
     */
    readonly noteStringLookup: Map<number, Note>;
    /**
     * Gets the lookup where the notes per value are registered.
     * If this staff contains string based notes this lookup allows fast access.
     * @json_ignore
     */
    readonly noteValueLookup: Map<number, Note>;
    /**
     * Gets or sets a value indicating whether this beat is considered empty.
     */
    isEmpty: boolean;
    /**
     * Gets or sets which whammy bar style should be used for this bar.
     */
    whammyStyle: BendStyle;
    /**
     * Gets or sets the ottava applied to this beat.
     */
    ottava: Ottavia;
    /**
     * Gets or sets the fermata applied to this beat.
     * @clone_ignore
     * @json_ignore
     */
    fermata: Fermata | null;
    /**
     * Gets a value indicating whether this beat starts a legato slur.
     */
    isLegatoOrigin: boolean;
    get isLegatoDestination(): boolean;
    /**
     * Gets or sets the note with the lowest pitch in this beat. Only visible notes are considered.
     * @json_ignore
     * @clone_ignore
     */
    minNote: Note | null;
    /**
     * Gets or sets the note with the highest pitch in this beat. Only visible notes are considered.
     * @json_ignore
     * @clone_ignore
     */
    maxNote: Note | null;
    /**
     * Gets or sets the note with the highest string number in this beat. Only visible notes are considered.
     * @json_ignore
     * @clone_ignore
     */
    maxStringNote: Note | null;
    /**
     * Gets or sets the note with the lowest string number in this beat. Only visible notes are considered.
     * @json_ignore
     * @clone_ignore
     */
    minStringNote: Note | null;
    /**
     * Gets or sets the duration of this beat.
     */
    duration: Duration;
    get isRest(): boolean;
    /**
     * Gets a value indicating whether this beat is a full bar rest.
     */
    get isFullBarRest(): boolean;
    /**
     * Gets or sets whether any note in this beat has a let-ring applied.
     * @json_ignore
     */
    isLetRing: boolean;
    /**
     * Gets or sets whether any note in this beat has a palm-mute paplied.
     * @json_ignore
     */
    isPalmMute: boolean;
    /**
     * Gets or sets a list of all automations on this beat.
     */
    automations: Automation[];
    /**
     * Gets or sets the number of dots applied to the duration of this beat.
     */
    dots: number;
    /**
     * Gets or sets a value indicating whether this beat is fade-in.
     */
    fadeIn: boolean;
    /**
     * Gets or sets the lyrics shown on this beat.
     */
    lyrics: string[] | null;
    /**
     * Gets or sets a value indicating whether the beat is played in rasgueado style.
     */
    hasRasgueado: boolean;
    /**
     * Gets or sets a value indicating whether the notes on this beat are played with a pop-style (bass).
     */
    pop: boolean;
    /**
     * Gets or sets a value indicating whether the notes on this beat are played with a slap-style (bass).
     */
    slap: boolean;
    /**
     * Gets or sets a value indicating whether the notes on this beat are played with a tap-style (bass).
     */
    tap: boolean;
    /**
     * Gets or sets the text annotation shown on this beat.
     */
    text: string | null;
    /**
     * Gets or sets the brush type applied to the notes of this beat.
     */
    brushType: BrushType;
    /**
     * Gets or sets the duration of the brush between the notes in midi ticks.
     */
    brushDuration: number;
    /**
     * Gets or sets the tuplet denominator.
     */
    tupletDenominator: number;
    /**
     * Gets or sets the tuplet numerator.
     */
    tupletNumerator: number;
    get hasTuplet(): boolean;
    /**
     * @clone_ignore
     * @json_ignore
     */
    tupletGroup: TupletGroup | null;
    /**
     * Gets or sets whether this beat continues a whammy effect.
     */
    isContinuedWhammy: boolean;
    /**
     * Gets or sets the whammy bar style of this beat.
     */
    whammyBarType: WhammyType;
    /**
     * Gets or sets the points defining the whammy bar usage.
     * @json_add addWhammyBarPoint
     * @clone_add addWhammyBarPoint
     */
    whammyBarPoints: BendPoint[];
    /**
     * Gets or sets the highest point with for the highest whammy bar value.
     * @json_ignore
     * @clone_ignore
     */
    maxWhammyPoint: BendPoint | null;
    /**
     * Gets or sets the highest point with for the lowest whammy bar value.
     * @json_ignore
     * @clone_ignore
     */
    minWhammyPoint: BendPoint | null;
    get hasWhammyBar(): boolean;
    /**
     * Gets or sets the vibrato effect used on this beat.
     */
    vibrato: VibratoType;
    /**
     * Gets or sets the ID of the chord used on this beat.
     */
    chordId: string | null;
    get hasChord(): boolean;
    get chord(): Chord | null;
    /**
     * Gets or sets the grace style of this beat.
     */
    graceType: GraceType;
    /**
     * Gets or sets the grace group this beat belongs to.
     * If this beat is not a grace note, it holds the group which belongs to this beat.
     * @json_ignore
     * @clone_ignore
     */
    graceGroup: GraceGroup | null;
    /**
     * Gets or sets the index of this beat within the grace group if
     * this is a grace beat.
     * @json_ignore
     * @clone_ignore
     */
    graceIndex: number;
    /**
     * Gets or sets the pickstroke applied on this beat.
     */
    pickStroke: PickStroke;
    get isTremolo(): boolean;
    /**
     * Gets or sets the speed of the tremolo effect.
     */
    tremoloSpeed: Duration | null;
    /**
     * Gets or sets whether a crescendo/decrescendo is applied on this beat.
     */
    crescendo: CrescendoType;
    /**
     * The timeline position of the voice within the current bar as it is displayed. (unit: midi ticks)
     * This might differ from the actual playback time due to special grace types.
     */
    displayStart: number;
    /**
     * The timeline position of the voice within the current bar as it is played. (unit: midi ticks)
     * This might differ from the actual playback time due to special grace types.
     */
    playbackStart: number;
    /**
     * Gets or sets the duration that is used for the display of this beat. It defines the size/width of the beat in
     * the music sheet. (unit: midi ticks).
     */
    displayDuration: number;
    /**
     * Gets or sets the duration that the note is played during the audio generation.
     */
    playbackDuration: number;
    get absoluteDisplayStart(): number;
    get absolutePlaybackStart(): number;
    /**
     * Gets or sets the dynamics applied to this beat.
     */
    dynamics: DynamicValue;
    /**
     * Gets or sets a value indicating whether the beam direction should be inverted.
     */
    invertBeamDirection: boolean;
    /**
     * Gets or sets the preferred beam direction as specified in the input source.
     */
    preferredBeamDirection: BeamDirection | null;
    /**
     * @json_ignore
     */
    isEffectSlurOrigin: boolean;
    get isEffectSlurDestination(): boolean;
    /**
     * @clone_ignore
     * @json_ignore
     */
    effectSlurOrigin: Beat | null;
    /**
     * @clone_ignore
     * @json_ignore
     */
    effectSlurDestination: Beat | null;
    /**
     * Gets or sets how the beaming should be done for this beat.
     */
    beamingMode: BeatBeamingMode;
    addWhammyBarPoint(point: BendPoint): void;
    removeWhammyBarPoint(index: number): void;
    addNote(note: Note): void;
    removeNote(note: Note): void;
    getAutomation(type: AutomationType): Automation | null;
    getNoteOnString(noteString: number): Note | null;
    private calculateDuration;
    updateDurations(): void;
    finishTuplet(): void;
    finish(settings: Settings): void;
    /**
     * Checks whether the current beat is timewise before the given beat.
     * @param beat
     * @returns
     */
    isBefore(beat: Beat): boolean;
    /**
     * Checks whether the current beat is timewise after the given beat.
     * @param beat
     * @returns
     */
    isAfter(beat: Beat): boolean;
    hasNoteOnString(noteString: number): boolean;
    getNoteWithRealValue(noteRealValue: number): Note | null;
    chain(): void;
}

import { IMidiFileHandler } from '@src/midi/IMidiFileHandler';
import { MidiTickLookup } from '@src/midi/MidiTickLookup';
import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { Score } from '@src/model/Score';
import { Settings } from '@src/Settings';
export declare class MidiNoteDuration {
    noteOnly: number;
    untilTieOrSlideEnd: number;
    letRingEnd: number;
}
/**
 * This generator creates a midi file using a score.
 */
export declare class MidiFileGenerator {
    private static readonly DefaultDurationDead;
    private static readonly DefaultDurationPalmMute;
    private readonly _score;
    private _settings;
    private _handler;
    private _currentTempo;
    private _currentBarRepeatLookup;
    private _programsPerChannel;
    /**
     * Gets a lookup object which can be used to quickly find beats and bars
     * at a given midi tick position.
     */
    readonly tickLookup: MidiTickLookup;
    /**
     * Initializes a new instance of the {@link MidiFileGenerator} class.
     * @param score The score for which the midi file should be generated.
     * @param settings The settings ot use for generation.
     * @param handler The handler that should be used for generating midi events.
     */
    constructor(score: Score, settings: Settings | null, handler: IMidiFileHandler);
    /**
     * Starts the generation of the midi file.
     */
    generate(): void;
    private generateTrack;
    private addProgramChange;
    private generateChannel;
    private static toChannelShort;
    private generateMasterBar;
    private generateBar;
    private getPlaybackBar;
    private generateVoice;
    private _currentTripletFeel;
    private generateBeat;
    private static calculateTripletFeelInfo;
    private generateNote;
    private getNoteDuration;
    private applyStaticDuration;
    private static getDynamicValue;
    private generateFadeIn;
    private generateVibrato;
    private generateVibratorWithParams;
    /**
     * Maximum semitones that are supported in bends in one direction (up or down)
     * GP has 8 full tones on whammys.
     */
    private static readonly PitchBendRangeInSemitones;
    /**
     * The value on how many pitch-values are used for one semitone
     */
    private static readonly PitchValuePerSemitone;
    /**
     * The minimum number of breakpoints generated per semitone bend.
     */
    private static readonly MinBreakpointsPerSemitone;
    /**
     * How long until a new breakpoint is generated for a bend.
     */
    private static readonly MillisecondsPerBreakpoint;
    /**
     * Calculates the midi pitch wheel value for the give bend value.
     */
    static getPitchWheel(bendValue: number): number;
    private generateSlide;
    private generateBend;
    private generateSongBookWhammyOrBend;
    private generateWhammy;
    private generateWhammyOrBend;
    private generateBendValues;
    private generateTrill;
    private generateTremoloPicking;
    private getBrushInfo;
    private generateAutomation;
    prepareSingleBeat(beat: Beat): void;
    generateSingleBeat(beat: Beat): void;
    generateSingleNote(note: Note): void;
}

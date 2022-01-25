import { MidiFile } from '@src/midi/MidiFile';
import { IAlphaSynth } from '@src/synth/IAlphaSynth';
import { PlaybackRange } from '@src/synth/PlaybackRange';
import { PlayerState } from '@src/synth/PlayerState';
import { PlayerStateChangedEventArgs } from '@src/synth/PlayerStateChangedEventArgs';
import { PositionChangedEventArgs } from '@src/synth/PositionChangedEventArgs';
import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
import { Beat } from '@src/model/Beat';
import { Score } from '@src/model/Score';
import { Track } from '@src/model/Track';
import { IContainer } from '@src/platform/IContainer';
import { IUiFacade } from '@src/platform/IUiFacade';
import { IScoreRenderer } from '@src/rendering/IScoreRenderer';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { ResizeEventArgs } from '@src/ResizeEventArgs';
import { Settings } from '@src/Settings';
import { Note } from './model/Note';
import { MidiEventType } from './midi/MidiEvent';
import { MidiEventsPlayedEventArgs } from './synth/MidiEventsPlayedEventArgs';
/**
 * This class represents the public API of alphaTab and provides all logic to display
 * a music sheet in any UI using the given {@link IUiFacade}
 * @param <TSettings> The UI object holding the settings.
 * @csharp_public
 */
export declare class AlphaTabApiBase<TSettings> {
    private _startTime;
    private _trackIndexes;
    private _isDestroyed;
    /**
     * Gets the UI facade to use for interacting with the user interface.
     */
    readonly uiFacade: IUiFacade<TSettings>;
    /**
     * Gets the UI container that holds the whole alphaTab control.
     */
    readonly container: IContainer;
    /**
     * Gets the score renderer used for rendering the music sheet. This is the low-level API responsible for the actual rendering chain.
     */
    readonly renderer: IScoreRenderer;
    /**
     * Gets the score holding all information about the song being rendered.
     */
    score: Score | null;
    /**
     * Gets the settings that are used for rendering the music notation.
     */
    settings: Settings;
    /**
     * Gets a list of the tracks that are currently rendered;
     */
    tracks: Track[];
    /**
     * Gets the UI container that will hold all rendered results.
     */
    readonly canvasElement: IContainer;
    /**
     * Initializes a new instance of the {@link AlphaTabApiBase} class.
     * @param uiFacade The UI facade to use for interacting with the user interface.
     * @param settings The UI settings object to use for loading the settings.
     */
    constructor(uiFacade: IUiFacade<TSettings>, settings: TSettings);
    /**
     * Destroys the alphaTab control and restores the initial state of the UI.
     */
    destroy(): void;
    /**
     * Applies any changes that were done to the settings object and informs the {@link renderer} about any new values to consider.
     */
    updateSettings(): void;
    /**
     * Attempts a load of the score represented by the given data object.
     * @param scoreData The data container supported by {@link IUiFacade}
     * @param trackIndexes The indexes of the tracks from the song that should be rendered. If not provided, the first track of the
     * song will be shown.
     * @returns true if the data object is supported and a load was initiated, otherwise false
     */
    load(scoreData: unknown, trackIndexes?: number[]): boolean;
    /**
     * Initiates a rendering of the given score.
     * @param score The score containing the tracks to be rendered.
     * @param trackIndexes The indexes of the tracks from the song that should be rendered. If not provided, the first track of the
     * song will be shown.
     */
    renderScore(score: Score, trackIndexes?: number[]): void;
    /**
     * Renders the given list of tracks.
     * @param tracks The tracks to render. They must all belong to the same score.
     */
    renderTracks(tracks: Track[]): void;
    private internalRenderTracks;
    /**
     * @internal
     */
    private triggerResize;
    private appendRenderResult;
    /**
     * Tells alphaTab to render the given alphaTex.
     * @param tex The alphaTex code to render.
     * @param tracks If set, the given tracks will be rendered, otherwise the first track only will be rendered.
     */
    tex(tex: string, tracks?: number[]): void;
    /**
     * Attempts a load of the score represented by the given data object.
     * @param data The data object to decode
     * @param append Whether to fully replace or append the data from the given soundfont.
     * @returns true if the data object is supported and a load was initiated, otherwise false
     */
    loadSoundFont(data: unknown, append?: boolean): boolean;
    /**
     * Resets all loaded soundfonts as if they were not loaded.
     */
    resetSoundFonts(): void;
    /**
     * Initiates a re-rendering of the current setup. If rendering is not yet possible, it will be deferred until the UI changes to be ready for rendering.
     */
    render(): void;
    private _tickCache;
    /**
     * Gets the alphaSynth player used for playback. This is the low-level API to the Midi synthesizer used for playback.
     */
    player: IAlphaSynth | null;
    get isReadyForPlayback(): boolean;
    get playerState(): PlayerState;
    get masterVolume(): number;
    set masterVolume(value: number);
    get metronomeVolume(): number;
    set metronomeVolume(value: number);
    get countInVolume(): number;
    set countInVolume(value: number);
    get midiEventsPlayedFilter(): MidiEventType[];
    set midiEventsPlayedFilter(value: MidiEventType[]);
    get tickPosition(): number;
    set tickPosition(value: number);
    get timePosition(): number;
    set timePosition(value: number);
    get playbackRange(): PlaybackRange | null;
    set playbackRange(value: PlaybackRange | null);
    get playbackSpeed(): number;
    set playbackSpeed(value: number);
    get isLooping(): boolean;
    set isLooping(value: boolean);
    private destroyPlayer;
    private setupPlayer;
    private loadMidiForScore;
    /**
     * Changes the volume of the given tracks.
     * @param tracks The tracks for which the volume should be changed.
     * @param volume The volume to set for all tracks in percent (0-1)
     */
    changeTrackVolume(tracks: Track[], volume: number): void;
    /**
     * Changes the given tracks to be played solo or not.
     * If one or more tracks are set to solo, only those tracks are hearable.
     * @param tracks The list of tracks to play solo or not.
     * @param solo If set to true, the tracks will be added to the solo list. If false, they are removed.
     */
    changeTrackSolo(tracks: Track[], solo: boolean): void;
    /**
     * Changes the given tracks to be muted or not.
     * @param tracks The list of track to mute or unmute.
     * @param mute If set to true, the tracks will be muted. If false they are unmuted.
     */
    changeTrackMute(tracks: Track[], mute: boolean): void;
    /**
     * Starts the playback of the current song.
     * @returns true if the playback was started, otherwise false. Reasons for not starting can be that the player is not ready or already playing.
     */
    play(): boolean;
    /**
     * Pauses the playback of the current song.
     */
    pause(): void;
    /**
     * Toggles between play/pause depending on the current player state.
     */
    playPause(): void;
    /**
     * Stops the playback of the current song, and moves the playback position back to the start.
     */
    stop(): void;
    /**
     * Triggers the play of the given beat. This will stop the any other current ongoing playback.
     * @param beat the single beat to play
     */
    playBeat(beat: Beat): void;
    /**
     * Triggers the play of the given note. This will stop the any other current ongoing playback.
     * @param beat the single note to play
     */
    playNote(note: Note): void;
    private _cursorWrapper;
    private _barCursor;
    private _beatCursor;
    private _selectionWrapper;
    private _previousTick;
    private _playerState;
    private _currentBeat;
    private _previousStateForCursor;
    private _previousCursorCache;
    private _lastScroll;
    private destroyCursors;
    private setupCursors;
    /**
     * updates the cursors to highlight the beat at the specified tick position
     * @param tick
     * @param stop
     */
    private cursorUpdateTick;
    /**
     * updates the cursors to highlight the specified beat
     */
    private cursorUpdateBeat;
    private internalCursorUpdateBeat;
    playedBeatChanged: IEventEmitterOfT<Beat>;
    private onPlayedBeatChanged;
    private _beatMouseDown;
    private _selectionStart;
    private _selectionEnd;
    beatMouseDown: IEventEmitterOfT<Beat>;
    beatMouseMove: IEventEmitterOfT<Beat>;
    beatMouseUp: IEventEmitterOfT<Beat | null>;
    private onBeatMouseDown;
    private onBeatMouseMove;
    private onBeatMouseUp;
    private updateSelectionCursor;
    private setupClickHandling;
    private cursorSelectRange;
    scoreLoaded: IEventEmitterOfT<Score>;
    private onScoreLoaded;
    resize: IEventEmitterOfT<ResizeEventArgs>;
    private onResize;
    renderStarted: IEventEmitterOfT<boolean>;
    private onRenderStarted;
    renderFinished: IEventEmitterOfT<RenderFinishedEventArgs>;
    private onRenderFinished;
    postRenderFinished: IEventEmitter;
    private onPostRenderFinished;
    error: IEventEmitterOfT<Error>;
    onError(error: Error): void;
    playerReady: IEventEmitter;
    private onPlayerReady;
    playerFinished: IEventEmitter;
    private onPlayerFinished;
    soundFontLoaded: IEventEmitter;
    private onSoundFontLoaded;
    midiLoad: IEventEmitterOfT<MidiFile>;
    private onMidiLoad;
    midiLoaded: IEventEmitterOfT<PositionChangedEventArgs>;
    private onMidiLoaded;
    playerStateChanged: IEventEmitterOfT<PlayerStateChangedEventArgs>;
    private onPlayerStateChanged;
    playerPositionChanged: IEventEmitterOfT<PositionChangedEventArgs>;
    private onPlayerPositionChanged;
    midiEventsPlayed: IEventEmitterOfT<MidiEventsPlayedEventArgs>;
    private onMidiEventsPlayed;
}

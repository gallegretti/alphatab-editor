import { AlphaSynthMidiFileHandler } from '@src/midi/AlphaSynthMidiFileHandler';
import { MidiFileGenerator } from '@src/midi/MidiFileGenerator';
import { MidiFile } from '@src/midi/MidiFile';
import { PlaybackRange } from '@src/synth/PlaybackRange';
import { PlayerState } from '@src/synth/PlayerState';
import { Environment } from '@src/Environment';
import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { AlphaTexImporter } from '@src/importer/AlphaTexImporter';
import { ScrollMode } from '@src/PlayerSettings';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { ScoreRenderer } from '@src/rendering/ScoreRenderer';
import { ResizeEventArgs } from '@src/ResizeEventArgs';
import { Logger } from '@src/Logger';
import { ModelUtils } from '@src/model/ModelUtils';
import { AlphaTabError, AlphaTabErrorType } from '@src/AlphaTabError';
class SelectionInfo {
    constructor(beat) {
        this.bounds = null;
        this.beat = beat;
    }
}
/**
 * This class represents the public API of alphaTab and provides all logic to display
 * a music sheet in any UI using the given {@link IUiFacade}
 * @param <TSettings> The UI object holding the settings.
 * @csharp_public
 */
export class AlphaTabApiBase {
    /**
     * Initializes a new instance of the {@link AlphaTabApiBase} class.
     * @param uiFacade The UI facade to use for interacting with the user interface.
     * @param settings The UI settings object to use for loading the settings.
     */
    constructor(uiFacade, settings) {
        this._startTime = 0;
        this._trackIndexes = null;
        this._isDestroyed = false;
        /**
         * Gets the score holding all information about the song being rendered.
         */
        this.score = null;
        /**
         * Gets a list of the tracks that are currently rendered;
         */
        this.tracks = [];
        this._tickCache = null;
        /**
         * Gets the alphaSynth player used for playback. This is the low-level API to the Midi synthesizer used for playback.
         */
        this.player = null;
        this._cursorWrapper = null;
        this._barCursor = null;
        this._beatCursor = null;
        this._selectionWrapper = null;
        this._previousTick = 0;
        this._playerState = PlayerState.Paused;
        this._currentBeat = null;
        this._previousStateForCursor = PlayerState.Paused;
        this._previousCursorCache = null;
        this._lastScroll = 0;
        this.playedBeatChanged = new EventEmitterOfT();
        this._beatMouseDown = false;
        this._selectionStart = null;
        this._selectionEnd = null;
        this.beatMouseDown = new EventEmitterOfT();
        this.beatMouseMove = new EventEmitterOfT();
        this.beatMouseUp = new EventEmitterOfT();
        this.scoreLoaded = new EventEmitterOfT();
        this.resize = new EventEmitterOfT();
        this.renderStarted = new EventEmitterOfT();
        this.renderFinished = new EventEmitterOfT();
        this.postRenderFinished = new EventEmitter();
        this.error = new EventEmitterOfT();
        this.playerReady = new EventEmitter();
        this.playerFinished = new EventEmitter();
        this.soundFontLoaded = new EventEmitter();
        this.midiLoad = new EventEmitterOfT();
        this.midiLoaded = new EventEmitterOfT();
        this.playerStateChanged = new EventEmitterOfT();
        this.playerPositionChanged = new EventEmitterOfT();
        this.midiEventsPlayed = new EventEmitterOfT();
        this.uiFacade = uiFacade;
        this.container = uiFacade.rootContainer;
        uiFacade.initialize(this, settings);
        Logger.logLevel = this.settings.core.logLevel;
        this.canvasElement = uiFacade.createCanvasElement();
        this.container.appendChild(this.canvasElement);
        if (this.settings.core.useWorkers &&
            this.uiFacade.areWorkersSupported &&
            Environment.getRenderEngineFactory(this.settings.core.engine).supportsWorkers) {
            this.renderer = this.uiFacade.createWorkerRenderer();
        }
        else {
            this.renderer = new ScoreRenderer(this.settings);
        }
        this.container.resize.on(Environment.throttle(() => {
            if (this._isDestroyed) {
                return;
            }
            if (this.container.width !== this.renderer.width) {
                this.triggerResize();
            }
        }, uiFacade.resizeThrottle));
        let initialResizeEventInfo = new ResizeEventArgs();
        initialResizeEventInfo.oldWidth = this.renderer.width;
        initialResizeEventInfo.newWidth = this.container.width | 0;
        initialResizeEventInfo.settings = this.settings;
        this.onResize(initialResizeEventInfo);
        this.renderer.preRender.on(this.onRenderStarted.bind(this));
        this.renderer.renderFinished.on(renderingResult => {
            this.onRenderFinished(renderingResult);
        });
        this.renderer.postRenderFinished.on(() => {
            let duration = Date.now() - this._startTime;
            Logger.debug('rendering', 'Rendering completed in ' + duration + 'ms');
            this.onPostRenderFinished();
        });
        this.renderer.preRender.on(_ => {
            this._startTime = Date.now();
        });
        this.renderer.partialRenderFinished.on(this.appendRenderResult.bind(this));
        this.renderer.renderFinished.on(r => {
            this.appendRenderResult(r);
            this.appendRenderResult(null); // marks last element
        });
        this.renderer.error.on(this.onError.bind(this));
        if (this.settings.player.enablePlayer) {
            this.setupPlayer();
        }
        this.setupClickHandling();
        // delay rendering to allow ui to hook up with events first.
        this.uiFacade.beginInvoke(() => {
            this.uiFacade.initialRender();
        });
    }
    /**
     * Destroys the alphaTab control and restores the initial state of the UI.
     */
    destroy() {
        this._isDestroyed = true;
        if (this.player) {
            this.player.destroy();
        }
        this.uiFacade.destroy();
        this.renderer.destroy();
    }
    /**
     * Applies any changes that were done to the settings object and informs the {@link renderer} about any new values to consider.
     */
    updateSettings() {
        this.renderer.updateSettings(this.settings);
        // enable/disable player if needed
        if (this.settings.player.enablePlayer) {
            this.setupPlayer();
        }
        else {
            this.destroyPlayer();
        }
    }
    /**
     * Attempts a load of the score represented by the given data object.
     * @param scoreData The data container supported by {@link IUiFacade}
     * @param trackIndexes The indexes of the tracks from the song that should be rendered. If not provided, the first track of the
     * song will be shown.
     * @returns true if the data object is supported and a load was initiated, otherwise false
     */
    load(scoreData, trackIndexes) {
        try {
            return this.uiFacade.load(scoreData, score => {
                this.renderScore(score, trackIndexes);
            }, error => {
                this.onError(error);
            });
        }
        catch (e) {
            this.onError(e);
            return false;
        }
    }
    /**
     * Initiates a rendering of the given score.
     * @param score The score containing the tracks to be rendered.
     * @param trackIndexes The indexes of the tracks from the song that should be rendered. If not provided, the first track of the
     * song will be shown.
     */
    renderScore(score, trackIndexes) {
        let tracks = [];
        if (!trackIndexes) {
            if (score.tracks.length > 0) {
                tracks.push(score.tracks[0]);
            }
        }
        else {
            if (trackIndexes.length === 0) {
                if (score.tracks.length > 0) {
                    tracks.push(score.tracks[0]);
                }
            }
            else if (trackIndexes.length === 1 && trackIndexes[0] === -1) {
                for (let track of score.tracks) {
                    tracks.push(track);
                }
            }
            else {
                for (let index of trackIndexes) {
                    if (index >= 0 && index <= score.tracks.length) {
                        tracks.push(score.tracks[index]);
                    }
                }
            }
        }
        this.internalRenderTracks(score, tracks);
    }
    /**
     * Renders the given list of tracks.
     * @param tracks The tracks to render. They must all belong to the same score.
     */
    renderTracks(tracks) {
        if (tracks.length > 0) {
            let score = tracks[0].score;
            for (let track of tracks) {
                if (track.score !== score) {
                    this.onError(new AlphaTabError(AlphaTabErrorType.General, 'All rendered tracks must belong to the same score.'));
                    return;
                }
            }
            this.internalRenderTracks(score, tracks);
        }
    }
    internalRenderTracks(score, tracks) {
        if (score !== this.score) {
            ModelUtils.applyPitchOffsets(this.settings, score);
            this.score = score;
            this.tracks = tracks;
            this._trackIndexes = [];
            for (let track of tracks) {
                this._trackIndexes.push(track.index);
            }
            this.onScoreLoaded(score);
            this.loadMidiForScore();
            this.render();
        }
        else {
            this.tracks = tracks;
            this._trackIndexes = [];
            for (let track of tracks) {
                this._trackIndexes.push(track.index);
            }
            this.render();
        }
    }
    /**
     * @internal
     */
    triggerResize() {
        if (!this.container.isVisible) {
            Logger.warning('Rendering', 'AlphaTab container was invisible while autosizing, waiting for element to become visible', null);
            this.uiFacade.rootContainerBecameVisible.on(() => {
                Logger.debug('Rendering', 'AlphaTab container became visible, doing autosizing', null);
                this.triggerResize();
            });
        }
        else {
            let resizeEventInfo = new ResizeEventArgs();
            resizeEventInfo.oldWidth = this.renderer.width;
            resizeEventInfo.newWidth = this.container.width;
            resizeEventInfo.settings = this.settings;
            this.onResize(resizeEventInfo);
            this.renderer.updateSettings(this.settings);
            this.renderer.width = this.container.width;
            this.renderer.resizeRender();
        }
    }
    appendRenderResult(result) {
        if (result) {
            this.canvasElement.width = result.totalWidth;
            this.canvasElement.height = result.totalHeight;
            if (this._cursorWrapper) {
                this._cursorWrapper.width = result.totalWidth;
                this._cursorWrapper.height = result.totalHeight;
            }
        }
        if (!result || result.renderResult) {
            this.uiFacade.beginAppendRenderResults(result);
        }
    }
    /**
     * Tells alphaTab to render the given alphaTex.
     * @param tex The alphaTex code to render.
     * @param tracks If set, the given tracks will be rendered, otherwise the first track only will be rendered.
     */
    tex(tex, tracks) {
        try {
            let parser = new AlphaTexImporter();
            parser.logErrors = true;
            parser.initFromString(tex, this.settings);
            let score = parser.readScore();
            this.renderScore(score, tracks);
        }
        catch (e) {
            this.onError(e);
        }
    }
    /**
     * Attempts a load of the score represented by the given data object.
     * @param data The data object to decode
     * @param append Whether to fully replace or append the data from the given soundfont.
     * @returns true if the data object is supported and a load was initiated, otherwise false
     */
    loadSoundFont(data, append = false) {
        if (!this.player) {
            return false;
        }
        return this.uiFacade.loadSoundFont(data, append);
    }
    /**
     * Resets all loaded soundfonts as if they were not loaded.
     */
    resetSoundFonts() {
        if (!this.player) {
            return;
        }
        this.player.resetSoundFonts();
    }
    /**
     * Initiates a re-rendering of the current setup. If rendering is not yet possible, it will be deferred until the UI changes to be ready for rendering.
     */
    render() {
        if (!this.renderer) {
            return;
        }
        if (this.uiFacade.canRender) {
            // when font is finally loaded, start rendering
            this.renderer.width = this.container.width;
            this.renderer.renderScore(this.score, this._trackIndexes);
        }
        else {
            this.uiFacade.canRenderChanged.on(() => this.render());
        }
    }
    get isReadyForPlayback() {
        if (!this.player) {
            return false;
        }
        return this.player.isReadyForPlayback;
    }
    get playerState() {
        if (!this.player) {
            return PlayerState.Paused;
        }
        return this.player.state;
    }
    get masterVolume() {
        if (!this.player) {
            return 0;
        }
        return this.player.masterVolume;
    }
    set masterVolume(value) {
        if (this.player) {
            this.player.masterVolume = value;
        }
    }
    get metronomeVolume() {
        if (!this.player) {
            return 0;
        }
        return this.player.metronomeVolume;
    }
    set metronomeVolume(value) {
        if (this.player) {
            this.player.metronomeVolume = value;
        }
    }
    get countInVolume() {
        if (!this.player) {
            return 0;
        }
        return this.player.countInVolume;
    }
    set countInVolume(value) {
        if (this.player) {
            this.player.countInVolume = value;
        }
    }
    get midiEventsPlayedFilter() {
        if (!this.player) {
            return [];
        }
        return this.player.midiEventsPlayedFilter;
    }
    set midiEventsPlayedFilter(value) {
        if (this.player) {
            this.player.midiEventsPlayedFilter = value;
        }
    }
    get tickPosition() {
        if (!this.player) {
            return 0;
        }
        return this.player.tickPosition;
    }
    set tickPosition(value) {
        if (this.player) {
            this.player.tickPosition = value;
        }
    }
    get timePosition() {
        if (!this.player) {
            return 0;
        }
        return this.player.timePosition;
    }
    set timePosition(value) {
        if (this.player) {
            this.player.timePosition = value;
        }
    }
    get playbackRange() {
        if (!this.player) {
            return null;
        }
        return this.player.playbackRange;
    }
    set playbackRange(value) {
        if (this.player) {
            this.player.playbackRange = value;
            if (this.settings.player.enableCursor) {
                this.updateSelectionCursor(value);
            }
        }
    }
    get playbackSpeed() {
        if (!this.player) {
            return 0;
        }
        return this.player.playbackSpeed;
    }
    set playbackSpeed(value) {
        if (this.player) {
            this.player.playbackSpeed = value;
        }
    }
    get isLooping() {
        if (!this.player) {
            return false;
        }
        return this.player.isLooping;
    }
    set isLooping(value) {
        if (this.player) {
            this.player.isLooping = value;
        }
    }
    destroyPlayer() {
        if (!this.player) {
            return;
        }
        this.player.destroy();
        this.player = null;
        this.destroyCursors();
    }
    setupPlayer() {
        if (this.player) {
            return;
        }
        this.player = this.uiFacade.createWorkerPlayer();
        if (!this.player) {
            return;
        }
        this.player.ready.on(() => {
            this.loadMidiForScore();
        });
        this.player.readyForPlayback.on(() => {
            this.onPlayerReady();
            if (this.tracks) {
                for (let track of this.tracks) {
                    let volume = track.playbackInfo.volume / 16;
                    this.player.setChannelVolume(track.playbackInfo.primaryChannel, volume);
                    this.player.setChannelVolume(track.playbackInfo.secondaryChannel, volume);
                }
            }
        });
        this.player.soundFontLoaded.on(this.onSoundFontLoaded.bind(this));
        this.player.soundFontLoadFailed.on(e => {
            this.onError(e);
        });
        this.player.midiLoaded.on(this.onMidiLoaded.bind(this));
        this.player.midiLoadFailed.on(e => {
            this.onError(e);
        });
        this.player.stateChanged.on(this.onPlayerStateChanged.bind(this));
        this.player.positionChanged.on(this.onPlayerPositionChanged.bind(this));
        this.player.midiEventsPlayed.on(this.onMidiEventsPlayed.bind(this));
        this.player.finished.on(this.onPlayerFinished.bind(this));
        if (this.settings.player.enableCursor) {
            this.setupCursors();
        }
        else {
            this.destroyCursors();
        }
    }
    loadMidiForScore() {
        if (!this.player || !this.score || !this.player.isReady) {
            return;
        }
        Logger.debug('AlphaTab', 'Generating Midi');
        let midiFile = new MidiFile();
        let handler = new AlphaSynthMidiFileHandler(midiFile);
        let generator = new MidiFileGenerator(this.score, this.settings, handler);
        generator.generate();
        this._tickCache = generator.tickLookup;
        this.onMidiLoad(midiFile);
        this.player.loadMidiFile(midiFile);
    }
    /**
     * Changes the volume of the given tracks.
     * @param tracks The tracks for which the volume should be changed.
     * @param volume The volume to set for all tracks in percent (0-1)
     */
    changeTrackVolume(tracks, volume) {
        if (!this.player) {
            return;
        }
        for (let track of tracks) {
            this.player.setChannelVolume(track.playbackInfo.primaryChannel, volume);
            this.player.setChannelVolume(track.playbackInfo.secondaryChannel, volume);
        }
    }
    /**
     * Changes the given tracks to be played solo or not.
     * If one or more tracks are set to solo, only those tracks are hearable.
     * @param tracks The list of tracks to play solo or not.
     * @param solo If set to true, the tracks will be added to the solo list. If false, they are removed.
     */
    changeTrackSolo(tracks, solo) {
        if (!this.player) {
            return;
        }
        for (let track of tracks) {
            this.player.setChannelSolo(track.playbackInfo.primaryChannel, solo);
            this.player.setChannelSolo(track.playbackInfo.secondaryChannel, solo);
        }
    }
    /**
     * Changes the given tracks to be muted or not.
     * @param tracks The list of track to mute or unmute.
     * @param mute If set to true, the tracks will be muted. If false they are unmuted.
     */
    changeTrackMute(tracks, mute) {
        if (!this.player) {
            return;
        }
        for (let track of tracks) {
            this.player.setChannelMute(track.playbackInfo.primaryChannel, mute);
            this.player.setChannelMute(track.playbackInfo.secondaryChannel, mute);
        }
    }
    /**
     * Starts the playback of the current song.
     * @returns true if the playback was started, otherwise false. Reasons for not starting can be that the player is not ready or already playing.
     */
    play() {
        if (!this.player) {
            return false;
        }
        return this.player.play();
    }
    /**
     * Pauses the playback of the current song.
     */
    pause() {
        if (!this.player) {
            return;
        }
        this.player.pause();
    }
    /**
     * Toggles between play/pause depending on the current player state.
     */
    playPause() {
        if (!this.player) {
            return;
        }
        this.player.playPause();
    }
    /**
     * Stops the playback of the current song, and moves the playback position back to the start.
     */
    stop() {
        if (!this.player) {
            return;
        }
        this.player.stop();
    }
    /**
     * Triggers the play of the given beat. This will stop the any other current ongoing playback.
     * @param beat the single beat to play
     */
    playBeat(beat) {
        if (!this.player) {
            return;
        }
        // we generate a new midi file containing only the beat
        let midiFile = new MidiFile();
        let handler = new AlphaSynthMidiFileHandler(midiFile);
        let generator = new MidiFileGenerator(beat.voice.bar.staff.track.score, this.settings, handler);
        generator.generateSingleBeat(beat);
        this.player.playOneTimeMidiFile(midiFile);
    }
    /**
     * Triggers the play of the given note. This will stop the any other current ongoing playback.
     * @param beat the single note to play
     */
    playNote(note) {
        if (!this.player) {
            return;
        }
        // we generate a new midi file containing only the beat
        let midiFile = new MidiFile();
        let handler = new AlphaSynthMidiFileHandler(midiFile);
        let generator = new MidiFileGenerator(note.beat.voice.bar.staff.track.score, this.settings, handler);
        generator.generateSingleNote(note);
        this.player.playOneTimeMidiFile(midiFile);
    }
    destroyCursors() {
        if (!this._cursorWrapper) {
            return;
        }
        this.uiFacade.destroyCursors();
        this._cursorWrapper = null;
        this._barCursor = null;
        this._beatCursor = null;
        this._selectionWrapper = null;
        this._previousTick = 0;
        this._playerState = PlayerState.Paused;
    }
    setupCursors() {
        //
        // Create cursors
        let cursors = this.uiFacade.createCursors();
        if (!cursors) {
            return;
        }
        // store options and created elements for fast access
        this._cursorWrapper = cursors.cursorWrapper;
        this._barCursor = cursors.barCursor;
        this._beatCursor = cursors.beatCursor;
        this._selectionWrapper = cursors.selectionWrapper;
        //
        // Hook into events
        this._previousTick = 0;
        this._playerState = PlayerState.Paused;
        // we need to update our position caches if we render a tablature
        this.renderer.postRenderFinished.on(() => {
            this.cursorUpdateTick(this._previousTick, false);
        });
        if (this.player) {
            this.player.positionChanged.on(e => {
                this._previousTick = e.currentTick;
                this.uiFacade.beginInvoke(() => {
                    this.cursorUpdateTick(e.currentTick, false);
                });
            });
            this.player.stateChanged.on(e => {
                this._playerState = e.state;
                if (!e.stopped && e.state === PlayerState.Paused) {
                    let currentBeat = this._currentBeat;
                    let tickCache = this._tickCache;
                    if (currentBeat && tickCache) {
                        this.player.tickPosition =
                            tickCache.getMasterBarStart(currentBeat.currentBeat.voice.bar.masterBar) +
                                currentBeat.currentBeat.playbackStart;
                    }
                }
            });
        }
    }
    /**
     * updates the cursors to highlight the beat at the specified tick position
     * @param tick
     * @param stop
     */
    cursorUpdateTick(tick, stop) {
        let cache = this._tickCache;
        if (cache) {
            let tracks = this.tracks;
            if (tracks.length > 0) {
                let beat = cache.findBeat(tracks, tick, this._currentBeat);
                if (beat) {
                    this.cursorUpdateBeat(beat, stop);
                }
            }
        }
    }
    /**
     * updates the cursors to highlight the specified beat
     */
    cursorUpdateBeat(lookupResult, stop) {
        const beat = lookupResult.currentBeat;
        const nextBeat = lookupResult.nextBeat;
        const duration = lookupResult.duration;
        const beatsToHighlight = lookupResult.beatsToHighlight;
        if (!beat) {
            return;
        }
        let cache = this.renderer.boundsLookup;
        if (!cache) {
            return;
        }
        let previousBeat = this._currentBeat;
        let previousCache = this._previousCursorCache;
        let previousState = this._previousStateForCursor;
        this._currentBeat = lookupResult;
        this._previousCursorCache = cache;
        this._previousStateForCursor = this._playerState;
        if (beat === (previousBeat === null || previousBeat === void 0 ? void 0 : previousBeat.currentBeat) && cache === previousCache && previousState === this._playerState) {
            return;
        }
        let beatBoundings = cache.findBeat(beat);
        if (!beatBoundings) {
            return;
        }
        this.uiFacade.beginInvoke(() => {
            this.internalCursorUpdateBeat(beat, nextBeat, duration, stop, beatsToHighlight, cache, beatBoundings);
        });
    }
    internalCursorUpdateBeat(beat, nextBeat, duration, stop, beatsToHighlight, cache, beatBoundings) {
        let barCursor = this._barCursor;
        let beatCursor = this._beatCursor;
        let barBoundings = beatBoundings.barBounds.masterBarBounds;
        let barBounds = barBoundings.visualBounds;
        barCursor.setBounds(barBounds.x, barBounds.y, barBounds.w, barBounds.h);
        // move beat to start position immediately
        if (this.settings.player.enableAnimatedBeatCursor) {
            beatCursor.stopAnimation();
        }
        beatCursor.setBounds(beatBoundings.visualBounds.x, barBounds.y, 1, barBounds.h);
        // if playing, animate the cursor to the next beat
        if (this.settings.player.enableElementHighlighting) {
            this.uiFacade.removeHighlights();
        }
        if (this._playerState === PlayerState.Playing || stop) {
            duration /= this.playbackSpeed;
            if (!stop) {
                if (this.settings.player.enableElementHighlighting && beatsToHighlight) {
                    for (let highlight of beatsToHighlight) {
                        let className = BeatContainerGlyph.getGroupId(highlight);
                        this.uiFacade.highlightElements(className, beat.voice.bar.index);
                    }
                }
                if (this.settings.player.enableAnimatedBeatCursor) {
                    let nextBeatX = barBoundings.visualBounds.x + barBoundings.visualBounds.w;
                    // get position of next beat on same stavegroup
                    if (nextBeat) {
                        // if we are moving within the same bar or to the next bar
                        // transition to the next beat, otherwise transition to the end of the bar.
                        if ((nextBeat.voice.bar.index === beat.voice.bar.index && nextBeat.index > beat.index) ||
                            nextBeat.voice.bar.index === beat.voice.bar.index + 1) {
                            let nextBeatBoundings = cache.findBeat(nextBeat);
                            if (nextBeatBoundings &&
                                nextBeatBoundings.barBounds.masterBarBounds.staveGroupBounds ===
                                    barBoundings.staveGroupBounds) {
                                nextBeatX = nextBeatBoundings.visualBounds.x;
                            }
                        }
                    }
                    // we need to put the transition to an own animation frame
                    // otherwise the stop animation above is not applied.
                    this.uiFacade.beginInvoke(() => {
                        beatCursor.transitionToX(duration, nextBeatX);
                    });
                }
            }
            if (!this._beatMouseDown && this.settings.player.scrollMode !== ScrollMode.Off) {
                let scrollElement = this.uiFacade.getScrollContainer();
                let isVertical = Environment.getLayoutEngineFactory(this.settings.display.layoutMode).vertical;
                let mode = this.settings.player.scrollMode;
                if (isVertical) {
                    // when scrolling on the y-axis, we preliminary check if the new beat/bar have
                    // moved on the y-axis
                    let y = barBoundings.realBounds.y + this.settings.player.scrollOffsetY;
                    if (y !== this._lastScroll) {
                        this._lastScroll = y;
                        switch (mode) {
                            case ScrollMode.Continuous:
                                let elementOffset = this.uiFacade.getOffset(scrollElement, this.container);
                                this.uiFacade.scrollToY(scrollElement, elementOffset.y + y, this.settings.player.scrollSpeed);
                                break;
                            case ScrollMode.OffScreen:
                                let elementBottom = scrollElement.scrollTop + this.uiFacade.getOffset(null, scrollElement).h;
                                if (barBoundings.visualBounds.y + barBoundings.visualBounds.h >= elementBottom ||
                                    barBoundings.visualBounds.y < scrollElement.scrollTop) {
                                    let scrollTop = barBoundings.realBounds.y + this.settings.player.scrollOffsetY;
                                    this.uiFacade.scrollToY(scrollElement, scrollTop, this.settings.player.scrollSpeed);
                                }
                                break;
                        }
                    }
                }
                else {
                    // when scrolling on the x-axis, we preliminary check if the new bar has
                    // moved on the x-axis
                    let x = barBoundings.visualBounds.x;
                    if (x !== this._lastScroll) {
                        this._lastScroll = x;
                        switch (mode) {
                            case ScrollMode.Continuous:
                                let scrollLeftContinuous = barBoundings.realBounds.x + this.settings.player.scrollOffsetX;
                                this._lastScroll = barBoundings.visualBounds.x;
                                this.uiFacade.scrollToX(scrollElement, scrollLeftContinuous, this.settings.player.scrollSpeed);
                                break;
                            case ScrollMode.OffScreen:
                                let elementRight = scrollElement.scrollLeft + this.uiFacade.getOffset(null, scrollElement).w;
                                if (barBoundings.visualBounds.x + barBoundings.visualBounds.w >= elementRight ||
                                    barBoundings.visualBounds.x < scrollElement.scrollLeft) {
                                    let scrollLeftOffScreen = barBoundings.realBounds.x + this.settings.player.scrollOffsetX;
                                    this._lastScroll = barBoundings.visualBounds.x;
                                    this.uiFacade.scrollToX(scrollElement, scrollLeftOffScreen, this.settings.player.scrollSpeed);
                                }
                                break;
                        }
                    }
                }
            }
            // trigger an event for others to indicate which beat/bar is played
            this.onPlayedBeatChanged(beat);
        }
    }
    onPlayedBeatChanged(beat) {
        if (this._isDestroyed) {
            return;
        }
        this.playedBeatChanged.trigger(beat);
        this.uiFacade.triggerEvent(this.container, 'playedBeatChanged', beat);
    }
    onBeatMouseDown(originalEvent, beat) {
        if (this._isDestroyed) {
            return;
        }
        if (this.settings.player.enablePlayer &&
            this.settings.player.enableCursor &&
            this.settings.player.enableUserInteraction) {
            this._selectionStart = new SelectionInfo(beat);
            this._selectionEnd = null;
        }
        this._beatMouseDown = true;
        this.beatMouseDown.trigger(beat);
        this.uiFacade.triggerEvent(this.container, 'beatMouseDown', beat, originalEvent);
    }
    onBeatMouseMove(originalEvent, beat) {
        if (this._isDestroyed) {
            return;
        }
        if (this.settings.player.enableUserInteraction) {
            if (!this._selectionEnd || this._selectionEnd.beat !== beat) {
                this._selectionEnd = new SelectionInfo(beat);
                this.cursorSelectRange(this._selectionStart, this._selectionEnd);
            }
        }
        this.beatMouseMove.trigger(beat);
        this.uiFacade.triggerEvent(this.container, 'beatMouseMove', beat, originalEvent);
    }
    onBeatMouseUp(originalEvent, beat) {
        if (this._isDestroyed) {
            return;
        }
        if (this.settings.player.enableUserInteraction) {
            // for the selection ensure start < end
            if (this._selectionEnd) {
                let startTick = this._selectionStart.beat.absolutePlaybackStart;
                let endTick = this._selectionStart.beat.absolutePlaybackStart;
                if (endTick < startTick) {
                    let t = this._selectionStart;
                    this._selectionStart = this._selectionEnd;
                    this._selectionEnd = t;
                }
            }
            if (this._selectionStart && this._tickCache) {
                // get the start and stop ticks (which consider properly repeats)
                let tickCache = this._tickCache;
                let realMasterBarStart = tickCache.getMasterBarStart(this._selectionStart.beat.voice.bar.masterBar);
                // move to selection start
                this._currentBeat = null; // reset current beat so it is updating the cursor
                if (this._playerState === PlayerState.Paused) {
                    this.cursorUpdateTick(this._selectionStart.beat.absolutePlaybackStart, false);
                }
                this.tickPosition = realMasterBarStart + this._selectionStart.beat.playbackStart;
                // set playback range
                if (this._selectionEnd && this._selectionStart.beat !== this._selectionEnd.beat) {
                    let realMasterBarEnd = tickCache.getMasterBarStart(this._selectionEnd.beat.voice.bar.masterBar);
                    let range = new PlaybackRange();
                    range.startTick = realMasterBarStart + this._selectionStart.beat.playbackStart;
                    range.endTick =
                        realMasterBarEnd +
                            this._selectionEnd.beat.playbackStart +
                            this._selectionEnd.beat.playbackDuration -
                            50;
                    this.playbackRange = range;
                }
                else {
                    this._selectionStart = null;
                    this.playbackRange = null;
                    this.cursorSelectRange(this._selectionStart, this._selectionEnd);
                }
            }
        }
        this.beatMouseUp.trigger(beat);
        this.uiFacade.triggerEvent(this.container, 'beatMouseUp', beat, originalEvent);
        this._beatMouseDown = false;
    }
    updateSelectionCursor(range) {
        if (!this._tickCache) {
            return;
        }
        if (range) {
            const startBeat = this._tickCache.findBeat(this.tracks, range.startTick);
            const endBeat = this._tickCache.findBeat(this.tracks, range.endTick);
            if (startBeat && endBeat) {
                const selectionStart = new SelectionInfo(startBeat.currentBeat);
                const selectionEnd = new SelectionInfo(endBeat.currentBeat);
                this.cursorSelectRange(selectionStart, selectionEnd);
            }
        }
        else {
            this.cursorSelectRange(null, null);
        }
    }
    setupClickHandling() {
        this.canvasElement.mouseDown.on(e => {
            var _a, _b;
            if (!e.isLeftMouseButton) {
                return;
            }
            if (this.settings.player.enableUserInteraction) {
                e.preventDefault();
            }
            let relX = e.getX(this.canvasElement);
            let relY = e.getY(this.canvasElement);
            let beat = (_b = (_a = this.renderer.boundsLookup) === null || _a === void 0 ? void 0 : _a.getBeatAtPos(relX, relY)) !== null && _b !== void 0 ? _b : null;
            if (beat) {
                this.onBeatMouseDown(e, beat);
            }
        });
        this.canvasElement.mouseMove.on(e => {
            var _a, _b;
            if (!this._beatMouseDown) {
                return;
            }
            let relX = e.getX(this.canvasElement);
            let relY = e.getY(this.canvasElement);
            let beat = (_b = (_a = this.renderer.boundsLookup) === null || _a === void 0 ? void 0 : _a.getBeatAtPos(relX, relY)) !== null && _b !== void 0 ? _b : null;
            if (beat) {
                this.onBeatMouseMove(e, beat);
            }
        });
        this.canvasElement.mouseUp.on(e => {
            var _a, _b;
            if (!this._beatMouseDown) {
                return;
            }
            if (this.settings.player.enableUserInteraction) {
                e.preventDefault();
            }
            let relX = e.getX(this.canvasElement);
            let relY = e.getY(this.canvasElement);
            let beat = (_b = (_a = this.renderer.boundsLookup) === null || _a === void 0 ? void 0 : _a.getBeatAtPos(relX, relY)) !== null && _b !== void 0 ? _b : null;
            this.onBeatMouseUp(e, beat);
        });
        this.renderer.postRenderFinished.on(() => {
            if (!this._selectionStart ||
                !this.settings.player.enablePlayer ||
                !this.settings.player.enableCursor ||
                !this.settings.player.enableUserInteraction) {
                return;
            }
            this.cursorSelectRange(this._selectionStart, this._selectionEnd);
        });
    }
    cursorSelectRange(startBeat, endBeat) {
        let cache = this.renderer.boundsLookup;
        if (!cache) {
            return;
        }
        let selectionWrapper = this._selectionWrapper;
        if (!selectionWrapper) {
            return;
        }
        selectionWrapper.clear();
        if (!startBeat || !endBeat || startBeat.beat === endBeat.beat) {
            return;
        }
        if (!startBeat.bounds) {
            startBeat.bounds = cache.findBeat(startBeat.beat);
        }
        if (!endBeat.bounds) {
            endBeat.bounds = cache.findBeat(endBeat.beat);
        }
        let startTick = startBeat.beat.absolutePlaybackStart;
        let endTick = endBeat.beat.absolutePlaybackStart;
        if (endTick < startTick) {
            let t = startBeat;
            startBeat = endBeat;
            endBeat = t;
        }
        let startX = startBeat.bounds.realBounds.x;
        let endX = endBeat.bounds.realBounds.x + endBeat.bounds.realBounds.w;
        if (endBeat.beat.index === endBeat.beat.voice.beats.length - 1) {
            endX =
                endBeat.bounds.barBounds.masterBarBounds.realBounds.x +
                    endBeat.bounds.barBounds.masterBarBounds.realBounds.w;
        }
        // if the selection goes across multiple staves, we need a special selection highlighting
        if (startBeat.bounds.barBounds.masterBarBounds.staveGroupBounds !==
            endBeat.bounds.barBounds.masterBarBounds.staveGroupBounds) {
            // from the startbeat to the end of the staff,
            // then fill all staffs until the end-beat staff
            // then from staff-start to the end beat (or to end of bar if it's the last beat)
            let staffStartX = startBeat.bounds.barBounds.masterBarBounds.staveGroupBounds.visualBounds.x;
            let staffEndX = startBeat.bounds.barBounds.masterBarBounds.staveGroupBounds.visualBounds.x +
                startBeat.bounds.barBounds.masterBarBounds.staveGroupBounds.visualBounds.w;
            let startSelection = this.uiFacade.createSelectionElement();
            startSelection.setBounds(startX, startBeat.bounds.barBounds.masterBarBounds.visualBounds.y, staffEndX - startX, startBeat.bounds.barBounds.masterBarBounds.visualBounds.h);
            selectionWrapper.appendChild(startSelection);
            let staffStartIndex = startBeat.bounds.barBounds.masterBarBounds.staveGroupBounds.index + 1;
            let staffEndIndex = endBeat.bounds.barBounds.masterBarBounds.staveGroupBounds.index;
            for (let staffIndex = staffStartIndex; staffIndex < staffEndIndex; staffIndex++) {
                let staffBounds = cache.staveGroups[staffIndex];
                let middleSelection = this.uiFacade.createSelectionElement();
                middleSelection.setBounds(staffStartX, staffBounds.visualBounds.y, staffEndX - staffStartX, staffBounds.visualBounds.h);
                selectionWrapper.appendChild(middleSelection);
            }
            let endSelection = this.uiFacade.createSelectionElement();
            endSelection.setBounds(staffStartX, endBeat.bounds.barBounds.masterBarBounds.visualBounds.y, endX - staffStartX, endBeat.bounds.barBounds.masterBarBounds.visualBounds.h);
            selectionWrapper.appendChild(endSelection);
        }
        else {
            // if the beats are on the same staff, we simply highlight from the startbeat to endbeat
            let selection = this.uiFacade.createSelectionElement();
            selection.setBounds(startX, startBeat.bounds.barBounds.masterBarBounds.visualBounds.y, endX - startX, startBeat.bounds.barBounds.masterBarBounds.visualBounds.h);
            selectionWrapper.appendChild(selection);
        }
    }
    onScoreLoaded(score) {
        if (this._isDestroyed) {
            return;
        }
        this.scoreLoaded.trigger(score);
        this.uiFacade.triggerEvent(this.container, 'scoreLoaded', score);
    }
    onResize(e) {
        if (this._isDestroyed) {
            return;
        }
        this.resize.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'resize', e);
    }
    onRenderStarted(resize) {
        if (this._isDestroyed) {
            return;
        }
        this.renderStarted.trigger(resize);
        this.uiFacade.triggerEvent(this.container, 'renderStarted', resize);
    }
    onRenderFinished(renderingResult) {
        if (this._isDestroyed) {
            return;
        }
        this.renderFinished.trigger(renderingResult);
        this.uiFacade.triggerEvent(this.container, 'renderFinished', renderingResult);
    }
    onPostRenderFinished() {
        if (this._isDestroyed) {
            return;
        }
        this.postRenderFinished.trigger();
        this.uiFacade.triggerEvent(this.container, 'postRenderFinished', null);
    }
    onError(error) {
        if (this._isDestroyed) {
            return;
        }
        Logger.error('API', 'An unexpected error occurred', error);
        this.error.trigger(error);
        this.uiFacade.triggerEvent(this.container, 'error', error);
    }
    onPlayerReady() {
        if (this._isDestroyed) {
            return;
        }
        this.playerReady.trigger();
        this.uiFacade.triggerEvent(this.container, 'playerReady', null);
    }
    onPlayerFinished() {
        if (this._isDestroyed) {
            return;
        }
        this.playerFinished.trigger();
        this.uiFacade.triggerEvent(this.container, 'playerFinished', null);
    }
    onSoundFontLoaded() {
        if (this._isDestroyed) {
            return;
        }
        this.soundFontLoaded.trigger();
        this.uiFacade.triggerEvent(this.container, 'soundFontLoaded', null);
    }
    onMidiLoad(e) {
        if (this._isDestroyed) {
            return;
        }
        this.midiLoad.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'midiLoad', e);
    }
    onMidiLoaded(e) {
        if (this._isDestroyed) {
            return;
        }
        this.midiLoaded.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'midiFileLoaded', e);
    }
    onPlayerStateChanged(e) {
        if (this._isDestroyed) {
            return;
        }
        this.playerStateChanged.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'playerStateChanged', e);
    }
    onPlayerPositionChanged(e) {
        if (this._isDestroyed) {
            return;
        }
        this.playerPositionChanged.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'playerPositionChanged', e);
    }
    onMidiEventsPlayed(e) {
        if (this._isDestroyed) {
            return;
        }
        this.midiEventsPlayed.trigger(e);
        this.uiFacade.triggerEvent(this.container, 'midiEventsPlayed', e);
    }
}
//# sourceMappingURL=AlphaTabApiBase.js.map
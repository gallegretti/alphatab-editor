import { AlphaTabApi } from '@src/platform/javascript/AlphaTabApi';
import { Logger } from '@src/Logger';
/**
 * @target web
 */
export class JQueryAlphaTab {
    constructor() {
        this._initListeners = [];
    }
    exec(element, method, args) {
        if (typeof method !== 'string') {
            args = [method];
            method = 'init';
        }
        if (method.charCodeAt(0) === 95 || method === 'exec') {
            return null;
        }
        let jElement = new jQuery(element);
        let context = jElement.data('alphaTab');
        if (method === 'destroy' && !context) {
            return null;
        }
        if (method !== 'init' && !context) {
            throw new Error('alphaTab not initialized');
        }
        let apiMethod = this[method];
        if (apiMethod) {
            let realArgs = [jElement, context].concat(args);
            return apiMethod.apply(this, realArgs);
        }
        else {
            Logger.error('Api', "Method '" + method + "' does not exist on jQuery.alphaTab");
            return null;
        }
    }
    init(element, context, options) {
        if (!context) {
            context = new AlphaTabApi(element[0], options);
            element.data('alphaTab', context);
            for (let listener of this._initListeners) {
                listener(element, context, options);
            }
        }
    }
    destroy(element, context) {
        element.removeData('alphaTab');
        context.destroy();
    }
    print(element, context, width, additionalSettings) {
        context.print(width, additionalSettings);
    }
    load(element, context, data, tracks) {
        return context.load(data, tracks);
    }
    render(element, context) {
        context.render();
    }
    renderScore(element, context, score, tracks) {
        context.renderScore(score, tracks);
    }
    renderTracks(element, context, tracks) {
        context.renderTracks(tracks);
    }
    invalidate(element, context) {
        context.render();
    }
    tex(element, context, tex, tracks) {
        context.tex(tex, tracks);
    }
    muteTrack(element, context, tracks, mute) {
        context.changeTrackMute(tracks, mute);
    }
    soloTrack(element, context, tracks, solo) {
        context.changeTrackSolo(tracks, solo);
    }
    trackVolume(element, context, tracks, volume) {
        context.changeTrackVolume(tracks, volume);
    }
    loadSoundFont(element, context, value, append) {
        context.loadSoundFont(value, append);
    }
    resetSoundFonts(element, context) {
        context.resetSoundFonts();
    }
    pause(element, context) {
        context.pause();
    }
    play(element, context) {
        return context.play();
    }
    playPause(element, context) {
        context.playPause();
    }
    stop(element, context) {
        context.stop();
    }
    api(element, context) {
        return context;
    }
    player(element, context) {
        return context.player;
    }
    isReadyForPlayback(element, context) {
        return context.isReadyForPlayback;
    }
    playerState(element, context) {
        return context.playerState;
    }
    masterVolume(element, context, masterVolume) {
        if (typeof masterVolume === 'number') {
            context.masterVolume = masterVolume;
        }
        return context.masterVolume;
    }
    metronomeVolume(element, context, metronomeVolume) {
        if (typeof metronomeVolume === 'number') {
            context.metronomeVolume = metronomeVolume;
        }
        return context.metronomeVolume;
    }
    countInVolume(element, context, countInVolume) {
        if (typeof countInVolume === 'number') {
            context.countInVolume = countInVolume;
        }
        return context.countInVolume;
    }
    midiEventsPlayedFilter(element, context, midiEventsPlayedFilter) {
        if (Array.isArray(midiEventsPlayedFilter)) {
            context.midiEventsPlayedFilter = midiEventsPlayedFilter;
        }
        return context.midiEventsPlayedFilter;
    }
    playbackSpeed(element, context, playbackSpeed) {
        if (typeof playbackSpeed === 'number') {
            context.playbackSpeed = playbackSpeed;
        }
        return context.playbackSpeed;
    }
    tickPosition(element, context, tickPosition) {
        if (typeof tickPosition === 'number') {
            context.tickPosition = tickPosition;
        }
        return context.tickPosition;
    }
    timePosition(element, context, timePosition) {
        if (typeof timePosition === 'number') {
            context.timePosition = timePosition;
        }
        return context.timePosition;
    }
    loop(element, context, loop) {
        if (typeof loop === 'boolean') {
            context.isLooping = loop;
        }
        return context.isLooping;
    }
    renderer(element, context) {
        return context.renderer;
    }
    score(element, context) {
        return context.score;
    }
    settings(element, context) {
        return context.settings;
    }
    tracks(element, context) {
        return context.tracks;
    }
    _oninit(listener) {
        this._initListeners.push(listener);
    }
    static restore(selector) {
        new jQuery(selector).empty().removeData('alphaTab');
    }
}
//# sourceMappingURL=JQueryAlphaTab.js.map
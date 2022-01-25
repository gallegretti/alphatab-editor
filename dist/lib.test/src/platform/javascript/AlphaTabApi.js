import { AlphaTabApiBase } from '@src/AlphaTabApiBase';
import { AlphaSynthMidiFileHandler } from '@src/midi/AlphaSynthMidiFileHandler';
import { MidiFileGenerator } from '@src/midi/MidiFileGenerator';
import { MidiFile } from '@src/midi/MidiFile';
import { LayoutMode } from '@src/LayoutMode';
import { EventEmitterOfT } from '@src/EventEmitter';
import { BrowserUiFacade } from '@src/platform/javascript/BrowserUiFacade';
import { JsonConverter } from '@src/model/JsonConverter';
import { SettingsSerializer } from '@src/generated/SettingsSerializer';
/**
 * @target web
 */
export class AlphaTabApi extends AlphaTabApiBase {
    constructor(element, options) {
        super(new BrowserUiFacade(element), options);
        this.soundFontLoad = new EventEmitterOfT();
    }
    tex(tex, tracks) {
        let browser = this.uiFacade;
        super.tex(tex, browser.parseTracks(tracks));
    }
    print(width, additionalSettings = null) {
        // prepare a popup window for printing (a4 width, window height, centered)
        let preview = window.open('', '', 'width=0,height=0');
        let a4 = preview.document.createElement('div');
        if (width) {
            a4.style.width = width;
        }
        else {
            if (this.settings.display.layoutMode === LayoutMode.Horizontal) {
                a4.style.width = '297mm';
            }
            else {
                a4.style.width = '210mm';
            }
        }
        preview.document.write('<!DOCTYPE html><html></head><body></body></html>');
        preview.document.body.appendChild(a4);
        let dualScreenLeft = typeof window['screenLeft'] !== 'undefined'
            ? window['screenLeft']
            : window['left'];
        let dualScreenTop = typeof window['screenTop'] !== 'undefined' ? window['screenTop'] : window['top'];
        let screenWidth = "innerWidth" in window
            ? window.innerWidth
            : "clientWidth" in document.documentElement
                ? document.documentElement.clientWidth
                : window.screen.width;
        let screenHeight = "innerHeight" in window
            ? window.innerHeight
            : "clientHeight" in document.documentElement
                ? document.documentElement.clientHeight
                : window.screen.height;
        let w = a4.offsetWidth + 50;
        let h = window.innerHeight;
        let left = ((screenWidth / 2) | 0) - ((w / 2) | 0) + dualScreenLeft;
        let top = ((screenHeight / 2) | 0) - ((h / 2) | 0) + dualScreenTop;
        preview.resizeTo(w, h);
        preview.moveTo(left, top);
        preview.focus();
        // render alphaTab
        let settings = JsonConverter.jsObjectToSettings(JsonConverter.settingsToJsObject(this.settings));
        settings.core.enableLazyLoading = false;
        settings.core.useWorkers = false;
        settings.display.scale = 0.8;
        settings.display.stretchForce = 0.8;
        SettingsSerializer.fromJson(settings, additionalSettings);
        let alphaTab = new AlphaTabApi(a4, settings);
        alphaTab.renderer.postRenderFinished.on(() => {
            alphaTab.canvasElement.height = -1;
            preview.print();
        });
        alphaTab.renderTracks(this.tracks);
    }
    downloadMidi() {
        if (!this.score) {
            return;
        }
        let midiFile = new MidiFile();
        let handler = new AlphaSynthMidiFileHandler(midiFile);
        let generator = new MidiFileGenerator(this.score, this.settings, handler);
        generator.generate();
        let binary = midiFile.toBinary();
        let fileName = !this.score.title ? 'File.mid' : `${this.score.title}.mid`;
        let dlLink = document.createElement('a');
        dlLink.download = fileName;
        let blob = new Blob([binary], {
            type: 'audio/midi'
        });
        let url = URL.createObjectURL(blob);
        dlLink.href = url;
        dlLink.style.display = 'none';
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    changeTrackMute(tracks, mute) {
        let trackList = this.trackIndexesToTracks(this.uiFacade.parseTracks(tracks));
        super.changeTrackMute(trackList, mute);
    }
    changeTrackSolo(tracks, solo) {
        let trackList = this.trackIndexesToTracks(this.uiFacade.parseTracks(tracks));
        super.changeTrackSolo(trackList, solo);
    }
    changeTrackVolume(tracks, volume) {
        let trackList = this.trackIndexesToTracks(this.uiFacade.parseTracks(tracks));
        super.changeTrackVolume(trackList, volume);
    }
    trackIndexesToTracks(trackIndexes) {
        if (!this.score) {
            return [];
        }
        let tracks = [];
        if (trackIndexes.length === 1 && trackIndexes[0] === -1) {
            for (let track of this.score.tracks) {
                tracks.push(track);
            }
        }
        else {
            for (let index of trackIndexes) {
                if (index >= 0 && index < this.score.tracks.length) {
                    tracks.push(this.score.tracks[index]);
                }
            }
        }
        return tracks;
    }
    loadSoundFontFromUrl(url, append) {
        if (!this.player) {
            return;
        }
        this.player.loadSoundFontFromUrl(url, append, e => {
            this.soundFontLoad.trigger(e);
            this.uiFacade.triggerEvent(this.container, 'soundFontLoad', e);
        });
    }
}
//# sourceMappingURL=AlphaTabApi.js.map
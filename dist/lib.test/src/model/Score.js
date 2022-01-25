import { RenderStylesheet } from '@src/model/RenderStylesheet';
import { RepeatGroup } from '@src/model/RepeatGroup';
/**
 * The score is the root node of the complete
 * model. It stores the basic information of
 * a song and stores the sub components.
 * @json
 */
export class Score {
    constructor() {
        this._noteByIdLookup = new Map();
        this._currentRepeatGroup = new RepeatGroup();
        /**
         * The album of this song.
         */
        this.album = '';
        /**
         * The artist who performs this song.
         */
        this.artist = '';
        /**
         * The owner of the copyright of this song.
         */
        this.copyright = '';
        /**
         * Additional instructions
         */
        this.instructions = '';
        /**
         * The author of the music.
         */
        this.music = '';
        /**
         * Some additional notes about the song.
         */
        this.notices = '';
        /**
         * The subtitle of the song.
         */
        this.subTitle = '';
        /**
         * The title of the song.
         */
        this.title = '';
        /**
         * The author of the song lyrics
         */
        this.words = '';
        /**
         * The author of this tablature.
         */
        this.tab = '';
        /**
         * Gets or sets the global tempo of the song in BPM. The tempo might change via {@link MasterBar.tempo}.
         */
        this.tempo = 120;
        /**
         * Gets or sets the name/label of the tempo.
         */
        this.tempoLabel = '';
        /**
         * Gets or sets a list of all masterbars contained in this song.
         * @json_add addMasterBar
         */
        this.masterBars = [];
        /**
         * Gets or sets a list of all tracks contained in this song.
         * @json_add addTrack
         */
        this.tracks = [];
        /**
         * Gets or sets the rendering stylesheet for this song.
         */
        this.stylesheet = new RenderStylesheet();
    }
    rebuildRepeatGroups() {
        let currentGroup = new RepeatGroup();
        for (let bar of this.masterBars) {
            // if the group is closed only the next upcoming header can
            // reopen the group in case of a repeat alternative, so we
            // remove the current group
            if (bar.isRepeatStart || (this._currentRepeatGroup.isClosed && bar.alternateEndings <= 0)) {
                currentGroup = new RepeatGroup();
            }
            currentGroup.addMasterBar(bar);
        }
    }
    addMasterBar(bar) {
        bar.score = this;
        bar.index = this.masterBars.length;
        if (this.masterBars.length !== 0) {
            bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
            bar.previousMasterBar.nextMasterBar = bar;
            bar.start = bar.previousMasterBar.start + bar.previousMasterBar.calculateDuration();
        }
        // if the group is closed only the next upcoming header can
        // reopen the group in case of a repeat alternative, so we
        // remove the current group
        if (bar.isRepeatStart || (this._currentRepeatGroup.isClosed && bar.alternateEndings <= 0)) {
            this._currentRepeatGroup = new RepeatGroup();
        }
        this._currentRepeatGroup.addMasterBar(bar);
        this.masterBars.push(bar);
    }
    addTrack(track) {
        track.score = this;
        track.index = this.tracks.length;
        this.tracks.push(track);
    }
    finish(settings) {
        this._noteByIdLookup.clear();
        for (let i = 0, j = this.tracks.length; i < j; i++) {
            this.tracks[i].finish(settings);
        }
    }
    registerNote(note) {
        this._noteByIdLookup.set(note.id, note);
    }
    getNoteById(noteId) {
        return this._noteByIdLookup.has(noteId)
            ? this._noteByIdLookup.get(noteId)
            : null;
    }
}
//# sourceMappingURL=Score.js.map
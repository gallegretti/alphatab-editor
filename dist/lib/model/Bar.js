import { Clef } from '@src/model/Clef';
import { Ottavia } from '@src/model/Ottavia';
import { SimileMark } from '@src/model/SimileMark';
/**
 * A bar is a single block within a track, also known as Measure.
 * @json
 */
export class Bar {
    constructor() {
        /**
         * Gets or sets the unique id of this bar.
         */
        this.id = Bar._globalBarId++;
        /**
         * Gets or sets the zero-based index of this bar within the staff.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets the next bar that comes after this bar.
         * @json_ignore
         */
        this.nextBar = null;
        /**
         * Gets or sets the previous bar that comes before this bar.
         * @json_ignore
         */
        this.previousBar = null;
        /**
         * Gets or sets the clef on this bar.
         */
        this.clef = Clef.G2;
        /**
         * Gets or sets the ottava applied to the clef.
         */
        this.clefOttava = Ottavia.Regular;
        /**
         * Gets or sets the list of voices contained in this bar.
         * @json_add addVoice
         */
        this.voices = [];
        /**
         * Gets or sets the simile mark on this bar.
         */
        this.simileMark = SimileMark.None;
        /**
         * Gets a value indicating whether this bar contains multiple voices with notes.
         * @json_ignore
         */
        this.isMultiVoice = false;
    }
    get masterBar() {
        return this.staff.track.score.masterBars[this.index];
    }
    get isEmpty() {
        for (let i = 0, j = this.voices.length; i < j; i++) {
            if (!this.voices[i].isEmpty) {
                return false;
            }
        }
        return true;
    }
    addVoice(voice) {
        voice.bar = this;
        voice.index = this.voices.length;
        this.voices.push(voice);
    }
    finish(settings) {
        this.isMultiVoice = false;
        for (let i = 0, j = this.voices.length; i < j; i++) {
            let voice = this.voices[i];
            voice.finish(settings);
            if (i > 0 && !voice.isEmpty) {
                this.isMultiVoice = true;
            }
        }
    }
    calculateDuration() {
        let duration = 0;
        for (let voice of this.voices) {
            let voiceDuration = voice.calculateDuration();
            if (voiceDuration > duration) {
                duration = voiceDuration;
            }
        }
        return duration;
    }
}
Bar._globalBarId = 0;
//# sourceMappingURL=Bar.js.map
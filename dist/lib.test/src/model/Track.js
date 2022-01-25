import { Color } from '@src/model/Color';
import { PlaybackInformation } from '@src/model/PlaybackInformation';
import { Staff } from '@src/model/Staff';
/**
 * This public class describes a single track or instrument of score.
 * It is bascially a list of staffs containing individual music notation kinds.
 * @json
 */
export class Track {
    constructor() {
        /**
         * Gets or sets the zero-based index of this track.
         * @json_ignore
         */
        this.index = 0;
        /**
         * Gets or sets the list of staffs that are defined for this track.
         * @json_add addStaff
         */
        this.staves = [];
        /**
         * Gets or sets the playback information for this track.
         */
        this.playbackInfo = new PlaybackInformation();
        /**
         * Gets or sets the display color defined for this track.
         */
        this.color = new Color(200, 0, 0, 255);
        /**
         * Gets or sets the long name of this track.
         */
        this.name = '';
        /**
         * Gets or sets the short name of this track.
         */
        this.shortName = '';
        /**
         * Gets or sets a mapping on which staff liens particular percussion instruments
         * should be shown.
         */
        this.percussionArticulations = [];
    }
    ensureStaveCount(staveCount) {
        while (this.staves.length < staveCount) {
            this.addStaff(new Staff());
        }
    }
    addStaff(staff) {
        staff.index = this.staves.length;
        staff.track = this;
        this.staves.push(staff);
    }
    finish(settings) {
        if (!this.shortName) {
            this.shortName = this.name;
            if (this.shortName.length > Track.ShortNameMaxLength) {
                this.shortName = this.shortName.substr(0, Track.ShortNameMaxLength);
            }
        }
        for (let i = 0, j = this.staves.length; i < j; i++) {
            this.staves[i].finish(settings);
        }
    }
    applyLyrics(lyrics) {
        for (let lyric of lyrics) {
            lyric.finish();
        }
        let staff = this.staves[0];
        for (let li = 0; li < lyrics.length; li++) {
            let lyric = lyrics[li];
            if (lyric.startBar >= 0 && lyric.startBar < staff.bars.length) {
                let beat = staff.bars[lyric.startBar].voices[0].beats[0];
                for (let ci = 0; ci < lyric.chunks.length && beat; ci++) {
                    // skip rests and empty beats
                    while (beat && (beat.isEmpty || beat.isRest)) {
                        beat = beat.nextBeat;
                    }
                    // mismatch between chunks and beats might lead to missing beats
                    if (beat) {
                        // initialize lyrics list for beat if required
                        if (!beat.lyrics) {
                            beat.lyrics = new Array(lyrics.length);
                        }
                        // assign chunk
                        beat.lyrics[li] = lyric.chunks[ci];
                        beat = beat.nextBeat;
                    }
                }
            }
        }
    }
}
Track.ShortNameMaxLength = 10;
//# sourceMappingURL=Track.js.map
import { Color } from '@src/model/Color';
import { Lyrics } from '@src/model/Lyrics';
import { PlaybackInformation } from '@src/model/PlaybackInformation';
import { Score } from '@src/model/Score';
import { Staff } from '@src/model/Staff';
import { Settings } from '@src/Settings';
import { InstrumentArticulation } from './InstrumentArticulation';
/**
 * This public class describes a single track or instrument of score.
 * It is bascially a list of staffs containing individual music notation kinds.
 * @json
 */
export declare class Track {
    private static readonly ShortNameMaxLength;
    /**
     * Gets or sets the zero-based index of this track.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the reference this track belongs to.
     * @json_ignore
     */
    score: Score;
    /**
     * Gets or sets the list of staffs that are defined for this track.
     * @json_add addStaff
     */
    staves: Staff[];
    /**
     * Gets or sets the playback information for this track.
     */
    playbackInfo: PlaybackInformation;
    /**
     * Gets or sets the display color defined for this track.
     */
    color: Color;
    /**
     * Gets or sets the long name of this track.
     */
    name: string;
    /**
     * Gets or sets the short name of this track.
     */
    shortName: string;
    /**
     * Gets or sets a mapping on which staff liens particular percussion instruments
     * should be shown.
     */
    percussionArticulations: InstrumentArticulation[];
    ensureStaveCount(staveCount: number): void;
    addStaff(staff: Staff): void;
    finish(settings: Settings): void;
    applyLyrics(lyrics: Lyrics[]): void;
}

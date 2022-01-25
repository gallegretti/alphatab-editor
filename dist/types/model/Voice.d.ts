import { Bar } from '@src/model/Bar';
import { Beat } from '@src/model/Beat';
import { Settings } from '@src/Settings';
/**
 * A voice represents a group of beats
 * that can be played during a bar.
 * @json
 */
export declare class Voice {
    private _beatLookup;
    private static _globalBarId;
    /**
     * Gets or sets the unique id of this bar.
     */
    id: number;
    /**
     * Gets or sets the zero-based index of this voice within the bar.
     * @json_ignore
     */
    index: number;
    /**
     * Gets or sets the reference to the bar this voice belongs to.
     * @json_ignore
     */
    bar: Bar;
    /**
     * Gets or sets the list of beats contained in this voice.
     * @json_add addBeat
     */
    beats: Beat[];
    /**
     * Gets or sets a value indicating whether this voice is empty.
     */
    isEmpty: boolean;
    insertBeat(after: Beat, newBeat: Beat): void;
    addBeat(beat: Beat): void;
    private chain;
    addGraceBeat(beat: Beat): void;
    getBeatAtPlaybackStart(playbackStart: number): Beat | null;
    finish(settings: Settings): void;
    calculateDuration(): number;
}

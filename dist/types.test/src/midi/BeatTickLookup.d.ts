import { Beat } from '@src/model/Beat';
import { MasterBarTickLookup } from './MasterBarTickLookup';
/**
 * Represents the time period, for which a {@link Beat} is played.
 */
export declare class BeatTickLookup {
    private _highlightedBeats;
    /**
     * Gets or sets the index of the lookup within the parent MasterBarTickLookup.
     */
    index: number;
    /**
     * Gets or sets the parent MasterBarTickLookup to which this beat lookup belongs to.
     */
    masterBar: MasterBarTickLookup;
    /**
     * Gets or sets the start time in midi ticks at which the given beat is played.
     */
    start: number;
    /**
     * Gets or sets the end time in midi ticks at which the given beat is played.
     */
    end: number;
    /**
     * Gets or sets the beat which is played.
     */
    beat: Beat;
    /**
     * Gets or sets whether the beat is the placeholder beat for an empty bar.
     */
    isEmptyBar: boolean;
    /**
     * Gets or sets a list of all beats that should be highlighted when
     * the beat of this lookup starts playing.
     */
    beatsToHighlight: Beat[];
    highlightBeat(beat: Beat): void;
}

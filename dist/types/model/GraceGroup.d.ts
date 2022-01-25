import { Beat } from './Beat';
/**
 * Represents a group of grace beats that belong together
 */
export declare class GraceGroup {
    /**
     * All beats within this group.
     */
    beats: Beat[];
    /**
     * Gets a unique ID for this grace group.
     */
    id: string;
    /**
     * true if the grace beat are followed by a normal beat within the same
     * bar.
     */
    isComplete: boolean;
    /**
     * Adds a new beat to this group
     * @param beat The beat to add
     */
    addBeat(beat: Beat): void;
    finish(): void;
}

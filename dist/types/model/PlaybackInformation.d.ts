/**
 * This public class stores the midi specific information of a track needed
 * for playback.
 * @json
 */
export declare class PlaybackInformation {
    /**
     * Gets or sets the volume (0-16)
     */
    volume: number;
    /**
     * Gets or sets the balance (0-16; 8=center)
     */
    balance: number;
    /**
     * Gets or sets the midi port to use.
     */
    port: number;
    /**
     * Gets or sets the midi program to use.
     */
    program: number;
    /**
     * Gets or sets the primary channel for all normal midi events.
     */
    primaryChannel: number;
    /**
     * Gets or sets the secondary channel for special midi events.
     */
    secondaryChannel: number;
    /**
     * Gets or sets whether the track is muted.
     */
    isMute: boolean;
    /**
     * Gets or sets whether the track is playing alone.
     */
    isSolo: boolean;
}

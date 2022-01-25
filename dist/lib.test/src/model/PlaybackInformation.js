/**
 * This public class stores the midi specific information of a track needed
 * for playback.
 * @json
 */
export class PlaybackInformation {
    constructor() {
        /**
         * Gets or sets the volume (0-16)
         */
        this.volume = 15;
        /**
         * Gets or sets the balance (0-16; 8=center)
         */
        this.balance = 8;
        /**
         * Gets or sets the midi port to use.
         */
        this.port = 1;
        /**
         * Gets or sets the midi program to use.
         */
        this.program = 0;
        /**
         * Gets or sets the primary channel for all normal midi events.
         */
        this.primaryChannel = 0;
        /**
         * Gets or sets the secondary channel for special midi events.
         */
        this.secondaryChannel = 0;
        /**
         * Gets or sets whether the track is muted.
         */
        this.isMute = false;
        /**
         * Gets or sets whether the track is playing alone.
         */
        this.isSolo = false;
    }
}
//# sourceMappingURL=PlaybackInformation.js.map
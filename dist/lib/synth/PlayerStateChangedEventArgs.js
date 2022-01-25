/**
 * Represents the info when the player state changes.
 */
export class PlayerStateChangedEventArgs {
    /**
     * Initializes a new instance of the {@link PlayerStateChangedEventArgs} class.
     * @param state The state.
     */
    constructor(state, stopped) {
        this.state = state;
        this.stopped = stopped;
    }
}
//# sourceMappingURL=PlayerStateChangedEventArgs.js.map
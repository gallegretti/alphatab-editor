/**
 * Represents the info when the time in the synthesizer changes.
 */
export class PositionChangedEventArgs {
    /**
     * Initializes a new instance of the {@link PositionChangedEventArgs} class.
     * @param currentTime The current time.
     * @param endTime The end time.
     * @param currentTick The current tick.
     * @param endTick The end tick.
     * @param isSeek Whether the time was seeked.
     */
    constructor(currentTime, endTime, currentTick, endTick, isSeek) {
        this.currentTime = currentTime;
        this.endTime = endTime;
        this.currentTick = currentTick;
        this.endTick = endTick;
        this.isSeek = isSeek;
    }
}
//# sourceMappingURL=PositionChangedEventArgs.js.map
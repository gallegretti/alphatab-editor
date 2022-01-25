/**
 * Lists the different states of the player
 */
export var PlayerState;
(function (PlayerState) {
    /**
     * Player is paused
     */
    PlayerState[PlayerState["Paused"] = 0] = "Paused";
    /**
     * Player is playing
     */
    PlayerState[PlayerState["Playing"] = 1] = "Playing";
})(PlayerState || (PlayerState = {}));
//# sourceMappingURL=PlayerState.js.map
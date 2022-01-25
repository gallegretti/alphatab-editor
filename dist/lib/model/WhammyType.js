/**
 * Lists all types of whammy bars
 */
export var WhammyType;
(function (WhammyType) {
    /**
     * No whammy at all
     */
    WhammyType[WhammyType["None"] = 0] = "None";
    /**
     * Individual points define the whammy in a flexible manner.
     * This system was mainly used in Guitar Pro 3-5
     */
    WhammyType[WhammyType["Custom"] = 1] = "Custom";
    /**
     * Simple dive to a lower or higher note.
     */
    WhammyType[WhammyType["Dive"] = 2] = "Dive";
    /**
     * A dive to a lower or higher note and releasing it back to normal.
     */
    WhammyType[WhammyType["Dip"] = 3] = "Dip";
    /**
     * Continue to hold the whammy at the position from a previous whammy.
     */
    WhammyType[WhammyType["Hold"] = 4] = "Hold";
    /**
     * Dive to a lower or higher note before playing it.
     */
    WhammyType[WhammyType["Predive"] = 5] = "Predive";
    /**
     * Dive to a lower or higher note before playing it, then change to another
     * note.
     */
    WhammyType[WhammyType["PrediveDive"] = 6] = "PrediveDive";
})(WhammyType || (WhammyType = {}));
//# sourceMappingURL=WhammyType.js.map
/**
 * Lists all types of grace notes
 */
export var GraceType;
(function (GraceType) {
    /**
     * No grace, normal beat.
     */
    GraceType[GraceType["None"] = 0] = "None";
    /**
     * The beat contains on-beat grace notes.
     */
    GraceType[GraceType["OnBeat"] = 1] = "OnBeat";
    /**
     * The beat contains before-beat grace notes.
     */
    GraceType[GraceType["BeforeBeat"] = 2] = "BeforeBeat";
    /**
     * The beat contains very special bend-grace notes used in SongBook style displays.
     */
    GraceType[GraceType["BendGrace"] = 3] = "BendGrace";
})(GraceType || (GraceType = {}));
//# sourceMappingURL=GraceType.js.map
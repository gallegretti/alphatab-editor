/**
 * Lists all stave profiles controlling which staves are shown.
 */
export var StaveProfile;
(function (StaveProfile) {
    /**
     * The profile is auto detected by the track configurations.
     */
    StaveProfile[StaveProfile["Default"] = 0] = "Default";
    /**
     * Standard music notation and guitar tablature are rendered.
     */
    StaveProfile[StaveProfile["ScoreTab"] = 1] = "ScoreTab";
    /**
     * Only standard music notation is rendered.
     */
    StaveProfile[StaveProfile["Score"] = 2] = "Score";
    /**
     * Only guitar tablature is rendered.
     */
    StaveProfile[StaveProfile["Tab"] = 3] = "Tab";
    /**
     * Only guitar tablature is rendered, but also rests and time signatures are not shown.
     * This profile is typically used in multi-track scenarios.
     */
    StaveProfile[StaveProfile["TabMixed"] = 4] = "TabMixed";
})(StaveProfile || (StaveProfile = {}));
//# sourceMappingURL=StaveProfile.js.map
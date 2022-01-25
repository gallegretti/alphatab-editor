/**
 * Lists the modes how accidentals are handled for notes
 */
export var NoteAccidentalMode;
(function (NoteAccidentalMode) {
    /**
     * Accidentals are calculated automatically.
     */
    NoteAccidentalMode[NoteAccidentalMode["Default"] = 0] = "Default";
    /**
     * This will try to ensure that no accidental is shown.
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceNone"] = 1] = "ForceNone";
    /**
     * This will move the note one line down and applies a Naturalize.
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceNatural"] = 2] = "ForceNatural";
    /**
     * This will move the note one line down and applies a Sharp.
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceSharp"] = 3] = "ForceSharp";
    /**
     * This will move the note to be shown 2 half-notes deeper with a double sharp symbol
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleSharp"] = 4] = "ForceDoubleSharp";
    /**
     * This will move the note one line up and applies a Flat.
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceFlat"] = 5] = "ForceFlat";
    /**
     * This will move the note two half notes up with a double flag symbol.
     */
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleFlat"] = 6] = "ForceDoubleFlat";
})(NoteAccidentalMode || (NoteAccidentalMode = {}));
//# sourceMappingURL=NoteAccidentalMode.js.map
/**
 * Defines all possible accidentals for notes.
 */
export var AccidentalType;
(function (AccidentalType) {
    /**
     * No accidental
     */
    AccidentalType[AccidentalType["None"] = 0] = "None";
    /**
     * Naturalize
     */
    AccidentalType[AccidentalType["Natural"] = 1] = "Natural";
    /**
     * Sharp
     */
    AccidentalType[AccidentalType["Sharp"] = 2] = "Sharp";
    /**
     * Flat
     */
    AccidentalType[AccidentalType["Flat"] = 3] = "Flat";
    /**
     * Natural for smear bends
     */
    AccidentalType[AccidentalType["NaturalQuarterNoteUp"] = 4] = "NaturalQuarterNoteUp";
    /**
     * Sharp for smear bends
     */
    AccidentalType[AccidentalType["SharpQuarterNoteUp"] = 5] = "SharpQuarterNoteUp";
    /**
     * Flat for smear bends
     */
    AccidentalType[AccidentalType["FlatQuarterNoteUp"] = 6] = "FlatQuarterNoteUp";
    /**
     * Double Sharp, indicated by an 'x'
     */
    AccidentalType[AccidentalType["DoubleSharp"] = 7] = "DoubleSharp";
    /**
     * Double Flat, indicated by 'bb'
     */
    AccidentalType[AccidentalType["DoubleFlat"] = 8] = "DoubleFlat";
})(AccidentalType || (AccidentalType = {}));
//# sourceMappingURL=AccidentalType.js.map
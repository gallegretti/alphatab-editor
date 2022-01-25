/**
 * Lists all types how two voices can be joined with bars.
 */
export var BeamBarType;
(function (BeamBarType) {
    /**
     * Full Bar from current to next
     */
    BeamBarType[BeamBarType["Full"] = 0] = "Full";
    /**
     * A small Bar from current to previous
     */
    BeamBarType[BeamBarType["PartLeft"] = 1] = "PartLeft";
    /**
     * A small bar from current to next
     */
    BeamBarType[BeamBarType["PartRight"] = 2] = "PartRight";
})(BeamBarType || (BeamBarType = {}));
//# sourceMappingURL=BeamBarType.js.map
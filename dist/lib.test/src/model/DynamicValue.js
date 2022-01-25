/**
 * Lists all dynamics.
 */
export var DynamicValue;
(function (DynamicValue) {
    /**
     * pianississimo (very very soft)
     */
    DynamicValue[DynamicValue["PPP"] = 0] = "PPP";
    /**
     * pianissimo (very soft)
     */
    DynamicValue[DynamicValue["PP"] = 1] = "PP";
    /**
     * piano (soft)
     */
    DynamicValue[DynamicValue["P"] = 2] = "P";
    /**
     * mezzo-piano (half soft)
     */
    DynamicValue[DynamicValue["MP"] = 3] = "MP";
    /**
     * mezzo-forte (half loud)
     */
    DynamicValue[DynamicValue["MF"] = 4] = "MF";
    /**
     * forte (loud)
     */
    DynamicValue[DynamicValue["F"] = 5] = "F";
    /**
     * fortissimo (very loud)
     */
    DynamicValue[DynamicValue["FF"] = 6] = "FF";
    /**
     * fortississimo (very very loud)
     */
    DynamicValue[DynamicValue["FFF"] = 7] = "FFF";
})(DynamicValue || (DynamicValue = {}));
//# sourceMappingURL=DynamicValue.js.map
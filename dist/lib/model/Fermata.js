/**
 * Lists all types of fermatas
 */
export var FermataType;
(function (FermataType) {
    /**
     * A short fermata (triangle symbol)
     */
    FermataType[FermataType["Short"] = 0] = "Short";
    /**
     * A medium fermata (round symbol)
     */
    FermataType[FermataType["Medium"] = 1] = "Medium";
    /**
     * A long fermata (rectangular symbol)
     */
    FermataType[FermataType["Long"] = 2] = "Long";
})(FermataType || (FermataType = {}));
/**
 * Represents a fermata.
 * @json
 */
export class Fermata {
    constructor() {
        /**
         * Gets or sets the type of fermata.
         */
        this.type = FermataType.Short;
        /**
         * Gets or sets the actual lenght of the fermata.
         */
        this.length = 0;
    }
}
//# sourceMappingURL=Fermata.js.map
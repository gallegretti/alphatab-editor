export var AlphaTabErrorType;
(function (AlphaTabErrorType) {
    AlphaTabErrorType[AlphaTabErrorType["General"] = 0] = "General";
    AlphaTabErrorType[AlphaTabErrorType["Format"] = 1] = "Format";
    AlphaTabErrorType[AlphaTabErrorType["AlphaTex"] = 2] = "AlphaTex";
})(AlphaTabErrorType || (AlphaTabErrorType = {}));
export class AlphaTabError extends Error {
    constructor(type, message = "", inner) {
        super(message);
        this.type = type;
        this.inner = inner !== null && inner !== void 0 ? inner : null;
        Object.setPrototypeOf(this, AlphaTabError.prototype);
    }
}
//# sourceMappingURL=AlphaTabError.js.map
/**
 * @target web
 */
export class Lazy {
    constructor(factory) {
        this._value = undefined;
        this._factory = factory;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._factory();
        }
        return this._value;
    }
}
//# sourceMappingURL=Lazy.js.map
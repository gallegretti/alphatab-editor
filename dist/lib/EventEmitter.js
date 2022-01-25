export class EventEmitter {
    constructor() {
        this._listeners = [];
    }
    on(value) {
        this._listeners.push(value);
    }
    off(value) {
        this._listeners = this._listeners.filter(l => l !== value);
    }
    trigger() {
        for (const l of this._listeners) {
            l();
        }
    }
}
/**
 * @partial
 */
export class EventEmitterOfT {
    constructor() {
        this._listeners = [];
    }
    on(value) {
        this._listeners.push(value);
    }
    off(value) {
        this._listeners = this._listeners.filter(l => l !== value);
    }
    trigger(arg) {
        for (const l of this._listeners) {
            l(arg);
        }
    }
}
//# sourceMappingURL=EventEmitter.js.map
/**
 * A very basic polyfill of the ResizeObserver which triggers
 * a the callback on window resize for all registered targets.
 * @target web
 */
export class ResizeObserverPolyfill {
    constructor(callback) {
        this._targets = new Set();
        this._callback = callback;
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
    observe(target) {
        this._targets.add(target);
    }
    unobserve(target) {
        this._targets.delete(target);
    }
    disconnect() {
        this._targets.clear();
    }
    onWindowResize() {
        const entries = [];
        for (const t of this._targets) {
            entries.push({
                target: t,
                // not used by alphaTab
                contentRect: undefined,
                borderBoxSize: undefined,
                contentBoxSize: []
            });
        }
        this._callback(entries, this);
    }
}
//# sourceMappingURL=ResizeObserverPolyfill.js.map
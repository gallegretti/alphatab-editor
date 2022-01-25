/**
 * A polyfill of the InsersectionObserver
 * @target web
 */
export class IntersectionObserverPolyfill {
    constructor(callback) {
        this._elements = [];
        let timer = null;
        const oldCheck = this._check.bind(this);
        this._check = () => {
            if (!timer) {
                timer = setTimeout(() => {
                    oldCheck();
                    timer = null;
                }, 100);
            }
        };
        this._callback = callback;
        window.addEventListener('resize', this._check, true);
        document.addEventListener('scroll', this._check, true);
    }
    observe(target) {
        if (this._elements.indexOf(target) >= 0) {
            return;
        }
        this._elements.push(target);
        this._check();
    }
    unobserve(target) {
        this._elements = this._elements.filter(item => {
            return item != target;
        });
    }
    ;
    _check() {
        const entries = [];
        this._elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = (rect.top + rect.height >= 0 &&
                rect.top <= window.innerHeight &&
                rect.left + rect.width >= 0 &&
                rect.left <= window.innerWidth);
            if (isVisible) {
                entries.push({
                    target: element,
                    isIntersecting: true
                });
            }
        });
        if (entries.length) {
            this._callback(entries, this);
        }
    }
}
//# sourceMappingURL=IntersectionObserverPolyfill.js.map
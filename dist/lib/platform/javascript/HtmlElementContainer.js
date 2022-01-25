import { BrowserMouseEventArgs } from '@src/platform/javascript/BrowserMouseEventArgs';
import { Bounds } from '@src/rendering/utils/Bounds';
import { Lazy } from '@src/util/Lazy';
/**
 * @target web
 */
export class HtmlElementContainer {
    constructor(element) {
        this._resizeListeners = 0;
        this._lastBounds = new Bounds();
        this.element = element;
        this.mouseDown = {
            on: (value) => {
                this.element.addEventListener('mousedown', e => {
                    value(new BrowserMouseEventArgs(e));
                }, true);
            },
            off: (value) => {
                // not supported due to wrapping
            }
        };
        this.mouseUp = {
            on: (value) => {
                this.element.addEventListener('mouseup', e => {
                    value(new BrowserMouseEventArgs(e));
                }, true);
            },
            off: (value) => {
                // not supported due to wrapping
            }
        };
        this.mouseMove = {
            on: (value) => {
                this.element.addEventListener('mousemove', e => {
                    value(new BrowserMouseEventArgs(e));
                }, true);
            },
            off: (_) => {
                // not supported due to wrapping
            }
        };
        this.resize = {
            on: (value) => {
                if (this._resizeListeners === 0) {
                    HtmlElementContainer.resizeObserver.value.observe(this.element);
                }
                this.element.addEventListener('resize', value, true);
                this._resizeListeners++;
            },
            off: (value) => {
                this.element.removeEventListener('resize', value, true);
                this._resizeListeners--;
                if (this._resizeListeners <= 0) {
                    this._resizeListeners = 0;
                    HtmlElementContainer.resizeObserver.value.unobserve(this.element);
                }
            }
        };
    }
    get width() {
        return this.element.offsetWidth;
    }
    set width(value) {
        this.element.style.width = value + 'px';
    }
    get scrollLeft() {
        return this.element.scrollLeft;
    }
    set scrollLeft(value) {
        this.element.scrollTop = value;
    }
    get scrollTop() {
        return this.element.scrollLeft;
    }
    set scrollTop(value) {
        this.element.scrollTop = value;
    }
    get height() {
        return this.element.offsetHeight;
    }
    set height(value) {
        if (value >= 0) {
            this.element.style.height = value + 'px';
        }
        else {
            this.element.style.height = '100%';
        }
    }
    get isVisible() {
        return !!this.element.offsetWidth || !!this.element.offsetHeight || !!this.element.getClientRects().length;
    }
    stopAnimation() {
        this.element.style.transition = 'none';
    }
    transitionToX(duration, x) {
        this.element.style.transition = `transform ${duration}ms linear`;
        this.setBounds(x, NaN, NaN, NaN);
    }
    setBounds(x, y, w, h) {
        if (isNaN(x)) {
            x = this._lastBounds.x;
        }
        if (isNaN(y)) {
            y = this._lastBounds.y;
        }
        if (isNaN(w)) {
            w = this._lastBounds.w;
        }
        if (isNaN(h)) {
            h = this._lastBounds.h;
        }
        this.element.style.transform = `translate(${x}px, ${y}px) scale(${w}, ${h})`;
        this.element.style.transformOrigin = 'top left';
        this._lastBounds.x = x;
        this._lastBounds.y = y;
        this._lastBounds.w = w;
        this._lastBounds.h = h;
    }
    appendChild(child) {
        this.element.appendChild(child.element);
    }
    clear() {
        this.element.innerHTML = '';
    }
}
HtmlElementContainer.resizeObserver = new Lazy(() => new ResizeObserver((entries) => {
    for (const e of entries) {
        let evt = new CustomEvent('resize', {
            detail: e
        });
        e.target.dispatchEvent(evt);
    }
}));
//# sourceMappingURL=HtmlElementContainer.js.map
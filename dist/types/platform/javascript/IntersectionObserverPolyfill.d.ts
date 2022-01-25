/**
 * A polyfill of the InsersectionObserver
 * @target web
 */
export declare class IntersectionObserverPolyfill {
    private _callback;
    private _elements;
    constructor(callback: IntersectionObserverCallback);
    observe(target: HTMLElement): void;
    unobserve(target: HTMLElement): void;
    private _check;
}

import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
import { IContainer } from '@src/platform/IContainer';
import { IMouseEventArgs } from '@src/platform/IMouseEventArgs';
/**
 * @target web
 */
export declare class HtmlElementContainer implements IContainer {
    private static resizeObserver;
    private _resizeListeners;
    get width(): number;
    set width(value: number);
    get scrollLeft(): number;
    set scrollLeft(value: number);
    get scrollTop(): number;
    set scrollTop(value: number);
    get height(): number;
    set height(value: number);
    get isVisible(): boolean;
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    stopAnimation(): void;
    transitionToX(duration: number, x: number): void;
    private _lastBounds;
    setBounds(x: number, y: number, w: number, h: number): void;
    /**
     * This event occurs when the control was resized.
     */
    resize: IEventEmitter;
    /**
     * This event occurs when a mouse/finger press happened on the control.
     */
    mouseDown: IEventEmitterOfT<IMouseEventArgs>;
    /**
     * This event occurs when a mouse/finger moves on top of the control.
     */
    mouseMove: IEventEmitterOfT<IMouseEventArgs>;
    /**
     * This event occurs when a mouse/finger is released from the control.
     */
    mouseUp: IEventEmitterOfT<IMouseEventArgs>;
    appendChild(child: IContainer): void;
    clear(): void;
}

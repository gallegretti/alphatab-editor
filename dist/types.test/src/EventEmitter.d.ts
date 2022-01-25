export interface IEventEmitter {
    on(value: () => void): void;
    off(value: () => void): void;
}
/**
 * @partial
 */
export interface IEventEmitterOfT<T> {
    on(value: (arg: T) => void): void;
    off(value: (arg: T) => void): void;
}
export declare class EventEmitter implements IEventEmitter {
    private _listeners;
    on(value: () => void): void;
    off(value: () => void): void;
    trigger(): void;
}
/**
 * @partial
 */
export declare class EventEmitterOfT<T> implements IEventEmitterOfT<T> {
    private _listeners;
    on(value: (arg: T) => void): void;
    off(value: (arg: T) => void): void;
    trigger(arg: T): void;
}

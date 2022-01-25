import { IEventEmitterOfT } from '@src/EventEmitter';
/**
 * This small utility helps to detect whether a particular font is already loaded.
 * @target web
 */
export declare class FontLoadingChecker {
    private _family;
    private _isStarted;
    isFontLoaded: boolean;
    fontLoaded: IEventEmitterOfT<string>;
    constructor(family: string);
    checkForFontAvailability(): void;
}

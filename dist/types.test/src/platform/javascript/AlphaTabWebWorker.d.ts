import { IWorkerScope } from '@src/platform/javascript/IWorkerScope';
/**
 * @target web
 */
export declare class AlphaTabWebWorker {
    private _renderer;
    private _main;
    constructor(main: IWorkerScope);
    static init(): void;
    private handleMessage;
    private updateFontSizes;
    private updateSettings;
    private renderMultiple;
    private error;
}

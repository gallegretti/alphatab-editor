import { IContainer } from '@src/platform/IContainer';
import { IMouseEventArgs } from '@src/platform/IMouseEventArgs';
/**
 * @target web
 */
export declare class BrowserMouseEventArgs implements IMouseEventArgs {
    readonly mouseEvent: MouseEvent;
    get isLeftMouseButton(): boolean;
    getX(relativeTo: IContainer): number;
    getY(relativeTo: IContainer): number;
    preventDefault(): void;
    constructor(e: MouseEvent);
}

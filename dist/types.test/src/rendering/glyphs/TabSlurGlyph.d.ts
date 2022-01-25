import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { TabTieGlyph } from '@src/rendering/glyphs/TabTieGlyph';
export declare class TabSlurGlyph extends TabTieGlyph {
    private _direction;
    private _forSlide;
    constructor(startNote: Note, endNote: Note, forSlide: boolean, forEnd?: boolean);
    protected getTieHeight(startX: number, startY: number, endX: number, endY: number): number;
    tryExpand(startNote: Note, endNote: Note, forSlide: boolean, forEnd: boolean): boolean;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}

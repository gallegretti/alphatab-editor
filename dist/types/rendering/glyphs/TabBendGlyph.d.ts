import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class TabBendGlyph extends Glyph {
    private static readonly ArrowSize;
    private static readonly DashSize;
    private static readonly BendValueHeight;
    private _notes;
    private _renderPoints;
    private _preBendMinValue;
    private _bendMiddleMinValue;
    private _bendEndMinValue;
    private _bendEndContinuedMinValue;
    private _releaseMinValue;
    private _releaseContinuedMinValue;
    private _maxBendValue;
    constructor();
    addBends(note: Note): void;
    doLayout(): void;
    private createRenderingPoints;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private paintBend;
    static getFractionSign(steps: number): string;
}

import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class TabWhammyBarGlyph extends Glyph {
    private static readonly TopOffsetSharedDataKey;
    static readonly PerHalfSize: number;
    private static readonly DashSize;
    private _beat;
    private _renderPoints;
    private _isSimpleDip;
    constructor(beat: Beat);
    private createRenderingPoints;
    doLayout(): void;
    private getOffset;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private paintWhammy;
}

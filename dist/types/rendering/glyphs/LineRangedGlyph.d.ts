import { ICanvas } from '@src/platform/ICanvas';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export declare class LineRangedGlyph extends GroupedEffectGlyph {
    static readonly LineSpacing: number;
    static readonly LineTopPadding: number;
    static readonly LineTopOffset: number;
    static readonly LineSize: number;
    private _label;
    constructor(label: string);
    doLayout(): void;
    protected paintNonGrouped(cx: number, cy: number, canvas: ICanvas): void;
    protected paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}

import { CrescendoType } from '@src/model/CrescendoType';
import { ICanvas } from '@src/platform/ICanvas';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export declare class CrescendoGlyph extends GroupedEffectGlyph {
    private static readonly Padding;
    private _crescendo;
    constructor(x: number, y: number, crescendo: CrescendoType);
    doLayout(): void;
    protected paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}

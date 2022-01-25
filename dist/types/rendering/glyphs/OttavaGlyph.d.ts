import { Ottavia } from '@src/model/Ottavia';
import { ICanvas } from '@src/platform/ICanvas';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export declare class OttavaGlyph extends GroupedEffectGlyph {
    private _ottava;
    private _aboveStaff;
    constructor(ottava: Ottavia, aboveStaff: boolean);
    doLayout(): void;
    protected paintNonGrouped(cx: number, cy: number, canvas: ICanvas): void;
    private paintOttava;
    protected paintGrouped(cx: number, cy: number, endX: number, canvas: ICanvas): void;
}

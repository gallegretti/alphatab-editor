import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class TieGlyph extends Glyph {
    protected startBeat: Beat | null;
    protected endBeat: Beat | null;
    protected yOffset: number;
    protected forEnd: boolean;
    protected startNoteRenderer: BarRendererBase | null;
    protected endNoteRenderer: BarRendererBase | null;
    protected tieDirection: BeamDirection;
    constructor(startBeat: Beat | null, endBeat: Beat | null, forEnd: boolean);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    protected shouldDrawBendSlur(): boolean;
    protected getTieHeight(startX: number, startY: number, endX: number, endY: number): number;
    protected getBeamDirection(beat: Beat, noteRenderer: BarRendererBase): BeamDirection;
    protected getStartY(): number;
    protected getEndY(): number;
    protected getStartX(): number;
    protected getEndX(): number;
    static paintTie(canvas: ICanvas, scale: number, x1: number, y1: number, x2: number, y2: number, down?: boolean, offset?: number, size?: number): void;
    private static readonly BendSlurHeight;
    static drawBendSlur(canvas: ICanvas, x1: number, y1: number, x2: number, y2: number, down: boolean, scale: number, slurText?: string): void;
}

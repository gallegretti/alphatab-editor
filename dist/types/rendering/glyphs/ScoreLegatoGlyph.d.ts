import { Beat } from '@src/model/Beat';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class ScoreLegatoGlyph extends TieGlyph {
    constructor(startBeat: Beat, endBeat: Beat, forEnd?: boolean);
    doLayout(): void;
    protected getBeamDirection(beat: Beat, noteRenderer: BarRendererBase): BeamDirection;
    protected getStartY(): number;
    protected getEndY(): number;
    protected getStartX(): number;
    protected getEndX(): number;
}

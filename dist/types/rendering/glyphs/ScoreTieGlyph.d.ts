import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class ScoreTieGlyph extends TieGlyph {
    protected startNote: Note;
    protected endNote: Note;
    constructor(startNote: Note, endNote: Note, forEnd?: boolean);
    protected shouldDrawBendSlur(): boolean;
    doLayout(): void;
    protected getBeamDirection(beat: Beat, noteRenderer: BarRendererBase): BeamDirection;
    protected getStartY(): number;
    protected getEndY(): number;
    protected getStartX(): number;
    protected getEndX(): number;
}

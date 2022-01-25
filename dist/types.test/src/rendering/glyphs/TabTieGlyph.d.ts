import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class TabTieGlyph extends TieGlyph {
    protected startNote: Note;
    protected endNote: Note;
    constructor(startNote: Note, endNote: Note, forEnd?: boolean);
    protected getTieHeight(startX: number, startY: number, endX: number, endY: number): number;
    protected getBeamDirection(beat: Beat, noteRenderer: BarRendererBase): BeamDirection;
    protected static getBeamDirectionForNote(note: Note): BeamDirection;
    protected getStartY(): number;
    protected getEndY(): number;
    protected getStartX(): number;
    protected getEndX(): number;
}

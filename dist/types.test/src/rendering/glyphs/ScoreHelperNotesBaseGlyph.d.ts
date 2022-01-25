import { Beat } from '@src/model/Beat';
import { ICanvas } from '@src/platform/ICanvas';
import { BendNoteHeadGroupGlyph } from '@src/rendering/glyphs/BendNoteHeadGroupGlyph';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { ScoreBarRenderer } from '@src/rendering/ScoreBarRenderer';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export declare class ScoreHelperNotesBaseGlyph extends Glyph {
    static readonly EndPadding: number;
    protected BendNoteHeads: BendNoteHeadGroupGlyph[];
    protected drawBendSlur(canvas: ICanvas, x1: number, y1: number, x2: number, y2: number, down: boolean, scale: number, slurText?: string): void;
    doLayout(): void;
    protected getTieDirection(beat: Beat, noteRenderer: ScoreBarRenderer): BeamDirection;
}

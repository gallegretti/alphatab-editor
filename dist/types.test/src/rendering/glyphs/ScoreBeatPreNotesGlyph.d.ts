import { AccidentalGroupGlyph } from '@src/rendering/glyphs/AccidentalGroupGlyph';
import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
export declare class ScoreBeatPreNotesGlyph extends BeatGlyphBase {
    private _prebends;
    get prebendNoteHeadOffset(): number;
    accidentals: AccidentalGroupGlyph | null;
    doLayout(): void;
    private createAccidentalGlyph;
    constructor();
}

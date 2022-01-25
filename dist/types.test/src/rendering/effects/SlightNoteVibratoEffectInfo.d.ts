import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { NoteEffectInfoBase } from '@src/rendering/effects/NoteEffectInfoBase';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { NotationElement } from '@src/NotationSettings';
export declare class SlightNoteVibratoEffectInfo extends NoteEffectInfoBase {
    get notationElement(): NotationElement;
    protected shouldCreateGlyphForNote(note: Note): boolean;
    get sizingMode(): EffectBarGlyphSizing;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
    constructor();
}

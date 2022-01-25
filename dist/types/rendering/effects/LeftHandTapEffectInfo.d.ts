import { Beat } from '@src/model/Beat';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { NotationElement } from '@src/NotationSettings';
import { NoteEffectInfoBase } from './NoteEffectInfoBase';
import { Note } from '@src/model/Note';
export declare class LeftHandTapEffectInfo extends NoteEffectInfoBase {
    get notationElement(): NotationElement;
    get sizingMode(): EffectBarGlyphSizing;
    protected shouldCreateGlyphForNote(note: Note): boolean;
    createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph;
}

import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { Settings } from '@src/Settings';
export declare abstract class NoteEffectInfoBase extends EffectBarRendererInfo {
    protected lastCreateInfo: Note[] | null;
    shouldCreateGlyph(settings: Settings, beat: Beat): boolean;
    protected abstract shouldCreateGlyphForNote(note: Note): boolean;
    get hideOnMultiTrack(): boolean;
    get canShareBand(): boolean;
    canExpand(from: Beat, to: Beat): boolean;
}

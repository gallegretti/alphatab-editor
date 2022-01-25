import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
export class NoteEffectInfoBase extends EffectBarRendererInfo {
    constructor() {
        super(...arguments);
        this.lastCreateInfo = null;
    }
    shouldCreateGlyph(settings, beat) {
        this.lastCreateInfo = [];
        for (let i = 0, j = beat.notes.length; i < j; i++) {
            let n = beat.notes[i];
            if (this.shouldCreateGlyphForNote(n)) {
                this.lastCreateInfo.push(n);
            }
        }
        return this.lastCreateInfo.length > 0;
    }
    get hideOnMultiTrack() {
        return false;
    }
    get canShareBand() {
        return true;
    }
    canExpand(from, to) {
        return true;
    }
}
//# sourceMappingURL=NoteEffectInfoBase.js.map
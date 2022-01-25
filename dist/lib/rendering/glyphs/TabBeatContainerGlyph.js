import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { TabBendGlyph } from '@src/rendering/glyphs/TabBendGlyph';
import { TabSlideLineGlyph } from '@src/rendering/glyphs/TabSlideLineGlyph';
import { TabSlurGlyph } from '@src/rendering/glyphs/TabSlurGlyph';
import { TabTieGlyph } from '@src/rendering/glyphs/TabTieGlyph';
export class TabBeatContainerGlyph extends BeatContainerGlyph {
    constructor(beat, voiceContainer) {
        super(beat, voiceContainer);
        this._bend = null;
        this._effectSlurs = [];
    }
    doLayout() {
        this._effectSlurs = [];
        super.doLayout();
        if (this._bend) {
            this._bend.renderer = this.renderer;
            this._bend.doLayout();
            this.updateWidth();
        }
    }
    createTies(n) {
        if (!n.isVisible) {
            return;
        }
        let renderer = this.renderer;
        if (n.isTieOrigin && renderer.showTiedNotes && n.tieDestination.isVisible) {
            let tie = new TabTieGlyph(n, n.tieDestination, false);
            this.ties.push(tie);
        }
        if (n.isTieDestination && renderer.showTiedNotes) {
            let tie = new TabTieGlyph(n.tieOrigin, n, true);
            this.ties.push(tie);
        }
        if (n.isLeftHandTapped && !n.isHammerPullDestination) {
            let tapSlur = new TabTieGlyph(n, n, false);
            this.ties.push(tapSlur);
        }
        // start effect slur on first beat
        if (n.isEffectSlurOrigin && n.effectSlurDestination) {
            let expanded = false;
            for (let slur of this._effectSlurs) {
                if (slur.tryExpand(n, n.effectSlurDestination, false, false)) {
                    expanded = true;
                    break;
                }
            }
            if (!expanded) {
                let effectSlur = new TabSlurGlyph(n, n.effectSlurDestination, false, false);
                this._effectSlurs.push(effectSlur);
                this.ties.push(effectSlur);
            }
        }
        // end effect slur on last beat
        if (n.isEffectSlurDestination && n.effectSlurOrigin) {
            let expanded = false;
            for (let slur of this._effectSlurs) {
                if (slur.tryExpand(n.effectSlurOrigin, n, false, true)) {
                    expanded = true;
                    break;
                }
            }
            if (!expanded) {
                let effectSlur = new TabSlurGlyph(n.effectSlurOrigin, n, false, true);
                this._effectSlurs.push(effectSlur);
                this.ties.push(effectSlur);
            }
        }
        if (n.slideInType !== SlideInType.None || n.slideOutType !== SlideOutType.None) {
            let l = new TabSlideLineGlyph(n.slideInType, n.slideOutType, n, this);
            this.ties.push(l);
        }
        if (n.hasBend) {
            if (!this._bend) {
                const bend = new TabBendGlyph();
                this._bend = bend;
                bend.renderer = this.renderer;
                this.ties.push(bend);
            }
            this._bend.addBends(n);
        }
    }
}
//# sourceMappingURL=TabBeatContainerGlyph.js.map
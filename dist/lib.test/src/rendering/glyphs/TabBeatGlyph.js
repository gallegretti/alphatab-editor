import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
import { TabRhythmMode } from '@src/NotationSettings';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
import { CircleGlyph } from '@src/rendering/glyphs/CircleGlyph';
import { NoteNumberGlyph } from '@src/rendering/glyphs/NoteNumberGlyph';
import { SpacingGlyph } from '@src/rendering/glyphs/SpacingGlyph';
import { TabNoteChordGlyph } from '@src/rendering/glyphs/TabNoteChordGlyph';
import { TabRestGlyph } from '@src/rendering/glyphs/TabRestGlyph';
import { TabWhammyBarGlyph } from '@src/rendering/glyphs/TabWhammyBarGlyph';
import { TremoloPickingGlyph } from '@src/rendering/glyphs/TremoloPickingGlyph';
export class TabBeatGlyph extends BeatOnNoteGlyphBase {
    constructor() {
        super(...arguments);
        this.noteNumbers = null;
        this.restGlyph = null;
    }
    getNoteX(note, requestedPosition) {
        return this.noteNumbers ? this.noteNumbers.getNoteX(note, requestedPosition) : 0;
    }
    getNoteY(note, requestedPosition) {
        return this.noteNumbers ? this.noteNumbers.getNoteY(note, requestedPosition) : 0;
    }
    buildBoundingsLookup(beatBounds, cx, cy) {
        if (this.noteNumbers) {
            this.noteNumbers.buildBoundingsLookup(beatBounds, cx + this.x, cy + this.y);
        }
    }
    doLayout() {
        let tabRenderer = this.renderer;
        if (!this.container.beat.isRest) {
            //
            // Note numbers
            let isGrace = this.renderer.settings.notation.smallGraceTabNotes && this.container.beat.graceType !== GraceType.None;
            const noteNumbers = new TabNoteChordGlyph(0, 0, isGrace);
            this.noteNumbers = noteNumbers;
            noteNumbers.beat = this.container.beat;
            noteNumbers.beamingHelper = this.beamingHelper;
            for (let note of this.container.beat.notes) {
                if (note.isVisible) {
                    this.createNoteGlyph(note);
                }
            }
            this.addGlyph(noteNumbers);
            //
            // Whammy Bar
            if (this.container.beat.hasWhammyBar) {
                let whammy = new TabWhammyBarGlyph(this.container.beat);
                whammy.renderer = this.renderer;
                whammy.doLayout();
                this.container.ties.push(whammy);
            }
            //
            // Tremolo Picking
            if (this.container.beat.isTremolo && !this.noteNumbers.beatEffects.has('tremolo')) {
                let offset = 0;
                let speed = this.container.beat.tremoloSpeed;
                switch (speed) {
                    case Duration.ThirtySecond:
                        offset = 10;
                        break;
                    case Duration.Sixteenth:
                        offset = 5;
                        break;
                    case Duration.Eighth:
                        offset = 0;
                        break;
                }
                this.noteNumbers.beatEffects.set('tremolo', new TremoloPickingGlyph(5 * this.scale, offset * this.scale, speed));
            }
            //
            // Note dots
            //
            if (this.container.beat.dots > 0 && tabRenderer.settings.notation.rhythmMode !== TabRhythmMode.Hidden) {
                this.addGlyph(new SpacingGlyph(0, 0, 5 * this.scale));
                for (let i = 0; i < this.container.beat.dots; i++) {
                    this.addGlyph(new CircleGlyph(0, tabRenderer.lineOffset * tabRenderer.bar.staff.tuning.length +
                        tabRenderer.settings.notation.rhythmHeight * tabRenderer.scale, 1.5 * this.scale));
                }
            }
        }
        else {
            let line = Math.floor((this.renderer.bar.staff.tuning.length - 1) / 2);
            let y = tabRenderer.getTabY(line);
            const restGlyph = new TabRestGlyph(0, y, tabRenderer.showRests, this.container.beat.duration);
            this.restGlyph = restGlyph;
            restGlyph.beat = this.container.beat;
            restGlyph.beamingHelper = this.beamingHelper;
            this.addGlyph(restGlyph);
            //
            // Note dots
            //
            if (this.container.beat.dots > 0 && tabRenderer.showRests) {
                this.addGlyph(new SpacingGlyph(0, 0, 5 * this.scale));
                for (let i = 0; i < this.container.beat.dots; i++) {
                    this.addGlyph(new CircleGlyph(0, y, 1.5 * this.scale));
                }
            }
        }
        // left to right layout
        if (!this.glyphs) {
            return;
        }
        let w = 0;
        for (let i = 0, j = this.glyphs.length; i < j; i++) {
            let g = this.glyphs[i];
            g.x = w;
            g.renderer = this.renderer;
            g.doLayout();
            w += g.width;
        }
        this.width = w;
        this.computedWidth = w;
        if (this.container.beat.isEmpty) {
            this.centerX = this.width / 2;
        }
        else if (this.container.beat.isRest) {
            this.centerX = this.restGlyph.x + this.restGlyph.width / 2;
        }
        else {
            this.centerX = this.noteNumbers.x + this.noteNumbers.noteStringWidth / 2;
        }
    }
    updateBeamingHelper() {
        if (!this.container.beat.isRest) {
            this.noteNumbers.updateBeamingHelper(this.container.x + this.x);
        }
        else {
            this.restGlyph.updateBeamingHelper(this.container.x + this.x);
        }
    }
    createNoteGlyph(n) {
        let tr = this.renderer;
        let noteNumberGlyph = new NoteNumberGlyph(0, 0, n);
        let l = n.beat.voice.bar.staff.tuning.length - n.string;
        noteNumberGlyph.y = tr.getTabY(l);
        noteNumberGlyph.renderer = this.renderer;
        noteNumberGlyph.doLayout();
        this.noteNumbers.addNoteGlyph(noteNumberGlyph, n);
        let topY = noteNumberGlyph.y - noteNumberGlyph.height / 2;
        let bottomY = topY + noteNumberGlyph.height;
        this.renderer.helpers.collisionHelper.reserveBeatSlot(this.container.beat, topY, bottomY);
    }
}
//# sourceMappingURL=TabBeatGlyph.js.map
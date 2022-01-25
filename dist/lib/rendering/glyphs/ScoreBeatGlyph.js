import { AccentuationType } from '@src/model/AccentuationType';
import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
import { HarmonicType } from '@src/model/HarmonicType';
import { AccentuationGlyph } from '@src/rendering/glyphs/AccentuationGlyph';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
import { CircleGlyph } from '@src/rendering/glyphs/CircleGlyph';
import { DeadNoteHeadGlyph } from '@src/rendering/glyphs/DeadNoteHeadGlyph';
import { DiamondNoteHeadGlyph } from '@src/rendering/glyphs/DiamondNoteHeadGlyph';
import { GhostNoteContainerGlyph } from '@src/rendering/glyphs/GhostNoteContainerGlyph';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
import { ScoreNoteChordGlyph } from '@src/rendering/glyphs/ScoreNoteChordGlyph';
import { ScoreRestGlyph } from '@src/rendering/glyphs/ScoreRestGlyph';
import { ScoreWhammyBarGlyph } from '@src/rendering/glyphs/ScoreWhammyBarGlyph';
import { SpacingGlyph } from '@src/rendering/glyphs/SpacingGlyph';
import { PercussionMapper } from '../../model/PercussionMapper';
import { PercussionNoteHeadGlyph } from './PercussionNoteHeadGlyph';
import { Logger } from '@src/Logger';
import { ArticStaccatoAboveGlyph } from './ArticStaccatoAboveGlyph';
import { MusicFontSymbol } from '../../model/MusicFontSymbol';
import { TextBaseline } from '@src/platform/ICanvas';
import { PictEdgeOfCymbalGlyph } from './PictEdgeOfCymbalGlyph';
import { PickStrokeGlyph } from './PickStrokeGlyph';
import { PickStroke } from '@src/model/PickStroke';
import { GuitarGolpeGlyph } from './GuitarGolpeGlyph';
import { BeamingHelper } from '../utils/BeamingHelper';
export class ScoreBeatGlyph extends BeatOnNoteGlyphBase {
    constructor() {
        super(...arguments);
        this._collisionOffset = -1000;
        this._skipPaint = false;
        this.noteHeads = null;
        this.restGlyph = null;
    }
    getNoteX(note, requestedPosition) {
        return this.noteHeads ? this.noteHeads.getNoteX(note, requestedPosition) : 0;
    }
    buildBoundingsLookup(beatBounds, cx, cy) {
        if (this.noteHeads) {
            this.noteHeads.buildBoundingsLookup(beatBounds, cx + this.x, cy + this.y);
        }
    }
    getNoteY(note, requestedPosition) {
        return this.noteHeads ? this.noteHeads.getNoteY(note, requestedPosition) : 0;
    }
    updateBeamingHelper() {
        if (this.noteHeads) {
            this.noteHeads.updateBeamingHelper(this.container.x + this.x);
        }
        else if (this.restGlyph) {
            this.restGlyph.updateBeamingHelper(this.container.x + this.x);
            if (this.renderer.bar.isMultiVoice && this._collisionOffset === -1000) {
                this._collisionOffset = this.renderer.helpers.collisionHelper.applyRestCollisionOffset(this.container.beat, this.restGlyph.y, this.renderer.getScoreHeight(1));
                this.y += this._collisionOffset;
                const existingRests = this.renderer.helpers.collisionHelper.restDurationsByDisplayTime;
                if (existingRests.has(this.container.beat.playbackStart) &&
                    existingRests.get(this.container.beat.playbackStart).has(this.container.beat.playbackDuration) &&
                    existingRests.get(this.container.beat.playbackStart).get(this.container.beat.playbackDuration) !== this.container.beat.id) {
                    this._skipPaint = true;
                }
            }
        }
    }
    paint(cx, cy, canvas) {
        if (!this._skipPaint) {
            super.paint(cx, cy, canvas);
        }
    }
    doLayout() {
        // create glyphs
        let sr = this.renderer;
        if (!this.container.beat.isEmpty) {
            if (!this.container.beat.isRest) {
                //
                // Note heads
                //
                const noteHeads = new ScoreNoteChordGlyph();
                this.noteHeads = noteHeads;
                noteHeads.beat = this.container.beat;
                noteHeads.beamingHelper = this.beamingHelper;
                let ghost = new GhostNoteContainerGlyph(false);
                ghost.renderer = this.renderer;
                for (let note of this.container.beat.notes) {
                    if (note.isVisible) {
                        this.createNoteGlyph(note);
                        ghost.addParenthesis(note);
                    }
                }
                this.addGlyph(noteHeads);
                if (!ghost.isEmpty) {
                    this.addGlyph(new SpacingGlyph(0, 0, 4 *
                        (this.container.beat.graceType !== GraceType.None ? NoteHeadGlyph.GraceScale : 1) *
                        this.scale));
                    this.addGlyph(ghost);
                }
                //
                // Whammy Bar
                if (this.container.beat.hasWhammyBar) {
                    let whammy = new ScoreWhammyBarGlyph(this.container.beat);
                    whammy.renderer = this.renderer;
                    whammy.doLayout();
                    this.container.ties.push(whammy);
                }
                //
                // Note dots
                //
                if (this.container.beat.dots > 0) {
                    this.addGlyph(new SpacingGlyph(0, 0, 5 * this.scale));
                    for (let i = 0; i < this.container.beat.dots; i++) {
                        let group = new GlyphGroup(0, 0);
                        group.renderer = this.renderer;
                        for (let note of this.container.beat.notes) {
                            this.createBeatDot(sr.getNoteLine(note), group);
                        }
                        this.addGlyph(group);
                    }
                }
            }
            else {
                let line = Math.ceil((this.renderer.bar.staff.standardNotationLineCount - 1) / 2) * 2;
                // this positioning is quite strange, for most staff line counts
                // the whole/rest are aligned as half below the whole rest. 
                // but for staff line count 1 and 3 they are aligned centered on the same line. 
                if (this.container.beat.duration === Duration.Whole &&
                    this.renderer.bar.staff.standardNotationLineCount !== 1 &&
                    this.renderer.bar.staff.standardNotationLineCount !== 3) {
                    line -= 2;
                }
                const restGlyph = new ScoreRestGlyph(0, sr.getScoreY(line), this.container.beat.duration);
                this.restGlyph = restGlyph;
                restGlyph.beat = this.container.beat;
                restGlyph.beamingHelper = this.beamingHelper;
                this.addGlyph(restGlyph);
                if (this.renderer.bar.isMultiVoice) {
                    if (this.container.beat.voice.index === 0) {
                        const restSizes = BeamingHelper.computeLineHeightsForRest(this.container.beat.duration);
                        let restTop = restGlyph.y - sr.getScoreHeight(restSizes[0]);
                        let restBottom = restGlyph.y + sr.getScoreHeight(restSizes[1]);
                        this.renderer.helpers.collisionHelper.reserveBeatSlot(this.container.beat, restTop, restBottom);
                    }
                    else {
                        this.renderer.helpers.collisionHelper.registerRest(this.container.beat);
                    }
                }
                if (this.beamingHelper) {
                    this.beamingHelper.applyRest(this.container.beat, line);
                }
                //
                // Note dots
                //
                if (this.container.beat.dots > 0) {
                    this.addGlyph(new SpacingGlyph(0, 0, 5 * this.scale));
                    for (let i = 0; i < this.container.beat.dots; i++) {
                        let group = new GlyphGroup(0, 0);
                        group.renderer = this.renderer;
                        this.createBeatDot(line, group);
                        this.addGlyph(group);
                    }
                }
            }
        }
        super.doLayout();
        if (this.container.beat.isEmpty) {
            this.centerX = this.width / 2;
        }
        else if (this.container.beat.isRest) {
            this.centerX = this.restGlyph.x + this.restGlyph.width / 2;
        }
        else {
            this.centerX = this.noteHeads.x + this.noteHeads.width / 2;
        }
    }
    createBeatDot(line, group) {
        let sr = this.renderer;
        group.addGlyph(new CircleGlyph(0, sr.getScoreY(line), 1.5 * this.scale));
    }
    createNoteHeadGlyph(n) {
        let isGrace = this.container.beat.graceType !== GraceType.None;
        if (n.beat.voice.bar.staff.isPercussion) {
            const articulation = PercussionMapper.getArticulation(n);
            if (articulation) {
                return new PercussionNoteHeadGlyph(0, 0, articulation, n.beat.duration, isGrace);
            }
            else {
                Logger.warning('Rendering', `No articulation found for percussion instrument ${n.percussionArticulation}`);
            }
        }
        if (n.isDead) {
            return new DeadNoteHeadGlyph(0, 0, isGrace);
        }
        if (n.beat.graceType === GraceType.BendGrace) {
            return new NoteHeadGlyph(0, 0, Duration.Quarter, true);
        }
        if (n.harmonicType === HarmonicType.Natural) {
            return new DiamondNoteHeadGlyph(0, 0, n.beat.duration, isGrace);
        }
        return new NoteHeadGlyph(0, 0, n.beat.duration, isGrace);
    }
    createNoteGlyph(n) {
        if (n.beat.graceType === GraceType.BendGrace && !n.hasBend) {
            return;
        }
        let sr = this.renderer;
        let noteHeadGlyph = this.createNoteHeadGlyph(n);
        // calculate y position
        let line = sr.getNoteLine(n);
        noteHeadGlyph.y = sr.getScoreY(line);
        this.noteHeads.addNoteGlyph(noteHeadGlyph, n, line);
        if (n.harmonicType !== HarmonicType.None && n.harmonicType !== HarmonicType.Natural) {
            // create harmonic note head.
            let harmonicFret = n.displayValue + n.harmonicPitch;
            noteHeadGlyph = new DiamondNoteHeadGlyph(0, 0, n.beat.duration, this.container.beat.graceType !== GraceType.None);
            line = sr.accidentalHelper.getNoteLineForValue(harmonicFret, false);
            noteHeadGlyph.y = sr.getScoreY(line);
            this.noteHeads.addNoteGlyph(noteHeadGlyph, n, line);
        }
        if (n.isStaccato && !this.noteHeads.aboveBeatEffects.has('Staccato')) {
            this.noteHeads.belowBeatEffects.set('Staccato', new ArticStaccatoAboveGlyph(0, 0));
        }
        if (n.accentuated === AccentuationType.Normal && !this.noteHeads.aboveBeatEffects.has('Accent')) {
            this.noteHeads.belowBeatEffects.set('Accent', new AccentuationGlyph(0, 0, AccentuationType.Normal));
        }
        if (n.accentuated === AccentuationType.Heavy && !this.noteHeads.aboveBeatEffects.has('HAccent')) {
            this.noteHeads.belowBeatEffects.set('HAccent', new AccentuationGlyph(0, 0, AccentuationType.Heavy));
        }
        if (n.isPercussion) {
            const articulation = PercussionMapper.getArticulation(n);
            if (articulation && articulation.techniqueSymbolPlacement !== TextBaseline.Middle) {
                const effectContainer = articulation.techniqueSymbolPlacement === TextBaseline.Top
                    ? this.noteHeads.aboveBeatEffects
                    : this.noteHeads.belowBeatEffects;
                switch (articulation.techniqueSymbol) {
                    case MusicFontSymbol.PictEdgeOfCymbal:
                        effectContainer.set('PictEdgeOfCymbal', new PictEdgeOfCymbalGlyph(0, 0));
                        break;
                    case MusicFontSymbol.ArticStaccatoAbove:
                        effectContainer.set('ArticStaccatoAbove', new ArticStaccatoAboveGlyph(0, 0));
                        break;
                    case MusicFontSymbol.StringsUpBow:
                        effectContainer.set('StringsUpBow', new PickStrokeGlyph(0, 0, PickStroke.Up));
                        break;
                    case MusicFontSymbol.StringsDownBow:
                        effectContainer.set('StringsDownBow', new PickStrokeGlyph(0, 0, PickStroke.Down));
                        break;
                    case MusicFontSymbol.GuitarGolpe:
                        effectContainer.set('GuitarGolpe', new GuitarGolpeGlyph(0, 0));
                        break;
                }
            }
        }
    }
}
//# sourceMappingURL=ScoreBeatGlyph.js.map
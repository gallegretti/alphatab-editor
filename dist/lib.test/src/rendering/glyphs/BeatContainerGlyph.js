import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { BeatBounds } from '../utils/BeatBounds';
import { Bounds } from '../utils/Bounds';
import { FlagGlyph } from './FlagGlyph';
import { NoteHeadGlyph } from './NoteHeadGlyph';
export class BeatContainerGlyph extends Glyph {
    constructor(beat, voiceContainer) {
        super(0, 0);
        this.ties = [];
        this.minWidth = 0;
        this.beat = beat;
        this.ties = [];
        this.voiceContainer = voiceContainer;
    }
    get onTimeX() {
        return this.onNotes.x + this.onNotes.centerX;
    }
    registerLayoutingInfo(layoutings) {
        let preBeatStretch = this.preNotes.computedWidth + this.onNotes.centerX;
        if (this.beat.graceGroup && !this.beat.graceGroup.isComplete) {
            preBeatStretch += BeatContainerGlyph.GraceBeatPadding * this.renderer.scale;
        }
        let postBeatStretch = this.onNotes.computedWidth - this.onNotes.centerX;
        // make space for flag
        const helper = this.renderer.helpers.getBeamingHelperForBeat(this.beat);
        if (helper && helper.hasFlag || this.beat.graceType !== GraceType.None) {
            postBeatStretch += (FlagGlyph.FlagWidth * this.scale * (this.beat.graceType !== GraceType.None ? NoteHeadGlyph.GraceScale : 1));
        }
        for (const tie of this.ties) {
            postBeatStretch += tie.width;
        }
        // Add some further spacing to grace notes
        if (this.beat.graceType !== GraceType.None) {
            postBeatStretch += BeatContainerGlyph.GraceBeatPadding * this.renderer.scale;
        }
        layoutings.addBeatSpring(this.beat, preBeatStretch, postBeatStretch);
        // store sizes for special renderers like the EffectBarRenderer
        layoutings.setPreBeatSize(this.beat, this.preNotes.computedWidth);
        layoutings.setOnBeatSize(this.beat, this.onNotes.computedWidth);
        layoutings.setBeatCenterX(this.beat, this.onNotes.centerX);
    }
    applyLayoutingInfo(info) {
        let offset = info.getBeatCenterX(this.beat) - this.onNotes.centerX;
        if (this.beat.graceGroup && !this.beat.graceGroup.isComplete) {
            offset += BeatContainerGlyph.GraceBeatPadding * this.renderer.scale;
        }
        this.preNotes.x = offset;
        this.preNotes.width = info.getPreBeatSize(this.beat);
        this.onNotes.width = info.getOnBeatSize(this.beat);
        this.onNotes.x = this.preNotes.x + this.preNotes.width;
        this.onNotes.updateBeamingHelper();
        this.updateWidth();
    }
    doLayout() {
        this.preNotes.x = 0;
        this.preNotes.renderer = this.renderer;
        this.preNotes.container = this;
        this.preNotes.doLayout();
        this.onNotes.x = this.preNotes.x + this.preNotes.width;
        this.onNotes.renderer = this.renderer;
        this.onNotes.container = this;
        this.onNotes.doLayout();
        let i = this.beat.notes.length - 1;
        while (i >= 0) {
            this.createTies(this.beat.notes[i--]);
        }
        this.updateWidth();
    }
    updateWidth() {
        this.minWidth = this.preNotes.width + this.onNotes.width;
        if (!this.beat.isRest) {
            if (this.onNotes.beamingHelper.beats.length === 1) {
                // make space for flag
                if (this.beat.duration >= Duration.Eighth) {
                    this.minWidth += 20 * this.scale;
                }
            }
            else {
                // ensure some space for small notes
                switch (this.beat.duration) {
                    case Duration.OneHundredTwentyEighth:
                    case Duration.TwoHundredFiftySixth:
                        this.minWidth += 10 * this.scale;
                        break;
                }
            }
        }
        let tieWidth = 0;
        for (let tie of this.ties) {
            if (tie.width > tieWidth) {
                tieWidth = tie.width;
            }
        }
        this.minWidth += tieWidth;
        this.width = this.minWidth;
    }
    scaleToWidth(beatWidth) {
        for (let tie of this.ties) {
            tie.doLayout();
        }
        this.onNotes.updateBeamingHelper();
        this.width = beatWidth;
    }
    createTies(n) {
        // no default ties
    }
    static getGroupId(beat) {
        return 'b' + beat.id;
    }
    paint(cx, cy, canvas) {
        if (this.beat.voice.isEmpty) {
            return;
        }
        let isEmptyGlyph = this.preNotes.isEmpty && this.onNotes.isEmpty && this.ties.length === 0;
        if (isEmptyGlyph) {
            return;
        }
        canvas.beginGroup(BeatContainerGlyph.getGroupId(this.beat));
        // var c = canvas.color;
        // var ta = canvas.textAlign;
        // canvas.color = new Color(255, 0, 0);
        // canvas.textAlign = TextAlign.Left;
        // canvas.fillText(this.beat.playbackStart.toString(), cx + this.x, cy + this.y - 10);
        // canvas.color = c;
        // canvas.textAlign = ta;
        // canvas.color = Color.random();
        // canvas.fillRect(cx + this.x, cy + this.y, this.width, this.renderer.height);
        // var oldColor = canvas.color;
        // canvas.color = Color.random(100);
        // canvas.fillRect(cx + this.x, cy + this.y, this.width, this.renderer.height);
        // canvas.color = oldColor;
        // canvas.color = new Color(200, 0, 0, 100);
        // canvas.strokeRect(cx + this.x, cy + this.y + 15 * this.beat.voice.index, this.width, 10);
        // canvas.font = new Font("Arial", 10);
        // canvas.color = new Color(0, 0, 0);
        // canvas.fillText(this.beat.voice.index + ":" + this.beat.index, cx + this.x, cy + this.y + 15 * this.beat.voice.index);
        // if (this.beat.voice.index === 0) {
        //     canvas.color = new Color(200, 0, 0, 100);
        //     canvas.strokeRect(cx + this.x, cy + this.y + this.preNotes.y + 30, this.width, 10);
        // }
        this.preNotes.paint(cx + this.x, cy + this.y, canvas);
        // if (this.beat.voice.index === 0) {
        //     canvas.color = new Color(200, 0, 0, 100);
        //     canvas.strokeRect(cx + this.x + this.preNotes.x, cy + this.y + this.preNotes.y, this.preNotes.width, 10);
        // }
        this.onNotes.paint(cx + this.x, cy + this.y, canvas);
        // if (this.beat.voice.index === 0) {
        //     canvas.color = new Color(0, 200, 0, 100);
        //     canvas.strokeRect(cx + this.x + this.onNotes.x, cy + this.y + this.onNotes.y - 10, this.onNotes.width, 10);
        // }
        // paint the ties relative to the whole staff,
        // reason: we have possibly multiple staves involved and need to calculate the correct positions.
        let staffX = cx - this.voiceContainer.x - this.renderer.x;
        let staffY = cy - this.voiceContainer.y - this.renderer.y;
        for (let i = 0, j = this.ties.length; i < j; i++) {
            let t = this.ties[i];
            t.renderer = this.renderer;
            t.paint(staffX, staffY, canvas);
        }
        canvas.endGroup();
    }
    buildBoundingsLookup(barBounds, cx, cy, isEmptyBar) {
        let beatBoundings = new BeatBounds();
        beatBoundings.beat = this.beat;
        beatBoundings.visualBounds = new Bounds();
        beatBoundings.visualBounds.x = cx + this.x + this.onNotes.x;
        beatBoundings.visualBounds.y = barBounds.visualBounds.y;
        beatBoundings.visualBounds.w = this.onNotes.width;
        beatBoundings.visualBounds.h = barBounds.visualBounds.h;
        beatBoundings.realBounds = new Bounds();
        beatBoundings.realBounds.x = cx + this.x;
        beatBoundings.realBounds.y = barBounds.realBounds.y;
        beatBoundings.realBounds.w = this.width;
        beatBoundings.realBounds.h = barBounds.realBounds.h;
        if (isEmptyBar) {
            beatBoundings.visualBounds.x = cx + this.x;
            beatBoundings.realBounds.x = beatBoundings.visualBounds.x;
        }
        barBounds.addBeat(beatBoundings);
        if (this.renderer.settings.core.includeNoteBounds) {
            this.onNotes.buildBoundingsLookup(beatBoundings, cx + this.x, cy + this.y);
        }
    }
}
BeatContainerGlyph.GraceBeatPadding = 3;
//# sourceMappingURL=BeatContainerGlyph.js.map
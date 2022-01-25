import { Duration } from '@src/model/Duration';
import { GraceType } from '@src/model/GraceType';
import { TabRhythmMode } from '@src/NotationSettings';
import { TextAlign, TextBaseline } from '@src/platform/ICanvas';
import { BarRendererBase, NoteYPosition } from '@src/rendering/BarRendererBase';
import { BarNumberGlyph } from '@src/rendering/glyphs/BarNumberGlyph';
import { BarSeperatorGlyph } from '@src/rendering/glyphs/BarSeperatorGlyph';
import { FlagGlyph } from '@src/rendering/glyphs/FlagGlyph';
import { RepeatCloseGlyph } from '@src/rendering/glyphs/RepeatCloseGlyph';
import { RepeatCountGlyph } from '@src/rendering/glyphs/RepeatCountGlyph';
import { RepeatOpenGlyph } from '@src/rendering/glyphs/RepeatOpenGlyph';
import { SpacingGlyph } from '@src/rendering/glyphs/SpacingGlyph';
import { TabBeatContainerGlyph } from '@src/rendering/glyphs/TabBeatContainerGlyph';
import { TabBeatGlyph } from '@src/rendering/glyphs/TabBeatGlyph';
import { TabBeatPreNotesGlyph } from '@src/rendering/glyphs/TabBeatPreNotesGlyph';
import { TabClefGlyph } from '@src/rendering/glyphs/TabClefGlyph';
import { TabTimeSignatureGlyph } from '@src/rendering/glyphs/TabTimeSignatureGlyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { ModelUtils } from '@src/model/ModelUtils';
/**
 * This BarRenderer renders a bar using guitar tablature notation
 */
export class TabBarRenderer extends BarRendererBase {
    constructor(renderer, bar) {
        super(renderer, bar);
        this._firstLineY = 0;
        this._tupletSize = 0;
        this.showTimeSignature = false;
        this.showRests = false;
        this.showTiedNotes = false;
        this._startSpacing = false;
    }
    get lineOffset() {
        return (TabBarRenderer.TabLineSpacing + 1) * this.scale;
    }
    updateSizes() {
        let res = this.resources;
        let numberOverflow = (res.tablatureFont.size / 2 + res.tablatureFont.size * 0.2) * this.scale;
        this.topPadding = numberOverflow;
        this.bottomPadding = numberOverflow;
        this.height = this.lineOffset * (this.bar.staff.tuning.length - 1) + numberOverflow * 2;
        if (this.settings.notation.rhythmMode !== TabRhythmMode.Hidden) {
            this.height += this.settings.notation.rhythmHeight * this.settings.display.scale;
            this.bottomPadding += this.settings.notation.rhythmHeight * this.settings.display.scale;
        }
        this.updateFirstLineY();
        super.updateSizes();
    }
    updateFirstLineY() {
        let res = this.resources;
        this._firstLineY = (res.tablatureFont.size / 2 + res.tablatureFont.size * 0.2) * this.scale;
    }
    doLayout() {
        this.updateFirstLineY();
        super.doLayout();
        if (this.settings.notation.rhythmMode !== TabRhythmMode.Hidden) {
            let hasTuplets = false;
            for (let voice of this.bar.voices) {
                if (this.hasVoiceContainer(voice)) {
                    let c = this.getVoiceContainer(voice);
                    if (c.tupletGroups.length > 0) {
                        hasTuplets = true;
                        break;
                    }
                }
            }
            if (hasTuplets) {
                this._tupletSize = this.resources.effectFont.size * 0.8;
                this.registerOverflowBottom(this._tupletSize);
            }
        }
    }
    createPreBeatGlyphs() {
        super.createPreBeatGlyphs();
        if (this.bar.masterBar.isRepeatStart) {
            this.addPreBeatGlyph(new RepeatOpenGlyph(0, 0, 1.5, 3));
        }
        // Clef
        if (this.isFirstOfLine) {
            let center = (this.bar.staff.tuning.length - 1) / 2;
            this.addPreBeatGlyph(new TabClefGlyph(5 * this.scale, this.getTabY(center)));
        }
        // Time Signature
        if (this.showTimeSignature &&
            (!this.bar.previousBar ||
                (this.bar.previousBar &&
                    this.bar.masterBar.timeSignatureNumerator !==
                        this.bar.previousBar.masterBar.timeSignatureNumerator) ||
                (this.bar.previousBar &&
                    this.bar.masterBar.timeSignatureDenominator !==
                        this.bar.previousBar.masterBar.timeSignatureDenominator))) {
            this.createStartSpacing();
            this.createTimeSignatureGlyphs();
        }
        this.addPreBeatGlyph(new BarNumberGlyph(0, this.getTabHeight(-0.5), this.bar.index + 1));
    }
    createStartSpacing() {
        if (this._startSpacing) {
            return;
        }
        this.addPreBeatGlyph(new SpacingGlyph(0, 0, 2 * this.scale));
        this._startSpacing = true;
    }
    createTimeSignatureGlyphs() {
        this.addPreBeatGlyph(new SpacingGlyph(0, 0, 5 * this.scale));
        const lines = ((this.bar.staff.tuning.length + 1) / 2) - 1;
        this.addPreBeatGlyph(new TabTimeSignatureGlyph(0, this.getTabY(lines), this.bar.masterBar.timeSignatureNumerator, this.bar.masterBar.timeSignatureDenominator, this.bar.masterBar.timeSignatureCommon));
    }
    createVoiceGlyphs(v) {
        for (let i = 0, j = v.beats.length; i < j; i++) {
            let b = v.beats[i];
            let container = new TabBeatContainerGlyph(b, this.getVoiceContainer(v));
            container.preNotes = new TabBeatPreNotesGlyph();
            container.onNotes = new TabBeatGlyph();
            this.addBeatGlyph(container);
        }
    }
    createPostBeatGlyphs() {
        super.createPostBeatGlyphs();
        if (this.bar.masterBar.isRepeatEnd) {
            this.addPostBeatGlyph(new RepeatCloseGlyph(this.x, 0));
            if (this.bar.masterBar.repeatCount > 2) {
                this.addPostBeatGlyph(new RepeatCountGlyph(0, this.getTabY(-1), this.bar.masterBar.repeatCount));
            }
        }
        else {
            this.addPostBeatGlyph(new BarSeperatorGlyph(0, 0));
        }
    }
    /**
     * Gets the relative y position of the given steps relative to first line.
     * @param line the line of the particular string where 0 is the most top line
     * @param correction
     * @returns
     */
    getTabY(line) {
        return this._firstLineY + this.getTabHeight(line);
    }
    getTabHeight(line) {
        return this.lineOffset * line;
    }
    get middleYPosition() {
        return this.getTabY(this.bar.staff.tuning.length - 1);
    }
    paintBackground(cx, cy, canvas) {
        super.paintBackground(cx, cy, canvas);
        let res = this.resources;
        //
        // draw string lines
        //
        canvas.color = res.staffLineColor;
        let padding = this.scale;
        // collect tab note position for spaces
        let tabNotes = [];
        for (let i = 0, j = this.bar.staff.tuning.length; i < j; i++) {
            tabNotes.push([]);
        }
        for (let voice of this.bar.voices) {
            if (this.hasVoiceContainer(voice)) {
                let vc = this.getVoiceContainer(voice);
                for (let bg of vc.beatGlyphs) {
                    let notes = bg.onNotes;
                    let noteNumbers = notes.noteNumbers;
                    if (noteNumbers) {
                        for (const [str, noteNumber] of noteNumbers.notesPerString) {
                            if (!noteNumber.isEmpty) {
                                tabNotes[this.bar.staff.tuning.length - str].push(new Float32Array([
                                    vc.x + bg.x + notes.x + noteNumbers.x,
                                    noteNumbers.width + padding
                                ]));
                            }
                        }
                    }
                }
            }
        }
        // if we have multiple voices we need to sort by X-position, otherwise have a wild mix in the list
        // but painting relies on ascending X-position
        for (let line of tabNotes) {
            line.sort((a, b) => {
                return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
            });
        }
        for (let i = 0, j = this.bar.staff.tuning.length; i < j; i++) {
            const lineY = this.getTabY(i);
            let lineX = 0;
            for (let line of tabNotes[i]) {
                canvas.fillRect(cx + this.x + lineX, cy + this.y + lineY | 0, line[0] - lineX, this.scale * BarRendererBase.StaffLineThickness);
                lineX = line[0] + line[1];
            }
            canvas.fillRect(cx + this.x + lineX, cy + this.y + lineY | 0, this.width - lineX, this.scale * BarRendererBase.StaffLineThickness);
        }
        canvas.color = res.mainGlyphColor;
        this.paintSimileMark(cx, cy, canvas);
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy, canvas);
        if (this.settings.notation.rhythmMode !== TabRhythmMode.Hidden) {
            this.paintBeams(cx, cy, canvas);
            this.paintTuplets(cx, cy, canvas);
        }
    }
    paintBeams(cx, cy, canvas) {
        for (let i = 0, j = this.helpers.beamHelpers.length; i < j; i++) {
            let v = this.helpers.beamHelpers[i];
            for (let k = 0, l = v.length; k < l; k++) {
                let h = v[k];
                this.paintBeamHelper(cx + this.beatGlyphsStart, cy, canvas, h);
            }
        }
    }
    paintTuplets(cx, cy, canvas) {
        for (let voice of this.bar.voices) {
            if (this.hasVoiceContainer(voice)) {
                let container = this.getVoiceContainer(voice);
                for (let tupletGroup of container.tupletGroups) {
                    this.paintTupletHelper(cx + this.beatGlyphsStart, cy, canvas, tupletGroup);
                }
            }
        }
    }
    paintBeamHelper(cx, cy, canvas, h) {
        canvas.color = h.voice.index === 0 ? this.resources.mainGlyphColor : this.resources.secondaryGlyphColor;
        // check if we need to paint simple footer
        if (!h.isRestBeamHelper) {
            if (h.beats.length === 1 || this.settings.notation.rhythmMode === TabRhythmMode.ShowWithBeams) {
                this.paintFooter(cx, cy, canvas, h);
            }
            else {
                this.paintBar(cx, cy, canvas, h);
            }
        }
    }
    paintBar(cx, cy, canvas, h) {
        for (let i = 0, j = h.beats.length; i < j; i++) {
            let beat = h.beats[i];
            if (h.hasBeatLineX(beat)) {
                //
                // draw line
                //
                let beatLineX = h.getBeatLineX(beat);
                let y1 = cy + this.y;
                let y2 = cy + this.y + this.height - this._tupletSize;
                let startGlyph = this.getOnNotesGlyphForBeat(beat);
                if (!startGlyph.noteNumbers || beat.duration === Duration.Half) {
                    y1 += this.height -
                        this.settings.notation.rhythmHeight * this.settings.display.scale -
                        this._tupletSize;
                }
                else {
                    y1 +=
                        startGlyph.noteNumbers.getNoteY(startGlyph.noteNumbers.minStringNote, NoteYPosition.Bottom) +
                            this.lineOffset / 2;
                }
                this.paintBeamingStem(beat, cy + this.y, cx + this.x + beatLineX, y1, y2, canvas);
                let brokenBarOffset = 6 * this.scale;
                let barSpacing = -6 * this.scale;
                let barSize = 3 * this.scale;
                let barCount = ModelUtils.getIndex(beat.duration) - 2;
                let barStart = y2;
                for (let barIndex = 0; barIndex < barCount; barIndex++) {
                    let barStartX = 0;
                    let barEndX = 0;
                    let barStartY = 0;
                    let barEndY = 0;
                    let barY = barStart + barIndex * barSpacing;
                    //
                    // Broken Bar to Next
                    //
                    if (h.beats.length === 1) {
                        barStartX = beatLineX;
                        barEndX = beatLineX + brokenBarOffset;
                        barStartY = barY;
                        barEndY = barY;
                        TabBarRenderer.paintSingleBar(canvas, cx + this.x + barStartX, barStartY, cx + this.x + barEndX, barEndY, barSize);
                    }
                    else if (i < h.beats.length - 1) {
                        // full bar?
                        if (BeamingHelper.isFullBarJoin(beat, h.beats[i + 1], barIndex)) {
                            barStartX = beatLineX;
                            barEndX = h.getBeatLineX(h.beats[i + 1]);
                        }
                        else if (i === 0 || !BeamingHelper.isFullBarJoin(h.beats[i - 1], beat, barIndex)) {
                            barStartX = beatLineX;
                            barEndX = barStartX + brokenBarOffset;
                        }
                        else {
                            continue;
                        }
                        barStartY = barY;
                        barEndY = barY;
                        TabBarRenderer.paintSingleBar(canvas, cx + this.x + barStartX, barStartY, cx + this.x + barEndX, barEndY, barSize);
                    }
                    else if (i > 0 && !BeamingHelper.isFullBarJoin(beat, h.beats[i - 1], barIndex)) {
                        barStartX = beatLineX - brokenBarOffset;
                        barEndX = beatLineX;
                        barStartY = barY;
                        barEndY = barY;
                        TabBarRenderer.paintSingleBar(canvas, cx + this.x + barStartX, barStartY, cx + this.x + barEndX, barEndY, barSize);
                    }
                }
            }
        }
    }
    paintTupletHelper(cx, cy, canvas, h) {
        let res = this.resources;
        let oldAlign = canvas.textAlign;
        let oldBaseLine = canvas.textBaseline;
        canvas.color = h.voice.index === 0 ? this.resources.mainGlyphColor : this.resources.secondaryGlyphColor;
        canvas.textAlign = TextAlign.Center;
        canvas.textBaseline = TextBaseline.Middle;
        let s;
        let num = h.beats[0].tupletNumerator;
        let den = h.beats[0].tupletDenominator;
        // list as in Guitar Pro 7. for certain tuplets only the numerator is shown
        if (num === 2 && den === 3) {
            s = '2';
        }
        else if (num === 3 && den === 2) {
            s = '3';
        }
        else if (num === 4 && den === 6) {
            s = '4';
        }
        else if (num === 5 && den === 4) {
            s = '5';
        }
        else if (num === 6 && den === 4) {
            s = '6';
        }
        else if (num === 7 && den === 4) {
            s = '7';
        }
        else if (num === 9 && den === 8) {
            s = '9';
        }
        else if (num === 10 && den === 8) {
            s = '10';
        }
        else if (num === 11 && den === 8) {
            s = '11';
        }
        else if (num === 12 && den === 8) {
            s = '12';
        }
        else if (num === 13 && den === 8) {
            s = '13';
        }
        else {
            s = num + ':' + den;
        }
        // check if we need to paint simple footer
        if (h.beats.length === 1 || !h.isFull) {
            for (let i = 0, j = h.beats.length; i < j; i++) {
                let beat = h.beats[i];
                let beamingHelper = this.helpers.beamHelperLookup[h.voice.index].get(beat.index);
                if (!beamingHelper) {
                    continue;
                }
                let tupletX = beamingHelper.getBeatLineX(beat);
                let tupletY = cy + this.y + this.height - this._tupletSize + res.effectFont.size * 0.5;
                canvas.font = res.effectFont;
                canvas.fillText(s, cx + this.x + tupletX, tupletY);
            }
        }
        else {
            let firstBeat = h.beats[0];
            let lastBeat = h.beats[h.beats.length - 1];
            let firstBeamingHelper = this.helpers.beamHelperLookup[h.voice.index].get(firstBeat.index);
            let lastBeamingHelper = this.helpers.beamHelperLookup[h.voice.index].get(lastBeat.index);
            if (firstBeamingHelper && lastBeamingHelper) {
                //
                // Calculate the overall area of the tuplet bracket
                let startX = firstBeamingHelper.getBeatLineX(firstBeat);
                let endX = lastBeamingHelper.getBeatLineX(lastBeat);
                //
                // Calculate how many space the text will need
                canvas.font = res.effectFont;
                let sw = canvas.measureText(s);
                let sp = 3 * this.scale;
                //
                // Calculate the offsets where to break the bracket
                let middleX = (startX + endX) / 2;
                let offset1X = middleX - sw / 2 - sp;
                let offset2X = middleX + sw / 2 + sp;
                //
                // calculate the y positions for our bracket
                let startY = cy + this.y + this.height - this._tupletSize + res.effectFont.size * 0.5;
                let offset = -res.effectFont.size * 0.25;
                let size = -5 * this.scale;
                //
                // draw the bracket
                canvas.beginPath();
                canvas.moveTo(cx + this.x + startX, (startY - offset) | 0);
                canvas.lineTo(cx + this.x + startX, (startY - offset - size) | 0);
                canvas.lineTo(cx + this.x + offset1X, (startY - offset - size) | 0);
                canvas.stroke();
                canvas.beginPath();
                canvas.moveTo(cx + this.x + offset2X, (startY - offset - size) | 0);
                canvas.lineTo(cx + this.x + endX, (startY - offset - size) | 0);
                canvas.lineTo(cx + this.x + endX, (startY - offset) | 0);
                canvas.stroke();
                //
                // Draw the string
                canvas.fillText(s, cx + this.x + middleX, startY - offset - size);
            }
        }
        canvas.textAlign = oldAlign;
        canvas.textBaseline = oldBaseLine;
    }
    static paintSingleBar(canvas, x1, y1, x2, y2, size) {
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.lineTo(x2, y2);
        canvas.lineTo(x2, y2 - size);
        canvas.lineTo(x1, y1 - size);
        canvas.closePath();
        canvas.fill();
    }
    paintBeamingStem(beat, cy, x, topY, bottomY, canvas) {
        canvas.beginPath();
        let holes = [];
        if (this.helpers.collisionHelper.reservedLayoutAreasByDisplayTime.has(beat.displayStart)) {
            holes = this.helpers.collisionHelper.reservedLayoutAreasByDisplayTime.get(beat.displayStart).slots.slice();
            holes.sort((a, b) => a.topY - b.topY);
        }
        let y = bottomY;
        while (y > topY) {
            canvas.moveTo(x, y);
            let lineY = topY;
            // draw until next hole (if hole reaches into line)
            if (holes.length > 0 && holes[holes.length - 1].bottomY > lineY) {
                const bottomHole = holes.pop();
                lineY = cy + bottomHole.bottomY;
                canvas.lineTo(x, lineY);
                y = cy + bottomHole.topY;
            }
            else {
                canvas.lineTo(x, lineY);
                break;
            }
        }
        canvas.stroke();
    }
    paintFooter(cx, cy, canvas, h) {
        for (let beat of h.beats) {
            if (beat.graceType !== GraceType.None ||
                beat.duration === Duration.Whole ||
                beat.duration === Duration.DoubleWhole ||
                beat.duration === Duration.QuadrupleWhole) {
                return;
            }
            //
            // draw line
            //
            let beatLineX = h.getBeatLineX(beat);
            let y1 = cy + this.y;
            let y2 = cy + this.y + this.height - this._tupletSize;
            let startGlyph = this.getOnNotesGlyphForBeat(beat);
            if (!startGlyph.noteNumbers || beat.duration === Duration.Half) {
                y1 +=
                    this.height - this.settings.notation.rhythmHeight * this.settings.display.scale - this._tupletSize;
            }
            else {
                y1 +=
                    startGlyph.noteNumbers.getNoteY(startGlyph.noteNumbers.minStringNote, NoteYPosition.Bottom);
            }
            this.paintBeamingStem(beat, cy + this.y, cx + this.x + beatLineX, y1, y2, canvas);
            //
            // Draw Flag
            //
            if (beat.duration > Duration.Quarter) {
                let glyph = new FlagGlyph(0, 0, beat.duration, BeamDirection.Down, false);
                glyph.renderer = this;
                glyph.doLayout();
                glyph.paint(cx + this.x + beatLineX, y2, canvas);
            }
        }
    }
}
TabBarRenderer.StaffId = 'tab';
TabBarRenderer.TabLineSpacing = 10;
//# sourceMappingURL=TabBarRenderer.js.map
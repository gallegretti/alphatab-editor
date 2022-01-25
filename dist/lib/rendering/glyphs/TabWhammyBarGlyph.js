import { BendPoint } from '@src/model/BendPoint';
import { BendStyle } from '@src/model/BendStyle';
import { WhammyType } from '@src/model/WhammyType';
import { NotationMode, NotationElement } from '@src/NotationSettings';
import { TextAlign } from '@src/platform/ICanvas';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { TabBendGlyph } from '@src/rendering/glyphs/TabBendGlyph';
export class TabWhammyBarGlyph extends Glyph {
    constructor(beat) {
        super(0, 0);
        this._isSimpleDip = false;
        this._beat = beat;
        this._renderPoints = this.createRenderingPoints(beat);
    }
    createRenderingPoints(beat) {
        // advanced rendering
        if (beat.whammyBarType === WhammyType.Custom) {
            return beat.whammyBarPoints;
        }
        let renderingPoints = [];
        // Guitar Pro Rendering Note:
        // Last point of bend is always at end of the beat even
        // though it might not be 100% correct from timing perspective.
        switch (beat.whammyBarType) {
            case WhammyType.Dive:
            case WhammyType.Hold:
            case WhammyType.PrediveDive:
            case WhammyType.Predive:
                renderingPoints.push(new BendPoint(0, beat.whammyBarPoints[0].value));
                renderingPoints.push(new BendPoint(BendPoint.MaxPosition, beat.whammyBarPoints[1].value));
                break;
            case WhammyType.Dip:
                renderingPoints.push(new BendPoint(0, beat.whammyBarPoints[0].value));
                renderingPoints.push(new BendPoint((BendPoint.MaxPosition / 2) | 0, beat.whammyBarPoints[1].value));
                renderingPoints.push(new BendPoint(BendPoint.MaxPosition, beat.whammyBarPoints[beat.whammyBarPoints.length - 1].value));
                break;
        }
        return renderingPoints;
    }
    doLayout() {
        super.doLayout();
        this._isSimpleDip =
            this.renderer.settings.notation.notationMode === NotationMode.SongBook &&
                this._beat.whammyBarType === WhammyType.Dip;
        //
        // Get the min and max values for all combined whammys
        let minValue = null;
        let maxValue = null;
        let beat = this._beat;
        while (beat && beat.hasWhammyBar) {
            if (!minValue || minValue.value > beat.minWhammyPoint.value) {
                minValue = beat.minWhammyPoint;
            }
            if (!maxValue || maxValue.value < beat.maxWhammyPoint.value) {
                maxValue = beat.maxWhammyPoint;
            }
            beat = beat.nextBeat;
        }
        let topOffset = maxValue.value > 0 ? Math.abs(this.getOffset(maxValue.value)) : 0;
        if (topOffset > 0 ||
            this._beat.whammyBarPoints[0].value !== 0 ||
            this.renderer.settings.notation.isNotationElementVisible(NotationElement.ZerosOnDiveWhammys)) {
            topOffset += this.renderer.resources.tablatureFont.size * 2;
        }
        let bottomOffset = minValue.value < 0 ? Math.abs(this.getOffset(minValue.value)) : 0;
        this.renderer.registerOverflowTop(topOffset + bottomOffset);
        let currentOffset = this.renderer.staff.getSharedLayoutData(TabWhammyBarGlyph.TopOffsetSharedDataKey, -1);
        if (topOffset > currentOffset) {
            this.renderer.staff.setSharedLayoutData(TabWhammyBarGlyph.TopOffsetSharedDataKey, topOffset);
        }
    }
    getOffset(value) {
        if (value === 0) {
            return 0;
        }
        let offset = TabWhammyBarGlyph.PerHalfSize * this.scale +
            Math.log2(Math.abs(value) / 2) * TabWhammyBarGlyph.PerHalfSize * this.scale;
        if (value < 0) {
            offset = -offset;
        }
        return offset;
    }
    paint(cx, cy, canvas) {
        let startNoteRenderer = this.renderer;
        let endBeat = this._beat.nextBeat;
        let endNoteRenderer = null;
        let endXPositionType = BeatXPosition.PreNotes;
        if (endBeat) {
            endNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, endBeat.voice.bar);
            if (!endNoteRenderer || endNoteRenderer.staff !== startNoteRenderer.staff) {
                endBeat = null;
                endNoteRenderer = null;
            }
            else if (endNoteRenderer !== startNoteRenderer && !endBeat.hasWhammyBar) {
                endBeat = null;
                endNoteRenderer = null;
            }
            else {
                endXPositionType =
                    endBeat.hasWhammyBar &&
                        (startNoteRenderer.settings.notation.notationMode !== NotationMode.SongBook ||
                            endBeat.whammyBarType !== WhammyType.Dip)
                        ? BeatXPosition.MiddleNotes
                        : BeatXPosition.PreNotes;
            }
        }
        let startX = 0;
        let endX = 0;
        if (this._isSimpleDip) {
            startX =
                cx +
                    startNoteRenderer.x +
                    startNoteRenderer.getBeatX(this._beat, BeatXPosition.OnNotes) -
                    2 * this.scale;
            endX =
                cx +
                    startNoteRenderer.x +
                    startNoteRenderer.getBeatX(this._beat, BeatXPosition.PostNotes) +
                    2 * this.scale;
        }
        else {
            startX = cx + startNoteRenderer.x + startNoteRenderer.getBeatX(this._beat, BeatXPosition.MiddleNotes);
            endX = !endNoteRenderer
                ? cx + startNoteRenderer.x + startNoteRenderer.width - 2 * this.scale
                : cx + endNoteRenderer.x + endNoteRenderer.getBeatX(endBeat, endXPositionType);
        }
        let old = canvas.textAlign;
        canvas.textAlign = TextAlign.Center;
        if (this._renderPoints.length >= 2) {
            let dx = (endX - startX) / BendPoint.MaxPosition;
            canvas.beginPath();
            let zeroY = cy + this.renderer.staff.getSharedLayoutData(TabWhammyBarGlyph.TopOffsetSharedDataKey, 0);
            let slurText = this._beat.whammyStyle === BendStyle.Gradual ? 'grad.' : '';
            for (let i = 0, j = this._renderPoints.length - 1; i < j; i++) {
                let firstPt = this._renderPoints[i];
                let secondPt = this._renderPoints[i + 1];
                let nextPt = i < j - 2 ? this._renderPoints[i + 2] : null;
                let isFirst = i === 0;
                // draw pre-bend if previous
                if (i === 0 && firstPt.value !== 0 && !this._beat.isContinuedWhammy) {
                    this.paintWhammy(false, new BendPoint(0, 0), firstPt, secondPt, startX, zeroY, dx, canvas);
                    isFirst = false;
                }
                this.paintWhammy(isFirst, firstPt, secondPt, nextPt, startX, zeroY, dx, canvas, slurText);
                slurText = '';
            }
            canvas.stroke();
        }
        canvas.textAlign = old;
    }
    paintWhammy(isFirst, firstPt, secondPt, nextPt, cx, cy, dx, canvas, slurText) {
        let x1 = cx + dx * firstPt.offset;
        let x2 = cx + dx * secondPt.offset;
        let y1 = cy - this.getOffset(firstPt.value);
        let y2 = cy - this.getOffset(secondPt.value);
        if (firstPt.offset === secondPt.offset) {
            let dashSize = TabWhammyBarGlyph.DashSize * this.scale;
            let dashes = Math.abs(y2 - y1) / (dashSize * 2);
            if (dashes < 1) {
                canvas.moveTo(x1, y1);
                canvas.lineTo(x2, y2);
            }
            else {
                let dashEndY = Math.max(y1, y2);
                let dashStartY = Math.min(y1, y2);
                while (dashEndY > dashStartY) {
                    canvas.moveTo(x1, dashStartY);
                    canvas.lineTo(x1, dashStartY + dashSize);
                    dashStartY += dashSize * 2;
                }
            }
            canvas.stroke();
        }
        else if (firstPt.value === secondPt.value) {
            let dashSize = TabWhammyBarGlyph.DashSize * this.scale;
            let dashes = Math.abs(x2 - x1) / (dashSize * 2);
            if (dashes < 1) {
                canvas.moveTo(x1, y1);
                canvas.lineTo(x2, y2);
            }
            else {
                let dashEndX = Math.max(x1, x2);
                let dashStartX = Math.min(x1, x2);
                while (dashEndX > dashStartX) {
                    canvas.moveTo(dashEndX, y1);
                    canvas.lineTo(dashEndX - dashSize, y1);
                    dashEndX -= dashSize * 2;
                }
            }
            canvas.stroke();
        }
        else {
            canvas.moveTo(x1, y1);
            canvas.lineTo(x2, y2);
        }
        let res = this.renderer.resources;
        if (isFirst && !this._beat.isContinuedWhammy && !this._isSimpleDip) {
            let y = y1;
            y -= res.tablatureFont.size + 2 * this.scale;
            if (this.renderer.settings.notation.isNotationElementVisible(NotationElement.ZerosOnDiveWhammys)) {
                canvas.fillText('0', x1, y);
            }
            if (slurText) {
                y -= res.tablatureFont.size + 2 * this.scale;
                canvas.fillText(slurText, x1, y);
            }
        }
        let dV = Math.abs(secondPt.value);
        if ((dV !== 0 || (this.renderer.settings.notation.isNotationElementVisible(NotationElement.ZerosOnDiveWhammys) && !this._isSimpleDip)) &&
            firstPt.value !== secondPt.value) {
            let s = '';
            if (secondPt.value < 0) {
                s += '-';
            }
            if (dV >= 4) {
                let steps = (dV / 4) | 0;
                s += steps;
                // Quaters
                dV -= steps * 4;
            }
            else if (dV === 0) {
                s += '0';
            }
            if (dV > 0) {
                s += TabBendGlyph.getFractionSign(dV);
            }
            let y = 0;
            if (this._isSimpleDip) {
                y = Math.min(y1, y2) - res.tablatureFont.size - 2 * this.scale;
            }
            else {
                y = firstPt.offset === secondPt.offset ? Math.min(y1, y2) : y2;
                y -= res.tablatureFont.size + 2 * this.scale;
                if (nextPt && nextPt.value > secondPt.value) {
                    y -= 2 * this.scale;
                }
            }
            let x = x2;
            canvas.fillText(s, x, y);
        }
    }
}
TabWhammyBarGlyph.TopOffsetSharedDataKey = 'tab.whammy.topoffset';
TabWhammyBarGlyph.PerHalfSize = 6;
TabWhammyBarGlyph.DashSize = 3;
//# sourceMappingURL=TabWhammyBarGlyph.js.map
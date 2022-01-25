import { Glyph } from '@src/rendering/glyphs/Glyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
export class TieGlyph extends Glyph {
    constructor(startBeat, endBeat, forEnd) {
        super(0, 0);
        this.yOffset = 0;
        this.startNoteRenderer = null;
        this.endNoteRenderer = null;
        this.tieDirection = BeamDirection.Up;
        this.startBeat = startBeat;
        this.endBeat = endBeat;
        this.forEnd = forEnd;
    }
    doLayout() {
        this.width = 0;
    }
    paint(cx, cy, canvas) {
        if (!this.endBeat) {
            return;
        }
        // TODO fix nullability of start/end beat,
        let startNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, this.startBeat.voice.bar);
        this.startNoteRenderer = startNoteRenderer;
        let endNoteRenderer = this.renderer.scoreRenderer.layout.getRendererForBar(this.renderer.staff.staveId, this.endBeat.voice.bar);
        this.endNoteRenderer = endNoteRenderer;
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let shouldDraw = false;
        // if we are on the tie start, we check if we
        // either can draw till the end note, or we just can draw till the bar end
        this.tieDirection = !startNoteRenderer
            ? this.getBeamDirection(this.endBeat, endNoteRenderer)
            : this.getBeamDirection(this.startBeat, startNoteRenderer);
        if (!this.forEnd && startNoteRenderer) {
            // line break or bar break
            if (startNoteRenderer !== endNoteRenderer) {
                startX = cx + startNoteRenderer.x + this.getStartX();
                startY = cy + startNoteRenderer.y + this.getStartY() + this.yOffset;
                // line break: to bar end
                if (!endNoteRenderer || startNoteRenderer.staff !== endNoteRenderer.staff) {
                    endX = cx + startNoteRenderer.x + startNoteRenderer.width;
                    endY = startY;
                }
                else {
                    endX = cx + endNoteRenderer.x + this.getEndX();
                    endY = cy + endNoteRenderer.y + this.getEndY() + this.yOffset;
                }
            }
            else {
                startX = cx + startNoteRenderer.x + this.getStartX();
                endX = cx + endNoteRenderer.x + this.getEndX();
                startY = cy + startNoteRenderer.y + this.getStartY() + this.yOffset;
                endY = cy + endNoteRenderer.y + this.getEndY() + this.yOffset;
            }
            shouldDraw = true;
        }
        else if (!startNoteRenderer || startNoteRenderer.staff !== endNoteRenderer.staff) {
            startX = cx + endNoteRenderer.x;
            endX = cx + endNoteRenderer.x + this.getEndX();
            startY = cy + endNoteRenderer.y + this.getEndY() + this.yOffset;
            endY = startY;
            shouldDraw = true;
        }
        if (shouldDraw) {
            if (this.shouldDrawBendSlur()) {
                TieGlyph.drawBendSlur(canvas, startX, startY, endX, endY, this.tieDirection === BeamDirection.Down, this.scale);
            }
            else {
                TieGlyph.paintTie(canvas, this.scale, startX, startY, endX, endY, this.tieDirection === BeamDirection.Down, this.getTieHeight(startX, startY, endX, endY), 4);
            }
        }
    }
    shouldDrawBendSlur() {
        return false;
    }
    getTieHeight(startX, startY, endX, endY) {
        return 22;
    }
    getBeamDirection(beat, noteRenderer) {
        return BeamDirection.Down;
    }
    getStartY() {
        return 0;
    }
    getEndY() {
        return 0;
    }
    getStartX() {
        return 0;
    }
    getEndX() {
        return 0;
    }
    static paintTie(canvas, scale, x1, y1, x2, y2, down = false, offset = 22, size = 4) {
        if (x1 === x2 && y1 === y2) {
            return;
        }
        // ensure endX > startX
        if (x2 < x1) {
            let t = x1;
            x1 = x2;
            x2 = t;
            t = y1;
            y1 = y2;
            y2 = t;
        }
        //
        // calculate control points
        //
        offset *= scale;
        size *= scale;
        // normal vector
        let normalVectorX = y2 - y1;
        let normalVectorY = x2 - x1;
        let length = Math.sqrt(normalVectorX * normalVectorX + normalVectorY * normalVectorY);
        if (down) {
            normalVectorX *= -1;
        }
        else {
            normalVectorY *= -1;
        }
        // make to unit vector
        normalVectorX /= length;
        normalVectorY /= length;
        // center of connection
        let centerX = (x2 + x1) / 2;
        let centerY = (y2 + y1) / 2;
        // control points
        let cp1X = centerX + offset * normalVectorX;
        let cp1Y = centerY + offset * normalVectorY;
        let cp2X = centerX + (offset - size) * normalVectorX;
        let cp2Y = centerY + (offset - size) * normalVectorY;
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.quadraticCurveTo(cp1X, cp1Y, x2, y2);
        canvas.quadraticCurveTo(cp2X, cp2Y, x1, y1);
        canvas.closePath();
        canvas.fill();
    }
    static drawBendSlur(canvas, x1, y1, x2, y2, down, scale, slurText) {
        let normalVectorX = y2 - y1;
        let normalVectorY = x2 - x1;
        let length = Math.sqrt(normalVectorX * normalVectorX + normalVectorY * normalVectorY);
        if (down) {
            normalVectorX *= -1;
        }
        else {
            normalVectorY *= -1;
        }
        // make to unit vector
        normalVectorX /= length;
        normalVectorY /= length;
        // center of connection
        // TODO: should be 1/3
        let centerX = (x2 + x1) / 2;
        let centerY = (y2 + y1) / 2;
        let offset = TieGlyph.BendSlurHeight * scale;
        if (x2 - x1 < 20) {
            offset /= 2;
        }
        let cp1X = centerX + offset * normalVectorX;
        let cp1Y = centerY + offset * normalVectorY;
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.lineTo(cp1X, cp1Y);
        canvas.lineTo(x2, y2);
        canvas.stroke();
        if (slurText) {
            let w = canvas.measureText(slurText);
            let textOffset = down ? 0 : -canvas.font.size;
            canvas.fillText(slurText, cp1X - w / 2, cp1Y + textOffset);
        }
    }
}
TieGlyph.BendSlurHeight = 11;
//# sourceMappingURL=TieGlyph.js.map
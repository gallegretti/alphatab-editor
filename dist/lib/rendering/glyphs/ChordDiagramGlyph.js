import { TextAlign, TextBaseline } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class ChordDiagramGlyph extends EffectGlyph {
    constructor(x, y, chord) {
        super(x, y);
        this._textRow = 0;
        this._fretRow = 0;
        this._firstFretSpacing = 0;
        this._chord = chord;
    }
    doLayout() {
        super.doLayout();
        const scale = this.scale;
        let res = this.renderer.resources;
        this._textRow = res.effectFont.size * 1.5 * scale;
        this._fretRow = res.effectFont.size * 1.5 * scale;
        if (this._chord.firstFret > 1) {
            this._firstFretSpacing = ChordDiagramGlyph.FretSpacing * scale;
        }
        else {
            this._firstFretSpacing = 0;
        }
        this.height =
            this._textRow +
                this._fretRow +
                (ChordDiagramGlyph.Frets - 1) * ChordDiagramGlyph.FretSpacing * scale +
                2 * ChordDiagramGlyph.Padding * scale;
        this.width =
            this._firstFretSpacing +
                (this._chord.staff.tuning.length - 1) * ChordDiagramGlyph.StringSpacing * scale +
                2 * ChordDiagramGlyph.Padding * scale;
    }
    paint(cx, cy, canvas) {
        cx += this.x + ChordDiagramGlyph.Padding * this.scale + this._firstFretSpacing;
        cy += this.y;
        let w = this.width - 2 * ChordDiagramGlyph.Padding * this.scale + this.scale - this._firstFretSpacing;
        let stringSpacing = ChordDiagramGlyph.StringSpacing * this.scale;
        let fretSpacing = ChordDiagramGlyph.FretSpacing * this.scale;
        let res = this.renderer.resources;
        let circleRadius = ChordDiagramGlyph.CircleRadius * this.scale;
        let align = canvas.textAlign;
        let baseline = canvas.textBaseline;
        canvas.font = res.effectFont;
        canvas.textAlign = TextAlign.Center;
        canvas.textBaseline = TextBaseline.Top;
        if (this._chord.showName) {
            canvas.fillText(this._chord.name, cx + this.width / 2, cy + res.effectFont.size / 2);
        }
        cy += this._textRow;
        cx += stringSpacing / 2;
        canvas.font = res.fretboardNumberFont;
        canvas.textBaseline = TextBaseline.Middle;
        for (let i = 0; i < this._chord.staff.tuning.length; i++) {
            let x = cx + i * stringSpacing;
            let y = cy + this._fretRow / 2;
            let fret = this._chord.strings[this._chord.staff.tuning.length - i - 1];
            if (fret < 0) {
                canvas.fillMusicFontSymbol(x, y, this.scale, MusicFontSymbol.FretboardX, true);
            }
            else if (fret === 0) {
                canvas.fillMusicFontSymbol(x, y, this.scale, MusicFontSymbol.FretboardO, true);
            }
            else {
                fret -= this._chord.firstFret - 1;
                canvas.fillText(fret.toString(), x, y);
            }
        }
        cy += this._fretRow;
        for (let i = 0; i < this._chord.staff.tuning.length; i++) {
            let x = cx + i * stringSpacing;
            canvas.fillRect(x, cy, 1, fretSpacing * ChordDiagramGlyph.Frets + this.scale);
        }
        if (this._chord.firstFret > 1) {
            canvas.textAlign = TextAlign.Left;
            canvas.fillText(this._chord.firstFret.toString(), cx - this._firstFretSpacing, cy + fretSpacing / 2);
        }
        canvas.fillRect(cx, cy - this.scale, w, 2 * this.scale);
        for (let i = 0; i <= ChordDiagramGlyph.Frets; i++) {
            let y = cy + i * fretSpacing;
            canvas.fillRect(cx, y, w, this.scale);
        }
        let barreLookup = new Map();
        for (let barreFret of this._chord.barreFrets) {
            let strings = [-1, -1];
            barreLookup.set(barreFret - this._chord.firstFret, strings);
        }
        for (let guitarString = 0; guitarString < this._chord.strings.length; guitarString++) {
            let fret = this._chord.strings[guitarString];
            if (fret > 0) {
                fret -= this._chord.firstFret;
                if (barreLookup.has(fret)) {
                    let info = barreLookup.get(fret);
                    if (info[0] === -1 || guitarString < info[0]) {
                        info[0] = guitarString;
                    }
                    if (info[1] === -1 || guitarString > info[1]) {
                        info[1] = guitarString;
                    }
                }
                let y = cy + fret * fretSpacing + fretSpacing / 2 + 0.5 * this.scale;
                let x = cx + (this._chord.strings.length - guitarString - 1) * stringSpacing;
                canvas.fillCircle(x, y, circleRadius);
            }
        }
        for (const [fret, strings] of barreLookup) {
            let y = cy + fret * fretSpacing + fretSpacing / 2 + 0.5 * this.scale;
            let xLeft = cx + (this._chord.strings.length - strings[1] - 1) * stringSpacing;
            let xRight = cx + (this._chord.strings.length - strings[0] - 1) * stringSpacing;
            canvas.fillRect(xLeft, y - circleRadius, xRight - xLeft, circleRadius * 2);
        }
        canvas.textAlign = align;
        canvas.textBaseline = baseline;
    }
}
ChordDiagramGlyph.Padding = 5;
ChordDiagramGlyph.Frets = 5;
ChordDiagramGlyph.CircleRadius = 2.5;
ChordDiagramGlyph.StringSpacing = 10;
ChordDiagramGlyph.FretSpacing = 12;
//# sourceMappingURL=ChordDiagramGlyph.js.map
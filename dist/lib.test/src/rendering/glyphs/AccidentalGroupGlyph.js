import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
class AccidentalColumnInfo {
    constructor() {
        this.x = 0;
        this.y = -3000;
        this.width = 0;
    }
}
export class AccidentalGroupGlyph extends GlyphGroup {
    constructor() {
        super(0, 0);
    }
    doLayout() {
        if (!this.glyphs || this.glyphs.length === 0) {
            this.width = 0;
            return;
        }
        //
        // Determine Columns for accidentals
        //
        this.glyphs.sort((a, b) => {
            if (a.y < b.y) {
                return -1;
            }
            if (a.y > b.y) {
                return 1;
            }
            return 0;
        });
        // defines the reserved y position of the columns
        let columns = [];
        columns.push(new AccidentalColumnInfo());
        let accidentalHeight = 21 * this.scale;
        for (let i = 0, j = this.glyphs.length; i < j; i++) {
            let g = this.glyphs[i];
            g.renderer = this.renderer;
            g.doLayout();
            // find column where glyph fits into
            // as long the glyph does not fit into the current column
            let gColumn = 0;
            while (columns[gColumn].y > g.y) {
                // move to next column
                gColumn++;
                // and create the new column if needed
                if (gColumn === columns.length) {
                    columns.push(new AccidentalColumnInfo());
                }
            }
            // temporary save column as X
            g.x = gColumn;
            columns[gColumn].y = g.y + accidentalHeight;
            if (columns[gColumn].width < g.width) {
                columns[gColumn].width = g.width;
            }
        }
        //
        // Place accidentals in columns
        //
        this.width = 0;
        for (const column of columns) {
            this.width += column.width;
            column.x = this.width;
        }
        for (let i = 0, j = this.glyphs.length; i < j; i++) {
            let g = this.glyphs[i];
            const column = columns[g.x];
            g.x = (this.width - column.x);
        }
    }
}
//# sourceMappingURL=AccidentalGroupGlyph.js.map
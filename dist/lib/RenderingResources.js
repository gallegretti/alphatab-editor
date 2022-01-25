import { Color } from '@src/model/Color';
import { Font, FontStyle, FontWeight } from '@src/model/Font';
/**
 * This public class contains central definitions for controlling the visual appearance.
 * @json
 */
export class RenderingResources {
    constructor() {
        /**
         * Gets or sets the font to use for displaying the songs copyright information in the header of the music sheet.
         */
        this.copyrightFont = new Font(RenderingResources.sansFont, 12, FontStyle.Plain, FontWeight.Bold);
        /**
         * Gets or sets the font to use for displaying the songs title in the header of the music sheet.
         */
        this.titleFont = new Font(RenderingResources.serifFont, 32, FontStyle.Plain);
        /**
         * Gets or sets the font to use for displaying the songs subtitle in the header of the music sheet.
         */
        this.subTitleFont = new Font(RenderingResources.serifFont, 20, FontStyle.Plain);
        /**
         * Gets or sets the font to use for displaying the lyrics information in the header of the music sheet.
         */
        this.wordsFont = new Font(RenderingResources.serifFont, 15, FontStyle.Plain);
        /**
         * Gets or sets the font to use for displaying certain effect related elements in the music sheet.
         */
        this.effectFont = new Font(RenderingResources.serifFont, 12, FontStyle.Italic);
        /**
         * Gets or sets the font to use for displaying the fretboard numbers in chord diagrams.
         */
        this.fretboardNumberFont = new Font(RenderingResources.sansFont, 11, FontStyle.Plain);
        /**
         * Gets or sets the font to use for displaying the guitar tablature numbers in the music sheet.
         */
        this.tablatureFont = new Font(RenderingResources.sansFont, 13, FontStyle.Plain);
        /**
         * Gets or sets the font to use for grace notation related texts in the music sheet.
         */
        this.graceFont = new Font(RenderingResources.sansFont, 11, FontStyle.Plain);
        /**
         * Gets or sets the color to use for rendering the lines of staves.
         */
        this.staffLineColor = new Color(165, 165, 165, 0xff);
        /**
         * Gets or sets the color to use for rendering bar separators, the accolade and repeat signs.
         */
        this.barSeparatorColor = new Color(34, 34, 17, 0xff);
        /**
         * Gets or sets the font to use for displaying the bar numbers above the music sheet.
         */
        this.barNumberFont = new Font(RenderingResources.sansFont, 11, FontStyle.Plain);
        /**
         * Gets or sets the color to use for displaying the bar numbers above the music sheet.
         */
        this.barNumberColor = new Color(200, 0, 0, 0xff);
        /**
         * Gets or sets the font to use for displaying finger information in the music sheet.
         */
        this.fingeringFont = new Font(RenderingResources.serifFont, 14, FontStyle.Plain);
        /**
         * Gets or sets the font to use for section marker labels shown above the music sheet.
         */
        this.markerFont = new Font(RenderingResources.serifFont, 14, FontStyle.Plain, FontWeight.Bold);
        /**
         * Gets or sets the color to use for music notation elements of the primary voice.
         */
        this.mainGlyphColor = new Color(0, 0, 0, 0xff);
        /**
         * Gets or sets the color to use for music notation elements of the secondary voices.
         */
        this.secondaryGlyphColor = new Color(0, 0, 0, 100);
        /**
         * Gets or sets the color to use for displaying the song information above the music sheet.
         */
        this.scoreInfoColor = new Color(0, 0, 0, 0xff);
    }
}
RenderingResources.sansFont = 'Arial';
RenderingResources.serifFont = 'Georgia';
//# sourceMappingURL=RenderingResources.js.map
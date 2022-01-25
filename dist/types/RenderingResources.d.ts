import { Color } from '@src/model/Color';
import { Font } from '@src/model/Font';
/**
 * This public class contains central definitions for controlling the visual appearance.
 * @json
 */
export declare class RenderingResources {
    private static sansFont;
    private static serifFont;
    /**
     * Gets or sets the font to use for displaying the songs copyright information in the header of the music sheet.
     */
    copyrightFont: Font;
    /**
     * Gets or sets the font to use for displaying the songs title in the header of the music sheet.
     */
    titleFont: Font;
    /**
     * Gets or sets the font to use for displaying the songs subtitle in the header of the music sheet.
     */
    subTitleFont: Font;
    /**
     * Gets or sets the font to use for displaying the lyrics information in the header of the music sheet.
     */
    wordsFont: Font;
    /**
     * Gets or sets the font to use for displaying certain effect related elements in the music sheet.
     */
    effectFont: Font;
    /**
     * Gets or sets the font to use for displaying the fretboard numbers in chord diagrams.
     */
    fretboardNumberFont: Font;
    /**
     * Gets or sets the font to use for displaying the guitar tablature numbers in the music sheet.
     */
    tablatureFont: Font;
    /**
     * Gets or sets the font to use for grace notation related texts in the music sheet.
     */
    graceFont: Font;
    /**
     * Gets or sets the color to use for rendering the lines of staves.
     */
    staffLineColor: Color;
    /**
     * Gets or sets the color to use for rendering bar separators, the accolade and repeat signs.
     */
    barSeparatorColor: Color;
    /**
     * Gets or sets the font to use for displaying the bar numbers above the music sheet.
     */
    barNumberFont: Font;
    /**
     * Gets or sets the color to use for displaying the bar numbers above the music sheet.
     */
    barNumberColor: Color;
    /**
     * Gets or sets the font to use for displaying finger information in the music sheet.
     */
    fingeringFont: Font;
    /**
     * Gets or sets the font to use for section marker labels shown above the music sheet.
     */
    markerFont: Font;
    /**
     * Gets or sets the color to use for music notation elements of the primary voice.
     */
    mainGlyphColor: Color;
    /**
     * Gets or sets the color to use for music notation elements of the secondary voices.
     */
    secondaryGlyphColor: Color;
    /**
     * Gets or sets the color to use for displaying the song information above the music sheet.
     */
    scoreInfoColor: Color;
}

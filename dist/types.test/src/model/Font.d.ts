/**
 * Lists all flags for font styles.
 */
export declare enum FontStyle {
    /**
     * No flags.
     */
    Plain = 0,
    /**
     * Font is italic.
     */
    Italic = 1
}
/**
 * Lists all font weight values.
 */
export declare enum FontWeight {
    /**
     * Not bold
     */
    Regular = 0,
    /**
     * Font is bold
     */
    Bold = 1
}
/**
 * @json_immutable
 */
export declare class Font {
    private _css;
    private _cssScale;
    private _family;
    private _style;
    private _weight;
    private _size;
    private reset;
    /**
     * Gets the font family name.
     */
    get family(): string;
    /**
     * Sets the font family name.
     */
    set family(value: string);
    /**
     * Gets the font size in pixels.
     */
    get size(): number;
    /**
     * Sets the font size in pixels.
     */
    set size(value: number);
    /**
     * Gets the font style.
     */
    get style(): FontStyle;
    /**
     * Sets the font style.
     */
    set style(value: FontStyle);
    /**
     * Gets the font weight.
     */
    get weight(): FontWeight;
    /**
     * Gets or sets the font weight.
     */
    set weight(value: FontWeight);
    get isBold(): boolean;
    get isItalic(): boolean;
    /**
     * Initializes a new instance of the {@link Font} class.
     * @param family The family.
     * @param size The size.
     * @param style The style.
     * @param weight The weight.
     */
    constructor(family: string, size: number, style?: FontStyle, weight?: FontWeight);
    toCssString(scale?: number): string;
    static fromJson(v: unknown): Font | null;
    static toJson(font: Font): Map<string, unknown>;
}

/**
 * @json_immutable
 */
export declare class Color {
    static readonly BlackRgb: string;
    /**
     * Initializes a new instance of the {@link Color} class.
     * @param r The red component.
     * @param g The green component.
     * @param b The blue component.
     * @param a The alpha component.
     */
    constructor(r: number, g: number, b: number, a?: number);
    updateRgba(): void;
    /**
     * Gets or sets the raw RGBA value.
     */
    raw: number;
    get a(): number;
    get r(): number;
    get g(): number;
    get b(): number;
    /**
     * Gets the RGBA hex string to use in CSS areas.
     */
    rgba: string;
    static random(opacity?: number): Color;
    static fromJson(v: unknown): Color | null;
    static toJson(obj: Color): number;
}

/**
 * Based on https://github.com/mapbox/pixelmatch
 * ISC License
 * Copyright (c) 2019, Mapbox
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */
export declare class PixelMatchOptions {
    /**
     * Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive.
     * @default 0.1
     */
    threshold: number | null;
    /**
     * If true, disables detecting and ignoring anti-aliased pixels.
     * @default false
     */
    includeAA: boolean | null;
    /**
     * Blending factor of unchanged pixels in the diff output.
     * Ranges from 0 for pure white to 1 for original brightness
     * @default 0.1
     */
    alpha: number | null;
    /**
     * The color of anti-aliased pixels in the diff output.
     * @default [255, 255, 0]
     */
    aaColor: number[] | null;
    /**
     * The color of differing pixels in the diff output.
     * @default [255, 0, 0]
     */
    diffColor: number[] | null;
    /**
     * An alternative color to use for dark on light differences to differentiate between "added" and "removed" parts.
     * If not provided, all differing pixels use the color specified by `diffColor`.
     * @default null
     */
    diffColorAlt: number[] | null;
    /**
     * Draw the diff over a transparent background (a mask), rather than over the original image.
     * Will not draw anti-aliased pixels (if detected)
     * @default false
     */
    diffMask: boolean | null;
}
export declare class PixelMatchResult {
    readonly totalPixels: number;
    readonly differentPixels: number;
    readonly transparentPixels: number;
    constructor(totalPixels: number, differentPixels: number, transparentPixels: number);
}
export declare class PixelMatch {
    static defaultOptions: PixelMatchOptions;
    private static createDefaultOptions;
    static match(img1: Uint8Array, img2: Uint8Array, output: Uint8Array, width: number, height: number, options: PixelMatchOptions): PixelMatchResult;
    static antialiased(img: Uint8Array, x1: number, y1: number, width: number, height: number, img2: Uint8Array): boolean;
    static hasManySiblings(img: Uint8Array, x1: number, y1: number, width: number, height: number): boolean;
    static colorDelta(img1: Uint8Array, img2: Uint8Array, k: number, m: number, yOnly?: boolean): number;
    static rgb2y(r: number, g: number, b: number): number;
    static rgb2i(r: number, g: number, b: number): number;
    static rgb2q(r: number, g: number, b: number): number;
    static blend(c: number, a: number): number;
    static drawPixel(output: Uint8Array, pos: number, r: number, g: number, b: number): void;
    static drawGrayPixel(img: Uint8Array, i: number, alpha: number, output: Uint8Array): void;
}

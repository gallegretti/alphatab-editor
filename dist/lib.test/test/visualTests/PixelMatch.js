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
export class PixelMatchOptions {
    constructor() {
        /**
         * Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive.
         * @default 0.1
         */
        this.threshold = null;
        /**
         * If true, disables detecting and ignoring anti-aliased pixels.
         * @default false
         */
        this.includeAA = null;
        /**
         * Blending factor of unchanged pixels in the diff output.
         * Ranges from 0 for pure white to 1 for original brightness
         * @default 0.1
         */
        this.alpha = null;
        /**
         * The color of anti-aliased pixels in the diff output.
         * @default [255, 255, 0]
         */
        this.aaColor = null;
        /**
         * The color of differing pixels in the diff output.
         * @default [255, 0, 0]
         */
        this.diffColor = null;
        /**
         * An alternative color to use for dark on light differences to differentiate between "added" and "removed" parts.
         * If not provided, all differing pixels use the color specified by `diffColor`.
         * @default null
         */
        this.diffColorAlt = null;
        /**
         * Draw the diff over a transparent background (a mask), rather than over the original image.
         * Will not draw anti-aliased pixels (if detected)
         * @default false
         */
        this.diffMask = null;
    }
}
export class PixelMatchResult {
    constructor(totalPixels, differentPixels, transparentPixels) {
        this.totalPixels = totalPixels;
        this.differentPixels = differentPixels;
        this.transparentPixels = transparentPixels;
    }
}
export class PixelMatch {
    static createDefaultOptions() {
        const o = new PixelMatchOptions();
        o.threshold = 0.1; // matching threshold (0 to 1); smaller is more sensitive
        o.includeAA = false; // whether to skip anti-aliasing detection
        o.alpha = 0.1; // opacity of original image in diff ouput
        o.aaColor = [255, 255, 0]; // color of anti-aliased pixels in diff output
        o.diffColor = [255, 0, 0]; // color of different pixels in diff output
        o.diffMask = false; // draw the diff over a transparent background (a mask)
        return o;
    }
    static match(img1, img2, output, width, height, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (img1.length !== img2.length || (output && output.length !== img1.length)) {
            throw new Error('Image sizes do not match.');
        }
        if (img1.length !== width * height * 4)
            throw new Error('Image data size does not match width/height.');
        options.aaColor = (_a = options.aaColor) !== null && _a !== void 0 ? _a : PixelMatch.defaultOptions.aaColor;
        options.alpha = (_b = options.alpha) !== null && _b !== void 0 ? _b : PixelMatch.defaultOptions.alpha;
        options.diffColor = (_c = options.diffColor) !== null && _c !== void 0 ? _c : PixelMatch.defaultOptions.diffColor;
        options.diffColorAlt = (_d = options.diffColorAlt) !== null && _d !== void 0 ? _d : PixelMatch.defaultOptions.diffColorAlt;
        options.diffMask = (_e = options.diffMask) !== null && _e !== void 0 ? _e : PixelMatch.defaultOptions.diffMask;
        options.includeAA = (_f = options.includeAA) !== null && _f !== void 0 ? _f : PixelMatch.defaultOptions.includeAA;
        options.threshold = (_g = options.threshold) !== null && _g !== void 0 ? _g : PixelMatch.defaultOptions.threshold;
        // check if images are identical
        const len = width * height;
        let identical = true;
        let transparentPixels = 0;
        for (let i = 0; i < len; i++) {
            const img1r = img1[(i * 4) + 0];
            const img1g = img1[(i * 4) + 1];
            const img1b = img1[(i * 4) + 2];
            const img1a = img1[(i * 4) + 3];
            const img2r = img2[(i * 4) + 0];
            const img2g = img2[(i * 4) + 1];
            const img2b = img2[(i * 4) + 2];
            const img2a = img2[(i * 4) + 3];
            if (img1r !== img2r || img1g !== img2g || img1b !== img2b || img1a !== img2a) {
                identical = false;
                break;
            }
            if (img1a === 0) {
                transparentPixels++;
            }
        }
        if (identical) {
            // fast path if identical
            if (output && !options.diffMask) {
                for (let i = 0; i < len; i++)
                    PixelMatch.drawGrayPixel(img1, 4 * i, options.alpha, output);
            }
            return new PixelMatchResult(len, 0, transparentPixels);
        }
        transparentPixels = 0;
        // maximum acceptable square distance between two colors;
        // 35215 is the maximum possible value for the YIQ difference metric
        const maxDelta = 35215 * options.threshold * options.threshold;
        let diff = 0;
        const aaR = options.aaColor[0];
        const aaG = options.aaColor[1];
        const aaB = options.aaColor[2];
        const diffR = options.diffColor[0];
        const diffG = options.diffColor[1];
        const diffB = options.diffColor[2];
        // compare each pixel of one image against the other one
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pos = (y * width + x) * 4;
                if (img1[pos + 3] === 0) {
                    transparentPixels++;
                }
                // squared YUV distance between colors at this pixel position
                const delta = PixelMatch.colorDelta(img1, img2, pos, pos);
                // the color difference is above the threshold
                if (delta > maxDelta) {
                    // check it's a real rendering difference or just anti-aliasing
                    if (!options.includeAA &&
                        (PixelMatch.antialiased(img1, x, y, width, height, img2) ||
                            PixelMatch.antialiased(img2, x, y, width, height, img1))) {
                        // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
                        // note that we do not include such pixels in a mask
                        if (output && !options.diffMask)
                            PixelMatch.drawPixel(output, pos, aaR, aaG, aaB);
                    }
                    else {
                        // found substantial difference not caused by anti-aliasing; draw it as red
                        if (output)
                            PixelMatch.drawPixel(output, pos, diffR, diffG, diffB);
                        diff++;
                    }
                }
                else if (output) {
                    // pixels are similar; draw background as grayscale image blended with white
                    if (!options.diffMask)
                        PixelMatch.drawGrayPixel(img1, pos, options.alpha, output);
                }
            }
        }
        // return the number of different pixels
        return new PixelMatchResult(len, diff, transparentPixels);
    }
    // check if a pixel is likely a part of anti-aliasing;
    // based on "Anti-aliased Pixel and Intensity Slope Detector" paper by V. Vysniauskas, 2009
    static antialiased(img, x1, y1, width, height, img2) {
        const distance = 1;
        const x0 = Math.max(x1 - distance, 0);
        const y0 = Math.max(y1 - distance, 0);
        const x2 = Math.min(x1 + distance, width - 1);
        const y2 = Math.min(y1 + distance, height - 1);
        const pos = (y1 * width + x1) * 4;
        let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
        let min = 0;
        let max = 0;
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;
        // go through 8 adjacent pixels
        for (let x = x0; x <= x2; x++) {
            for (let y = y0; y <= y2; y++) {
                if (x === x1 && y === y1)
                    continue;
                // brightness delta between the center pixel and adjacent one
                const delta = PixelMatch.colorDelta(img, img, pos, (y * width + x) * 4, true);
                // count the number of equal, darker and brighter adjacent pixels
                if (delta === 0) {
                    zeroes++;
                    // if found more than 2 equal siblings, it's definitely not anti-aliasing
                    if (zeroes > 2)
                        return false;
                    // remember the darkest pixel
                }
                else if (delta < min) {
                    min = delta;
                    minX = x;
                    minY = y;
                    // remember the brightest pixel
                }
                else if (delta > max) {
                    max = delta;
                    maxX = x;
                    maxY = y;
                }
            }
        }
        // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
        if (min === 0 || max === 0)
            return false;
        // if either the darkest or the brightest pixel has 3+ equal siblings in both images
        // (definitely not anti-aliased), this pixel is anti-aliased
        return ((PixelMatch.hasManySiblings(img, minX, minY, width, height) &&
            PixelMatch.hasManySiblings(img2, minX, minY, width, height)) ||
            (PixelMatch.hasManySiblings(img, maxX, maxY, width, height) &&
                PixelMatch.hasManySiblings(img2, maxX, maxY, width, height)));
    }
    // check if a pixel has 3+ adjacent pixels of the same color.
    static hasManySiblings(img, x1, y1, width, height) {
        const distance = 1;
        const x0 = Math.max(x1 - distance, 0);
        const y0 = Math.max(y1 - distance, 0);
        const x2 = Math.min(x1 + distance, width - 1);
        const y2 = Math.min(y1 + distance, height - 1);
        const pos = (y1 * width + x1) * 4;
        let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
        // go through 8 adjacent pixels
        for (let x = x0; x <= x2; x++) {
            for (let y = y0; y <= y2; y++) {
                if (x === x1 && y === y1)
                    continue;
                const pos2 = (y * width + x) * 4;
                if (img[pos] === img[pos2] &&
                    img[pos + 1] === img[pos2 + 1] &&
                    img[pos + 2] === img[pos2 + 2] &&
                    img[pos + 3] === img[pos2 + 3]) {
                    zeroes++;
                }
                if (zeroes > 2)
                    return true;
            }
        }
        return false;
    }
    // calculate color difference according to the paper "Measuring perceived color difference
    // using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos
    static colorDelta(img1, img2, k, m, yOnly = false) {
        let r1 = img1[k + 0];
        let g1 = img1[k + 1];
        let b1 = img1[k + 2];
        let a1 = img1[k + 3];
        let r2 = img2[m + 0];
        let g2 = img2[m + 1];
        let b2 = img2[m + 2];
        let a2 = img2[m + 3];
        if (a1 === a2 && r1 === r2 && g1 === g2 && b1 === b2)
            return 0;
        if (a1 < 255) {
            a1 /= 255;
            r1 = PixelMatch.blend(r1, a1);
            g1 = PixelMatch.blend(g1, a1);
            b1 = PixelMatch.blend(b1, a1);
        }
        if (a2 < 255) {
            a2 /= 255;
            r2 = PixelMatch.blend(r2, a2);
            g2 = PixelMatch.blend(g2, a2);
            b2 = PixelMatch.blend(b2, a2);
        }
        const y = PixelMatch.rgb2y(r1, g1, b1) - PixelMatch.rgb2y(r2, g2, b2);
        if (yOnly)
            return y; // brightness difference only
        const i = PixelMatch.rgb2i(r1, g1, b1) - PixelMatch.rgb2i(r2, g2, b2);
        const q = PixelMatch.rgb2q(r1, g1, b1) - PixelMatch.rgb2q(r2, g2, b2);
        return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
    }
    static rgb2y(r, g, b) {
        return r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
    }
    static rgb2i(r, g, b) {
        return r * 0.59597799 - g * 0.2741761 - b * 0.32180189;
    }
    static rgb2q(r, g, b) {
        return r * 0.21147017 - g * 0.52261711 + b * 0.31114694;
    }
    // blend semi-transparent color with white
    static blend(c, a) {
        return 255 + (c - 255) * a;
    }
    static drawPixel(output, pos, r, g, b) {
        output[pos + 0] = r;
        output[pos + 1] = g;
        output[pos + 2] = b;
        output[pos + 3] = 255;
    }
    static drawGrayPixel(img, i, alpha, output) {
        const r = img[i + 0];
        const g = img[i + 1];
        const b = img[i + 2];
        const value = PixelMatch.blend(PixelMatch.rgb2y(r, g, b), (alpha * img[i + 3]) / 255);
        PixelMatch.drawPixel(output, i, value, value, value);
    }
}
PixelMatch.defaultOptions = PixelMatch.createDefaultOptions();
//# sourceMappingURL=PixelMatch.js.map
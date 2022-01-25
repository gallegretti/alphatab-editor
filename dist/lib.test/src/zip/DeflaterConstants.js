// This Deflate algorithm is based on the Deflater class of the SharpZipLib (MIT)
// https://github.com/icsharpcode/SharpZipLib
/*
 * Copyright © 2000-2018 SharpZipLib Contributors
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * This class contains constants used for deflation.
 */
export class DeflaterConstants {
}
DeflaterConstants.MAX_WBITS = 15;
DeflaterConstants.WSIZE = 1 << DeflaterConstants.MAX_WBITS;
DeflaterConstants.WMASK = DeflaterConstants.WSIZE - 1;
DeflaterConstants.MIN_MATCH = 3;
DeflaterConstants.MAX_MATCH = 258;
DeflaterConstants.DEFAULT_MEM_LEVEL = 8;
DeflaterConstants.PENDING_BUF_SIZE = 1 << (DeflaterConstants.DEFAULT_MEM_LEVEL + 8);
DeflaterConstants.HASH_BITS = DeflaterConstants.DEFAULT_MEM_LEVEL + 7;
DeflaterConstants.HASH_SIZE = 1 << DeflaterConstants.HASH_BITS;
DeflaterConstants.HASH_SHIFT = (DeflaterConstants.HASH_BITS + DeflaterConstants.MIN_MATCH - 1) / DeflaterConstants.MIN_MATCH;
DeflaterConstants.HASH_MASK = DeflaterConstants.HASH_SIZE - 1;
DeflaterConstants.MIN_LOOKAHEAD = DeflaterConstants.MAX_MATCH + DeflaterConstants.MIN_MATCH + 1;
DeflaterConstants.MAX_DIST = DeflaterConstants.WSIZE - DeflaterConstants.MIN_LOOKAHEAD;
//# sourceMappingURL=DeflaterConstants.js.map
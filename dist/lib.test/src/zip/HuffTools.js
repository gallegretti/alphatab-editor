// This Inflate algorithm is based on the Inflate class of the Haxe Standard Library (MIT)
import { FormatError } from '@src/FormatError';
/*
 * Copyright (C)2005-2019 Haxe Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import { Found, NeedBit, NeedBits } from '@src/zip/Huffman';
// This Inflater is based on the Zip Reader of the Haxe Standard Library (MIT)
export class HuffTools {
    static make(lengths, pos, nlengths, maxbits) {
        let counts = [];
        let tmp = [];
        if (maxbits > 32) {
            throw new FormatError('Invalid huffman');
        }
        for (let i = 0; i < maxbits; i++) {
            counts.push(0);
            tmp.push(0);
        }
        for (let i = 0; i < nlengths; i++) {
            let p = lengths[i + pos];
            if (p >= maxbits) {
                throw new FormatError('Invalid huffman');
            }
            counts[p]++;
        }
        let code = 0;
        for (let i = 1; i < maxbits - 1; i++) {
            code = (code + counts[i]) << 1;
            tmp[i] = code;
        }
        let bits = new Map();
        for (let i = 0; i < nlengths; i++) {
            let l = lengths[i + pos];
            if (l !== 0) {
                let n = tmp[l - 1];
                tmp[l - 1] = n + 1;
                bits.set((n << 5) | l, i);
            }
        }
        return HuffTools.treeCompress(new NeedBit(HuffTools.treeMake(bits, maxbits, 0, 1), HuffTools.treeMake(bits, maxbits, 1, 1)));
    }
    static treeMake(bits, maxbits, v, len) {
        if (len > maxbits) {
            throw new FormatError('Invalid huffman');
        }
        let idx = (v << 5) | len;
        if (bits.has(idx)) {
            return new Found(bits.get(idx));
        }
        v = v << 1;
        len += 1;
        return new NeedBit(HuffTools.treeMake(bits, maxbits, v, len), HuffTools.treeMake(bits, maxbits, v | 1, len));
    }
    static treeCompress(t) {
        let d = HuffTools.treeDepth(t);
        if (d === 0) {
            return t;
        }
        if (d === 1) {
            if (t instanceof NeedBit) {
                return new NeedBit(HuffTools.treeCompress(t.left), HuffTools.treeCompress(t.right));
            }
            else {
                throw new FormatError('assert');
            }
        }
        let size = 1 << d;
        let table = [];
        for (let i = 0; i < size; i++) {
            table.push(new Found(-1));
        }
        HuffTools.treeWalk(table, 0, 0, d, t);
        return new NeedBits(d, table);
    }
    static treeWalk(table, p, cd, d, t) {
        if (t instanceof NeedBit) {
            if (d > 0) {
                HuffTools.treeWalk(table, p, cd + 1, d - 1, t.left);
                HuffTools.treeWalk(table, p | (1 << cd), cd + 1, d - 1, t.right);
            }
            else {
                table[p] = HuffTools.treeCompress(t);
            }
        }
        else {
            table[p] = HuffTools.treeCompress(t);
        }
    }
    static treeDepth(t) {
        if (t instanceof Found) {
            return 0;
        }
        if (t instanceof NeedBits) {
            throw new FormatError('assert');
        }
        if (t instanceof NeedBit) {
            let da = HuffTools.treeDepth(t.left);
            let db = HuffTools.treeDepth(t.right);
            return 1 + (da < db ? da : db);
        }
        return 0;
    }
}
//# sourceMappingURL=HuffTools.js.map
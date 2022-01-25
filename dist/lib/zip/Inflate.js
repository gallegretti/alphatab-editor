// This Inflate algorithm is based on the Inflate class of the Haxe Standard Library (MIT)
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
import { FormatError } from '@src/FormatError';
import { IOHelper } from '@src/io/IOHelper';
import { Found as HuffmanFound, NeedBit as HuffmanNeedBit, NeedBits as HuffmanNeedBits } from '@src/zip/Huffman';
import { HuffTools } from '@src/zip/HuffTools';
var InflateState;
(function (InflateState) {
    InflateState[InflateState["Head"] = 0] = "Head";
    InflateState[InflateState["Block"] = 1] = "Block";
    InflateState[InflateState["CData"] = 2] = "CData";
    InflateState[InflateState["Flat"] = 3] = "Flat";
    InflateState[InflateState["Crc"] = 4] = "Crc";
    InflateState[InflateState["Dist"] = 5] = "Dist";
    InflateState[InflateState["DistOne"] = 6] = "DistOne";
    InflateState[InflateState["Done"] = 7] = "Done";
})(InflateState || (InflateState = {}));
class InflateWindow {
    constructor() {
        this.buffer = new Uint8Array(InflateWindow.BufferSize);
        this.pos = 0;
    }
    slide() {
        let b = new Uint8Array(InflateWindow.BufferSize);
        this.pos -= InflateWindow.Size;
        b.set(this.buffer.subarray(InflateWindow.Size, InflateWindow.Size + this.pos), 0);
        this.buffer = b;
    }
    addBytes(b, p, len) {
        if (this.pos + len > InflateWindow.BufferSize) {
            this.slide();
        }
        this.buffer.set(b.subarray(p, p + len), this.pos);
        this.pos += len;
    }
    addByte(c) {
        if (this.pos === InflateWindow.BufferSize) {
            this.slide();
        }
        this.buffer[this.pos] = c;
        this.pos++;
    }
    getLastChar() {
        return this.buffer[this.pos - 1];
    }
    available() {
        return this.pos;
    }
}
InflateWindow.Size = 1 << 15;
InflateWindow.BufferSize = 1 << 16;
export class Inflate {
    constructor(readable) {
        this._nbits = 0;
        this._bits = 0;
        this._state = InflateState.Block;
        this._isFinal = false;
        this._huffman = Inflate._fixedHuffman;
        this._huffdist = null;
        this._len = 0;
        this._dist = 0;
        this._needed = 0;
        this._output = null;
        this._outpos = 0;
        this._lengths = [];
        this._window = new InflateWindow();
        this._input = readable;
        for (let i = 0; i < 19; i++) {
            this._lengths.push(-1);
        }
    }
    static buildFixedHuffman() {
        let a = [];
        for (let n = 0; n < 288; n++) {
            a.push(n <= 143 ? 8 : n <= 255 ? 9 : n <= 279 ? 7 : 8);
        }
        return HuffTools.make(a, 0, 288, 10);
    }
    readBytes(b, pos, len) {
        this._needed = len;
        this._outpos = pos;
        this._output = b;
        if (len > 0) {
            while (this.inflateLoop()) {
                // inflating...
            }
        }
        return len - this._needed;
    }
    inflateLoop() {
        switch (this._state) {
            case InflateState.Head:
                let cmf = this._input.readByte();
                let cm = cmf & 15;
                if (cm !== 8) {
                    throw new FormatError('Invalid data');
                }
                let flg = this._input.readByte();
                // var fcheck = flg & 31;
                let fdict = (flg & 32) !== 0;
                // var flevel = flg >> 6;
                if (((cmf << 8) + flg) % 31 !== 0) {
                    throw new FormatError('Invalid data');
                }
                if (fdict) {
                    throw new FormatError('Unsupported dictionary');
                }
                this._state = InflateState.Block;
                return true;
            case InflateState.Crc:
                this._state = InflateState.Done;
                return true;
            case InflateState.Done:
                // nothing
                return false;
            case InflateState.Block:
                this._isFinal = this.getBit();
                switch (this.getBits(2)) {
                    case 0:
                        this._len = IOHelper.readUInt16LE(this._input);
                        let nlen = IOHelper.readUInt16LE(this._input);
                        if (nlen !== 0xffff - this._len) {
                            throw new FormatError('Invalid data');
                        }
                        this._state = InflateState.Flat;
                        let r = this.inflateLoop();
                        this.resetBits();
                        return r;
                    case 1:
                        this._huffman = Inflate._fixedHuffman;
                        this._huffdist = null;
                        this._state = InflateState.CData;
                        return true;
                    case 2:
                        let hlit = this.getBits(5) + 257;
                        let hdist = this.getBits(5) + 1;
                        let hclen = this.getBits(4) + 4;
                        for (let i = 0; i < hclen; i++) {
                            this._lengths[Inflate.CodeLengthsPos[i]] = this.getBits(3);
                        }
                        for (let i = hclen; i < 19; i++) {
                            this._lengths[Inflate.CodeLengthsPos[i]] = 0;
                        }
                        this._huffman = HuffTools.make(this._lengths, 0, 19, 8);
                        let xlengths = [];
                        for (let i = 0; i < hlit + hdist; i++) {
                            xlengths.push(0);
                        }
                        this.inflateLengths(xlengths, hlit + hdist);
                        this._huffdist = HuffTools.make(xlengths, hlit, hdist, 16);
                        this._huffman = HuffTools.make(xlengths, 0, hlit, 16);
                        this._state = InflateState.CData;
                        return true;
                    default:
                        throw new FormatError('Invalid data');
                }
            case InflateState.Flat: {
                let rlen = this._len < this._needed ? this._len : this._needed;
                let bytes = IOHelper.readByteArray(this._input, rlen);
                this._len -= rlen;
                this.addBytes(bytes, 0, rlen);
                if (this._len === 0)
                    this._state = this._isFinal ? InflateState.Crc : InflateState.Block;
                return this._needed > 0;
            }
            case InflateState.DistOne: {
                let rlen = this._len < this._needed ? this._len : this._needed;
                this.addDistOne(rlen);
                this._len -= rlen;
                if (this._len === 0) {
                    this._state = InflateState.CData;
                }
                return this._needed > 0;
            }
            case InflateState.Dist:
                while (this._len > 0 && this._needed > 0) {
                    let rdist = this._len < this._dist ? this._len : this._dist;
                    let rlen = this._needed < rdist ? this._needed : rdist;
                    this.addDist(this._dist, rlen);
                    this._len -= rlen;
                }
                if (this._len === 0) {
                    this._state = InflateState.CData;
                }
                return this._needed > 0;
            case InflateState.CData:
                let n = this.applyHuffman(this._huffman);
                if (n < 256) {
                    this.addByte(n);
                    return this._needed > 0;
                }
                else if (n === 256) {
                    this._state = this._isFinal ? InflateState.Crc : InflateState.Block;
                    return true;
                }
                else {
                    n = (n - 257) & 0xff;
                    let extraBits = Inflate.LenExtraBitsTbl[n];
                    if (extraBits === -1) {
                        throw new FormatError('Invalid data');
                    }
                    this._len = Inflate.LenBaseValTbl[n] + this.getBits(extraBits);
                    let huffdist = this._huffdist;
                    let distCode = !huffdist ? this.getRevBits(5) : this.applyHuffman(huffdist);
                    extraBits = Inflate.DistExtraBitsTbl[distCode];
                    if (extraBits === -1) {
                        throw new FormatError('Invalid data');
                    }
                    this._dist = Inflate.DistBaseValTbl[distCode] + this.getBits(extraBits);
                    if (this._dist > this._window.available()) {
                        throw new FormatError('Invalid data');
                    }
                    this._state = this._dist === 1 ? InflateState.DistOne : InflateState.Dist;
                    return true;
                }
        }
        return false;
    }
    addDistOne(n) {
        let c = this._window.getLastChar();
        for (let i = 0; i < n; i++) {
            this.addByte(c);
        }
    }
    addByte(b) {
        this._window.addByte(b);
        this._output[this._outpos] = b;
        this._needed--;
        this._outpos++;
    }
    addDist(d, len) {
        this.addBytes(this._window.buffer, this._window.pos - d, len);
    }
    getBit() {
        if (this._nbits === 0) {
            this._nbits = 8;
            this._bits = this._input.readByte();
        }
        let b = (this._bits & 1) === 1;
        this._nbits--;
        this._bits = this._bits >> 1;
        return b;
    }
    getBits(n) {
        while (this._nbits < n) {
            this._bits = this._bits | (this._input.readByte() << this._nbits);
            this._nbits += 8;
        }
        let b = this._bits & ((1 << n) - 1);
        this._nbits -= n;
        this._bits = this._bits >> n;
        return b;
    }
    getRevBits(n) {
        return n === 0 ? 0 : this.getBit() ? (1 << (n - 1)) | this.getRevBits(n - 1) : this.getRevBits(n - 1);
    }
    resetBits() {
        this._bits = 0;
        this._nbits = 0;
    }
    addBytes(b, p, len) {
        this._window.addBytes(b, p, len);
        this._output.set(b.subarray(p, p + len), this._outpos);
        this._needed -= len;
        this._outpos += len;
    }
    inflateLengths(a, max) {
        let i = 0;
        let prev = 0;
        while (i < max) {
            let n = this.applyHuffman(this._huffman);
            switch (n) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    prev = n;
                    a[i] = n;
                    i++;
                    break;
                case 16:
                    let end = i + 3 + this.getBits(2);
                    if (end > max) {
                        throw new FormatError('Invalid data');
                    }
                    while (i < end) {
                        a[i] = prev;
                        i++;
                    }
                    break;
                case 17:
                    i += 3 + this.getBits(3);
                    if (i > max) {
                        throw new FormatError('Invalid data');
                    }
                    break;
                case 18:
                    i += 11 + this.getBits(7);
                    if (i > max) {
                        throw new FormatError('Invalid data');
                    }
                    break;
                default: {
                    throw new FormatError('Invalid data');
                }
            }
        }
    }
    applyHuffman(h) {
        if (h instanceof HuffmanFound) {
            return h.n;
        }
        if (h instanceof HuffmanNeedBit) {
            return this.applyHuffman(this.getBit() ? h.right : h.left);
        }
        if (h instanceof HuffmanNeedBits) {
            return this.applyHuffman(h.table[this.getBits(h.n)]);
        }
        throw new FormatError('Invalid data');
    }
}
// prettier-ignore
Inflate.LenExtraBitsTbl = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, -1,
    -1
];
// prettier-ignore
Inflate.LenBaseValTbl = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115,
    131, 163, 195, 227, 258
];
// prettier-ignore
Inflate.DistExtraBitsTbl = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
    13, 13, -1, -1
];
// prettier-ignore
Inflate.DistBaseValTbl = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
    2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577
];
// prettier-ignore
Inflate.CodeLengthsPos = [
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
];
Inflate._fixedHuffman = Inflate.buildFixedHuffman();
//# sourceMappingURL=Inflate.js.map
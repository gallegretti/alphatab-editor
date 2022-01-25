// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { IOHelper } from '@src/io/IOHelper';
export class RiffChunk {
    constructor() {
        this.id = '';
        this.size = 0;
    }
    static load(parent, chunk, stream) {
        if (parent && RiffChunk.HeaderSize > parent.size) {
            return false;
        }
        if (stream.position + RiffChunk.HeaderSize >= stream.length) {
            return false;
        }
        chunk.id = IOHelper.read8BitStringLength(stream, 4);
        if (chunk.id.charCodeAt(0) <= 32 || chunk.id.charCodeAt(0) >= 122) {
            return false;
        }
        chunk.size = IOHelper.readUInt32LE(stream);
        if (parent && RiffChunk.HeaderSize + chunk.size > parent.size) {
            return false;
        }
        if (parent) {
            parent.size -= RiffChunk.HeaderSize + chunk.size;
        }
        let isRiff = chunk.id === 'RIFF';
        let isList = chunk.id === 'LIST';
        if (isRiff && parent) {
            // not allowed
            return false;
        }
        if (!isRiff && !isList) {
            // custom type without sub type
            return true;
        }
        // for lists unwrap the list type
        chunk.id = IOHelper.read8BitStringLength(stream, 4);
        if (chunk.id.charCodeAt(0) <= 32 || chunk.id.charCodeAt(0) >= 122) {
            return false;
        }
        chunk.size -= 4;
        return true;
    }
}
RiffChunk.HeaderSize = 4 /*FourCC*/ + 4 /*Size*/;
//# sourceMappingURL=RiffChunk.js.map
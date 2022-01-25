import { TypeConversions } from '@src/io/TypeConversions';
export class IOHelper {
    static readInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
    }
    static readInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static decodeUInt32LE(data, index) {
        let ch1 = data[index];
        let ch2 = data[index + 1];
        let ch3 = data[index + 2];
        let ch4 = data[index + 3];
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToUint16((ch2 << 8) | ch1);
    }
    static readInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch2 << 8) | ch1);
    }
    static readUInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return TypeConversions.int32ToUint32((ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4);
    }
    static readUInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readByteArray(input, length) {
        let v = new Uint8Array(length);
        input.read(v, 0, length);
        return v;
    }
    static read8BitChars(input, length) {
        let b = new Uint8Array(length);
        input.read(b, 0, b.length);
        return IOHelper.toString(b, 'utf-8');
    }
    static read8BitString(input) {
        let s = '';
        let c = input.readByte();
        while (c !== 0) {
            s += String.fromCharCode(c);
            c = input.readByte();
        }
        return s;
    }
    static read8BitStringLength(input, length) {
        let s = '';
        let z = -1;
        for (let i = 0; i < length; i++) {
            let c = input.readByte();
            if (c === 0 && z === -1) {
                z = i;
            }
            s += String.fromCharCode(c);
        }
        let t = s;
        if (z >= 0) {
            return t.substr(0, z);
        }
        return t;
    }
    static readSInt8(input) {
        let v = input.readByte();
        return ((v & 255) >> 7) * -256 + (v & 255);
    }
    static readInt24(input, index) {
        let i = input[index] | (input[index + 1] << 8) | (input[index + 2] << 16);
        if ((i & 0x800000) === 0x800000) {
            i = i | (0xff << 24);
        }
        return i;
    }
    static readInt16(input, index) {
        return TypeConversions.int32ToInt16(input[index] | (input[index + 1] << 8));
    }
    static toString(data, encoding) {
        let detectedEncoding = IOHelper.detectEncoding(data);
        if (detectedEncoding) {
            encoding = detectedEncoding;
        }
        if (!encoding) {
            encoding = 'utf-8';
        }
        let decoder = new TextDecoder(encoding);
        return decoder.decode(data.buffer);
    }
    static detectEncoding(data) {
        if (data.length > 2 && data[0] === 0xfe && data[1] === 0xff) {
            return 'utf-16be';
        }
        if (data.length > 2 && data[0] === 0xff && data[1] === 0xfe) {
            return 'utf-16le';
        }
        if (data.length > 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0xfe && data[3] === 0xff) {
            return 'utf-32be';
        }
        if (data.length > 4 && data[0] === 0xff && data[1] === 0xfe && data[2] === 0x00 && data[3] === 0x00) {
            return 'utf-32le';
        }
        return null;
    }
    static stringToBytes(str) {
        let decoder = new TextEncoder();
        return decoder.encode(str);
    }
    static writeInt32BE(o, v) {
        o.writeByte((v >> 24) & 0xFF);
        o.writeByte((v >> 16) & 0xFF);
        o.writeByte((v >> 8) & 0xFF);
        o.writeByte((v >> 0) & 0xFF);
    }
    static writeInt32LE(o, v) {
        o.writeByte((v >> 0) & 0xFF);
        o.writeByte((v >> 8) & 0xFF);
        o.writeByte((v >> 16) & 0xFF);
        o.writeByte((v >> 24) & 0xFF);
    }
    static writeUInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xFF);
        o.writeByte((v >> 8) & 0xFF);
    }
    static writeInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xFF);
        o.writeByte((v >> 8) & 0xFF);
    }
}
//# sourceMappingURL=IOHelper.js.map
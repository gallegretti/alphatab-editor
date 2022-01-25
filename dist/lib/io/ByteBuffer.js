import { IOHelper } from './IOHelper';
export class ByteBuffer {
    constructor() {
        this._capacity = 0;
        this.length = 0;
        this.position = 0;
    }
    get bytesWritten() {
        return this.position;
    }
    getBuffer() {
        return this._buffer;
    }
    static empty() {
        return ByteBuffer.withCapacity(0);
    }
    static withCapacity(capacity) {
        let buffer = new ByteBuffer();
        buffer._buffer = new Uint8Array(capacity);
        buffer._capacity = capacity;
        return buffer;
    }
    static fromBuffer(data) {
        let buffer = new ByteBuffer();
        buffer._buffer = data;
        buffer.length = data.length;
        buffer._capacity = buffer.length;
        return buffer;
    }
    static fromString(contents) {
        let byteArray = IOHelper.stringToBytes(contents);
        return ByteBuffer.fromBuffer(byteArray);
    }
    reset() {
        this.position = 0;
    }
    skip(offset) {
        this.position += offset;
    }
    setCapacity(value) {
        if (value !== this._capacity) {
            if (value > 0) {
                let newBuffer = new Uint8Array(value);
                if (this.length > 0) {
                    newBuffer.set(this._buffer.subarray(0, 0 + this.length), 0);
                }
                this._buffer = newBuffer;
            }
            this._capacity = value;
        }
    }
    readByte() {
        let n = this.length - this.position;
        if (n <= 0) {
            return -1;
        }
        return this._buffer[this.position++];
    }
    read(buffer, offset, count) {
        let n = this.length - this.position;
        if (n > count) {
            n = count;
        }
        if (n <= 0) {
            return 0;
        }
        if (n <= 8) {
            let byteCount = n;
            while (--byteCount >= 0) {
                buffer[offset + byteCount] = this._buffer[this.position + byteCount];
            }
        }
        else {
            buffer.set(this._buffer.subarray(this.position, this.position + n), offset);
        }
        this.position += n;
        return n;
    }
    writeByte(value) {
        let buffer = new Uint8Array(1);
        buffer[0] = value;
        this.write(buffer, 0, 1);
    }
    write(buffer, offset, count) {
        let i = this.position + count;
        if (i > this.length) {
            if (i > this._capacity) {
                this.ensureCapacity(i);
            }
            this.length = i;
        }
        if (count <= 8 && buffer !== this._buffer) {
            let byteCount = count;
            while (--byteCount >= 0) {
                this._buffer[this.position + byteCount] = buffer[offset + byteCount];
            }
        }
        else {
            let count1 = Math.min(count, buffer.length - offset);
            this._buffer.set(buffer.subarray(offset, offset + count1), this.position);
        }
        this.position = i;
    }
    ensureCapacity(value) {
        if (value > this._capacity) {
            let newCapacity = value;
            if (newCapacity < 256) {
                newCapacity = 256;
            }
            if (newCapacity < this._capacity * 2) {
                newCapacity = this._capacity * 2;
            }
            this.setCapacity(newCapacity);
        }
    }
    readAll() {
        return this.toArray();
    }
    toArray() {
        let copy = new Uint8Array(this.length);
        copy.set(this._buffer.subarray(0, 0 + this.length), 0);
        return copy;
    }
}
//# sourceMappingURL=ByteBuffer.js.map
// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { RiffChunk } from '@src/synth/soundfont/RiffChunk';
import { IOHelper } from '@src/io/IOHelper';
import { TypeConversions } from '@src/io/TypeConversions';
import { FormatError } from '@src/FormatError';
export class Hydra {
    constructor() {
        this.phdrs = [];
        this.pbags = [];
        this.pmods = [];
        this.pgens = [];
        this.insts = [];
        this.ibags = [];
        this.imods = [];
        this.igens = [];
        this.sHdrs = [];
        this.fontSamples = new Float32Array(0);
    }
    load(readable) {
        const chunkHead = new RiffChunk();
        const chunkFastList = new RiffChunk();
        if (!RiffChunk.load(null, chunkHead, readable) || chunkHead.id !== 'sfbk') {
            throw new FormatError("Soundfont is not a valid Soundfont2 file");
        }
        while (RiffChunk.load(chunkHead, chunkFastList, readable)) {
            let chunk = new RiffChunk();
            if (chunkFastList.id === 'pdta') {
                while (RiffChunk.load(chunkFastList, chunk, readable)) {
                    switch (chunk.id) {
                        case 'phdr':
                            for (let i = 0, count = (chunk.size / HydraPhdr.SizeInFile) | 0; i < count; i++) {
                                this.phdrs.push(new HydraPhdr(readable));
                            }
                            break;
                        case 'pbag':
                            for (let i = 0, count = (chunk.size / HydraPbag.SizeInFile) | 0; i < count; i++) {
                                this.pbags.push(new HydraPbag(readable));
                            }
                            break;
                        case 'pmod':
                            for (let i = 0, count = (chunk.size / HydraPmod.SizeInFile) | 0; i < count; i++) {
                                this.pmods.push(new HydraPmod(readable));
                            }
                            break;
                        case 'pgen':
                            for (let i = 0, count = (chunk.size / HydraPgen.SizeInFile) | 0; i < count; i++) {
                                this.pgens.push(new HydraPgen(readable));
                            }
                            break;
                        case 'inst':
                            for (let i = 0, count = (chunk.size / HydraInst.SizeInFile) | 0; i < count; i++) {
                                this.insts.push(new HydraInst(readable));
                            }
                            break;
                        case 'ibag':
                            for (let i = 0, count = (chunk.size / HydraIbag.SizeInFile) | 0; i < count; i++) {
                                this.ibags.push(new HydraIbag(readable));
                            }
                            break;
                        case 'imod':
                            for (let i = 0, count = (chunk.size / HydraImod.SizeInFile) | 0; i < count; i++) {
                                this.imods.push(new HydraImod(readable));
                            }
                            break;
                        case 'igen':
                            for (let i = 0, count = (chunk.size / HydraIgen.SizeInFile) | 0; i < count; i++) {
                                this.igens.push(new HydraIgen(readable));
                            }
                            break;
                        case 'shdr':
                            for (let i = 0, count = (chunk.size / HydraShdr.SizeInFile) | 0; i < count; i++) {
                                this.sHdrs.push(new HydraShdr(readable));
                            }
                            break;
                        default:
                            readable.position += chunk.size;
                            break;
                    }
                }
            }
            else if (chunkFastList.id === 'sdta') {
                while (RiffChunk.load(chunkFastList, chunk, readable)) {
                    switch (chunk.id) {
                        case 'smpl':
                            this.fontSamples = Hydra.loadSamples(chunk, readable);
                            break;
                        default:
                            readable.position += chunk.size;
                            break;
                    }
                }
            }
            else {
                readable.position += chunkFastList.size;
            }
        }
    }
    static loadSamples(chunk, reader) {
        let samplesLeft = (chunk.size / 2) | 0;
        const samples = new Float32Array(samplesLeft);
        let samplesPos = 0;
        const sampleBuffer = new Uint8Array(2048);
        const testBuffer = new Int16Array((sampleBuffer.length / 2) | 0);
        while (samplesLeft > 0) {
            let samplesToRead = Math.min(samplesLeft, (sampleBuffer.length / 2) | 0);
            reader.read(sampleBuffer, 0, samplesToRead * 2);
            for (let i = 0; i < samplesToRead; i++) {
                testBuffer[i] = (sampleBuffer[i * 2 + 1] << 8) | sampleBuffer[i * 2];
                samples[samplesPos + i] = testBuffer[i] / 32767;
            }
            samplesLeft -= samplesToRead;
            samplesPos += samplesToRead;
        }
        return samples;
    }
}
export class HydraIbag {
    constructor(reader) {
        this.instGenNdx = IOHelper.readUInt16LE(reader);
        this.instModNdx = IOHelper.readUInt16LE(reader);
    }
}
HydraIbag.SizeInFile = 4;
export class HydraImod {
    constructor(reader) {
        this.modSrcOper = IOHelper.readUInt16LE(reader);
        this.modDestOper = IOHelper.readUInt16LE(reader);
        this.modAmount = IOHelper.readInt16LE(reader);
        this.modAmtSrcOper = IOHelper.readUInt16LE(reader);
        this.modTransOper = IOHelper.readUInt16LE(reader);
    }
}
HydraImod.SizeInFile = 10;
export class HydraIgen {
    constructor(reader) {
        this.genOper = IOHelper.readUInt16LE(reader);
        this.genAmount = new HydraGenAmount(reader);
    }
}
HydraIgen.SizeInFile = 4;
export class HydraInst {
    constructor(reader) {
        this.instName = IOHelper.read8BitStringLength(reader, 20);
        this.instBagNdx = IOHelper.readUInt16LE(reader);
    }
}
HydraInst.SizeInFile = 22;
export class HydraPbag {
    constructor(reader) {
        this.genNdx = IOHelper.readUInt16LE(reader);
        this.modNdx = IOHelper.readUInt16LE(reader);
    }
}
HydraPbag.SizeInFile = 4;
export class HydraPgen {
    constructor(reader) {
        this.genOper = IOHelper.readUInt16LE(reader);
        this.genAmount = new HydraGenAmount(reader);
    }
}
HydraPgen.SizeInFile = 4;
HydraPgen.GenInstrument = 41;
HydraPgen.GenKeyRange = 43;
HydraPgen.GenVelRange = 44;
HydraPgen.GenSampleId = 53;
export class HydraPhdr {
    constructor(reader) {
        this.presetName = IOHelper.read8BitStringLength(reader, 20);
        this.preset = IOHelper.readUInt16LE(reader);
        this.bank = IOHelper.readUInt16LE(reader);
        this.presetBagNdx = IOHelper.readUInt16LE(reader);
        this.library = IOHelper.readUInt32LE(reader);
        this.genre = IOHelper.readUInt32LE(reader);
        this.morphology = IOHelper.readUInt32LE(reader);
    }
}
HydraPhdr.SizeInFile = 38;
export class HydraPmod {
    constructor(reader) {
        this.modSrcOper = IOHelper.readUInt16LE(reader);
        this.modDestOper = IOHelper.readUInt16LE(reader);
        this.modAmount = IOHelper.readUInt16LE(reader);
        this.modAmtSrcOper = IOHelper.readUInt16LE(reader);
        this.modTransOper = IOHelper.readUInt16LE(reader);
    }
}
HydraPmod.SizeInFile = 10;
export class HydraShdr {
    constructor(reader) {
        this.sampleName = IOHelper.read8BitStringLength(reader, 20);
        this.start = IOHelper.readUInt32LE(reader);
        this.end = IOHelper.readUInt32LE(reader);
        this.startLoop = IOHelper.readUInt32LE(reader);
        this.endLoop = IOHelper.readUInt32LE(reader);
        this.sampleRate = IOHelper.readUInt32LE(reader);
        this.originalPitch = reader.readByte();
        this.pitchCorrection = IOHelper.readSInt8(reader);
        this.sampleLink = IOHelper.readUInt16LE(reader);
        this.sampleType = IOHelper.readUInt16LE(reader);
    }
}
HydraShdr.SizeInFile = 46;
export class HydraGenAmount {
    constructor(reader) {
        this.wordAmount = IOHelper.readUInt16LE(reader);
    }
    get shortAmount() {
        return TypeConversions.uint16ToInt16(this.wordAmount);
    }
    get lowByteAmount() {
        return this.wordAmount & 0x00ff;
    }
    get highByteAmount() {
        return ((this.wordAmount & 0xff00) >> 8) & 0xff;
    }
}
//# sourceMappingURL=Hydra.js.map
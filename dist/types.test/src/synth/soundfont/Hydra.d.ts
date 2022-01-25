import { IReadable } from '@src/io/IReadable';
export declare class Hydra {
    phdrs: HydraPhdr[];
    pbags: HydraPbag[];
    pmods: HydraPmod[];
    pgens: HydraPgen[];
    insts: HydraInst[];
    ibags: HydraIbag[];
    imods: HydraImod[];
    igens: HydraIgen[];
    sHdrs: HydraShdr[];
    fontSamples: Float32Array;
    load(readable: IReadable): void;
    private static loadSamples;
}
export declare class HydraIbag {
    static readonly SizeInFile: number;
    instGenNdx: number;
    instModNdx: number;
    constructor(reader: IReadable);
}
export declare class HydraImod {
    static readonly SizeInFile: number;
    modSrcOper: number;
    modDestOper: number;
    modAmount: number;
    modAmtSrcOper: number;
    modTransOper: number;
    constructor(reader: IReadable);
}
export declare class HydraIgen {
    static readonly SizeInFile: number;
    genOper: number;
    genAmount: HydraGenAmount;
    constructor(reader: IReadable);
}
export declare class HydraInst {
    static readonly SizeInFile: number;
    instName: string;
    instBagNdx: number;
    constructor(reader: IReadable);
}
export declare class HydraPbag {
    static readonly SizeInFile: number;
    genNdx: number;
    modNdx: number;
    constructor(reader: IReadable);
}
export declare class HydraPgen {
    static readonly SizeInFile: number;
    static readonly GenInstrument: number;
    static readonly GenKeyRange: number;
    static readonly GenVelRange: number;
    static readonly GenSampleId: number;
    genOper: number;
    genAmount: HydraGenAmount;
    constructor(reader: IReadable);
}
export declare class HydraPhdr {
    static readonly SizeInFile: number;
    presetName: string;
    preset: number;
    bank: number;
    presetBagNdx: number;
    library: number;
    genre: number;
    morphology: number;
    constructor(reader: IReadable);
}
export declare class HydraPmod {
    static readonly SizeInFile: number;
    modSrcOper: number;
    modDestOper: number;
    modAmount: number;
    modAmtSrcOper: number;
    modTransOper: number;
    constructor(reader: IReadable);
}
export declare class HydraShdr {
    static readonly SizeInFile: number;
    sampleName: string;
    start: number;
    end: number;
    startLoop: number;
    endLoop: number;
    sampleRate: number;
    originalPitch: number;
    pitchCorrection: number;
    sampleLink: number;
    sampleType: number;
    constructor(reader: IReadable);
}
export declare class HydraGenAmount {
    wordAmount: number;
    get shortAmount(): number;
    get lowByteAmount(): number;
    get highByteAmount(): number;
    constructor(reader: IReadable);
}

export declare class VoiceLowPass {
    qInv: number;
    a0: number;
    a1: number;
    b1: number;
    b2: number;
    z1: number;
    z2: number;
    active: boolean;
    constructor(other?: VoiceLowPass);
    setup(fc: number): void;
    process(input: number): number;
}

import { Region } from '@src/synth/synthesis/Region';
export declare class Preset {
    name: string;
    presetNumber: number;
    bank: number;
    regions: Region[] | null;
    fontSamples: Float32Array | null;
}

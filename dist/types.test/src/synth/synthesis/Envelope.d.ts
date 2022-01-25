export declare class Envelope {
    delay: number;
    attack: number;
    hold: number;
    decay: number;
    sustain: number;
    release: number;
    keynumToHold: number;
    keynumToDecay: number;
    constructor(other?: Envelope);
    clear(): void;
    envToSecs(sustainIsGain: boolean): void;
}

export declare class Channel {
    presetIndex: number;
    bank: number;
    pitchWheel: number;
    perNotePitchWheel: Map<number, number>;
    midiPan: number;
    midiVolume: number;
    midiExpression: number;
    midiRpn: number;
    midiData: number;
    panOffset: number;
    gainDb: number;
    pitchRange: number;
    tuning: number;
    mixVolume: number;
    mute: boolean;
    solo: boolean;
}

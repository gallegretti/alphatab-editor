import { SystemCommonEvent } from '@src/midi/SystemCommonEvent';
import { IWriteable } from '@src/io/IWriteable';
export declare enum AlphaTabSystemExclusiveEvents {
    MetronomeTick = 0,
    Rest = 1
}
export declare class SystemExclusiveEvent extends SystemCommonEvent {
    static readonly AlphaTabManufacturerId = 125;
    data: Uint8Array;
    get isMetronome(): boolean;
    get metronomeNumerator(): number;
    get metronomeDurationInTicks(): number;
    get metronomeDurationInMilliseconds(): number;
    get isRest(): boolean;
    get manufacturerId(): number;
    constructor(track: number, delta: number, status: number, id: number, data: Uint8Array);
    writeTo(s: IWriteable): void;
    static encodeMetronome(counter: number, durationInTicks: number, durationInMillis: number): Uint8Array;
}

import { MetaEvent } from '@src/midi/MetaEvent';
import { IWriteable } from '@src/io/IWriteable';
export declare class MetaNumberEvent extends MetaEvent {
    value: number;
    constructor(track: number, delta: number, status: number, metaId: number, value: number);
    writeTo(s: IWriteable): void;
}

import { MetaEvent } from '@src/midi/MetaEvent';
import { IWriteable } from '@src/io/IWriteable';
export declare class MetaDataEvent extends MetaEvent {
    data: Uint8Array;
    constructor(track: number, delta: number, status: number, metaId: number, data: Uint8Array);
    writeTo(s: IWriteable): void;
}

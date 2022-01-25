import { Score } from '@src/model/Score';
export declare class MidiPlaybackController {
    private _score;
    private _repeatStartIndex;
    private _repeatNumber;
    private _repeatOpen;
    shouldPlay: boolean;
    index: number;
    currentTick: number;
    get finished(): boolean;
    constructor(score: Score);
    processCurrent(): void;
    moveNext(): void;
}

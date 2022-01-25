import { PlayerStateChangedEventArgs } from '@src/synth/PlayerStateChangedEventArgs';
import { PositionChangedEventArgs } from '@src/synth/PositionChangedEventArgs';
import { IWorkerScope } from '@src/platform/javascript/IWorkerScope';
import { MidiEventsPlayedEventArgs } from '@src/synth/MidiEventsPlayedEventArgs';
/**
 * This class implements a HTML5 WebWorker based version of alphaSynth
 * which can be controlled via WebWorker messages.
 * @target web
 */
export declare class AlphaSynthWebWorker {
    private _player;
    private _main;
    constructor(main: IWorkerScope);
    static init(): void;
    handleMessage(e: MessageEvent): void;
    onPositionChanged(e: PositionChangedEventArgs): void;
    onPlayerStateChanged(e: PlayerStateChangedEventArgs): void;
    onFinished(): void;
    onSoundFontLoaded(): void;
    onSoundFontLoadFailed(e: any): void;
    private serializeException;
    onMidiLoaded(e: PositionChangedEventArgs): void;
    onMidiLoadFailed(e: any): void;
    onReadyForPlayback(): void;
    onMidiEventsPlayed(args: MidiEventsPlayedEventArgs): void;
}

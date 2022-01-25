import { Channel } from '@src/synth/synthesis/Channel';
import { TinySoundFont } from '@src/synth/synthesis/TinySoundFont';
import { Voice } from '@src/synth/synthesis/Voice';
export declare class Channels {
    activeChannel: number;
    channelList: Channel[];
    setupVoice(tinySoundFont: TinySoundFont, voice: Voice): void;
}

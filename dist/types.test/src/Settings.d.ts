import { CoreSettings } from '@src/CoreSettings';
import { DisplaySettings } from '@src/DisplaySettings';
import { ImporterSettings } from '@src/ImporterSettings';
import { NotationSettings } from '@src/NotationSettings';
import { PlayerSettings } from '@src/PlayerSettings';
/**
 * This public class contains instance specific settings for alphaTab
 * @json
 */
export declare class Settings {
    /**
     * The core settings control the general behavior of alphatab like
     * what modules are active.
     * @json_on_parent
     * @json_partial_names
     */
    readonly core: CoreSettings;
    /**
     * The display settings control how the general layout and display of alphaTab is done.
     * @json_on_parent
     * @json_partial_names
     */
    readonly display: DisplaySettings;
    /**
     * The notation settings control how various music notation elements are shown and behaving.
     * @json_partial_names
     */
    readonly notation: NotationSettings;
    /**
     * All settings related to importers that decode file formats.
     * @json_partial_names
     */
    readonly importer: ImporterSettings;
    /**
     * Contains all player related settings
     * @json_partial_names
     */
    player: PlayerSettings;
    setSongBookModeSettings(): void;
    static get songBook(): Settings;
    /**
     * @target web
     */
    fillFromJson(json: any): void;
}

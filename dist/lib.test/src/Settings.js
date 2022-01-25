import { CoreSettings } from '@src/CoreSettings';
import { DisplaySettings } from '@src/DisplaySettings';
import { ImporterSettings } from '@src/ImporterSettings';
import { FingeringMode, NotationMode, NotationSettings, NotationElement } from '@src/NotationSettings';
import { PlayerSettings } from '@src/PlayerSettings';
import { SettingsSerializer } from '@src/generated/SettingsSerializer';
/**
 * This public class contains instance specific settings for alphaTab
 * @json
 */
export class Settings {
    constructor() {
        /**
         * The core settings control the general behavior of alphatab like
         * what modules are active.
         * @json_on_parent
         * @json_partial_names
         */
        this.core = new CoreSettings();
        /**
         * The display settings control how the general layout and display of alphaTab is done.
         * @json_on_parent
         * @json_partial_names
         */
        this.display = new DisplaySettings();
        /**
         * The notation settings control how various music notation elements are shown and behaving.
         * @json_partial_names
         */
        this.notation = new NotationSettings();
        /**
         * All settings related to importers that decode file formats.
         * @json_partial_names
         */
        this.importer = new ImporterSettings();
        /**
         * Contains all player related settings
         * @json_partial_names
         */
        this.player = new PlayerSettings();
    }
    setSongBookModeSettings() {
        this.notation.notationMode = NotationMode.SongBook;
        this.notation.smallGraceTabNotes = false;
        this.notation.fingeringMode = FingeringMode.SingleNoteEffectBand;
        this.notation.extendBendArrowsOnTiedNotes = false;
        this.notation.elements.set(NotationElement.ParenthesisOnTiedBends, false);
        this.notation.elements.set(NotationElement.TabNotesOnTiedBends, false);
        this.notation.elements.set(NotationElement.ZerosOnDiveWhammys, true);
    }
    static get songBook() {
        let settings = new Settings();
        settings.setSongBookModeSettings();
        return settings;
    }
    /**
     * @target web
     */
    fillFromJson(json) {
        SettingsSerializer.fromJson(this, json);
    }
}
//# sourceMappingURL=Settings.js.map
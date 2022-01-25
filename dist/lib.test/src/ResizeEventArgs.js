import { CoreSettings } from '@src/CoreSettings';
/**
 * Represents the information related to a resize event.
 */
export class ResizeEventArgs {
    constructor() {
        /**
         * Gets the size before the resizing happened.
         */
        this.oldWidth = 0;
        /**
         * Gets the size after the resize was complete.
         */
        this.newWidth = 0;
        /**
         * Gets the settings currently used for rendering.
         */
        this.settings = null;
    }
    core() {
        if (this.settings && this.causeIssue()) {
            return this.settings.core;
        }
        return new CoreSettings();
    }
    causeIssue() {
        this.settings = null;
        return true;
    }
}
//# sourceMappingURL=ResizeEventArgs.js.map
/**
 * This public class can store the information about a group of measures which are repeated
 */
export class RepeatGroup {
    constructor() {
        /**
         * All masterbars repeated within this group
         */
        this.masterBars = [];
        /**
         * a list of masterbars which open the group.
         */
        this.openings = [];
        /**
         * a list of masterbars which close the group.
         */
        this.closings = [];
        /**
         * true if the repeat group was opened well
         */
        this.isOpened = false;
        /**
         * true if the repeat group was closed well
         */
        this.isClosed = false;
    }
    addMasterBar(masterBar) {
        if (this.openings.length === 0) {
            this.openings.push(masterBar);
        }
        this.masterBars.push(masterBar);
        masterBar.repeatGroup = this;
        if (masterBar.isRepeatEnd) {
            this.closings.push(masterBar);
            this.isClosed = true;
            if (!this.isOpened) {
                this.masterBars[0].isRepeatStart = true;
                this.isOpened = true;
            }
        }
        else if (this.isClosed) {
            this.isClosed = false;
            this.openings.push(masterBar);
        }
    }
}
//# sourceMappingURL=RepeatGroup.js.map
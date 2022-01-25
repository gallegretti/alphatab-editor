export class MidiPlaybackController {
    constructor(score) {
        this._repeatStartIndex = 0;
        this._repeatNumber = 0;
        this._repeatOpen = false;
        this.shouldPlay = true;
        this.index = 0;
        this.currentTick = 0;
        this._score = score;
    }
    get finished() {
        return this.index >= this._score.masterBars.length;
    }
    processCurrent() {
        const masterBar = this._score.masterBars[this.index];
        const masterBarAlternateEndings = masterBar.alternateEndings;
        // if the repeat group wasn't closed we reset the repeating
        // on the last group opening
        if (!masterBar.repeatGroup.isClosed &&
            masterBar.repeatGroup.openings[masterBar.repeatGroup.openings.length - 1] === masterBar) {
            this._repeatNumber = 0;
            this._repeatOpen = false;
        }
        if ((masterBar.isRepeatStart || masterBar.index === 0) && this._repeatNumber === 0) {
            this._repeatStartIndex = this.index;
            this._repeatOpen = true;
        }
        else if (masterBar.isRepeatStart) {
            this.shouldPlay = true;
        }
        // if we encounter an alternate ending
        if (this._repeatOpen && masterBarAlternateEndings > 0) {
            // do we need to skip this section?
            if ((masterBarAlternateEndings & (1 << this._repeatNumber)) === 0) {
                this.shouldPlay = false;
            }
            else {
                this.shouldPlay = true;
            }
        }
        if (this.shouldPlay) {
            this.currentTick += masterBar.calculateDuration();
        }
    }
    moveNext() {
        const masterBar = this._score.masterBars[this.index];
        const masterBarRepeatCount = masterBar.repeatCount - 1;
        // if we encounter a repeat end
        if (this._repeatOpen && masterBarRepeatCount > 0) {
            // more repeats required?
            if (this._repeatNumber < masterBarRepeatCount) {
                // jump to start
                this.index = this._repeatStartIndex;
                this._repeatNumber++;
            }
            else {
                // no repeats anymore, jump after repeat end
                this._repeatNumber = 0;
                this._repeatOpen = false;
                this.shouldPlay = true;
                this.index++;
            }
        }
        else {
            this.index++;
        }
    }
}
//# sourceMappingURL=MidiPlaybackController.js.map
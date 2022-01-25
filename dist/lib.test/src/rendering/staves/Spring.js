export class Spring {
    constructor() {
        this.timePosition = 0;
        this.longestDuration = 0;
        this.smallestDuration = 0;
        this.force = 0;
        this.springConstant = 0;
        this.preBeatWidth = 0;
        this.graceBeatWidth = 0;
        this.postSpringWidth = 0;
        this.allDurations = new Set();
    }
    get springWidth() {
        return this.preSpringWidth + this.postSpringWidth;
    }
    get preSpringWidth() {
        return this.preBeatWidth + this.graceBeatWidth;
    }
}
//# sourceMappingURL=Spring.js.map
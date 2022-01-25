export declare class Spring {
    timePosition: number;
    longestDuration: number;
    smallestDuration: number;
    force: number;
    springConstant: number;
    get springWidth(): number;
    preBeatWidth: number;
    graceBeatWidth: number;
    postSpringWidth: number;
    get preSpringWidth(): number;
    allDurations: Set<number>;
}

import { Beat } from "@src/model/Beat";
export declare class ReservedLayoutAreaSlot {
    topY: number;
    bottomY: number;
    constructor(topY: number, bottomY: number);
}
export declare class ReservedLayoutArea {
    beat: Beat;
    topY: number;
    bottomY: number;
    slots: ReservedLayoutAreaSlot[];
    constructor(beat: Beat);
    addSlot(topY: number, bottomY: number): void;
}
export declare class BarCollisionHelper {
    reservedLayoutAreasByDisplayTime: Map<number, ReservedLayoutArea>;
    restDurationsByDisplayTime: Map<number, Map<number, number>>;
    getBeatMinMaxY(): number[];
    reserveBeatSlot(beat: Beat, topY: number, bottomY: number): void;
    registerRest(beat: Beat): void;
    applyRestCollisionOffset(beat: Beat, currentY: number, linesToPixel: number): number;
}

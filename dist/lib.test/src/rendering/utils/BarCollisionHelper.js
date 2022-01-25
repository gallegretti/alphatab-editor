import { BeamingHelper } from "./BeamingHelper";
export class ReservedLayoutAreaSlot {
    constructor(topY, bottomY) {
        this.topY = 0;
        this.bottomY = 0;
        this.topY = topY;
        this.bottomY = bottomY;
    }
}
export class ReservedLayoutArea {
    constructor(beat) {
        this.topY = -1000;
        this.bottomY = -1000;
        this.slots = [];
        this.beat = beat;
    }
    addSlot(topY, bottomY) {
        this.slots.push(new ReservedLayoutAreaSlot(topY, bottomY));
        if (this.topY === -1000) {
            this.topY = topY;
            this.bottomY = bottomY;
        }
        else {
            const min = Math.min(topY, bottomY);
            const max = Math.max(topY, bottomY);
            if (min < this.topY) {
                this.topY = min;
            }
            if (max > this.bottomY) {
                this.bottomY = max;
            }
        }
    }
}
export class BarCollisionHelper {
    constructor() {
        this.reservedLayoutAreasByDisplayTime = new Map();
        this.restDurationsByDisplayTime = new Map();
    }
    getBeatMinMaxY() {
        let minY = -1000;
        let maxY = -1000;
        for (const v of this.reservedLayoutAreasByDisplayTime.values()) {
            if (minY === -1000) {
                minY = v.topY;
                maxY = v.bottomY;
            }
            else {
                if (minY > v.topY) {
                    minY = v.topY;
                }
                if (maxY < v.bottomY) {
                    maxY = v.bottomY;
                }
            }
        }
        if (minY === -1000) {
            return [0, 0];
        }
        return [minY, maxY];
    }
    reserveBeatSlot(beat, topY, bottomY) {
        if (topY == bottomY) {
            return;
        }
        if (!this.reservedLayoutAreasByDisplayTime.has(beat.displayStart)) {
            this.reservedLayoutAreasByDisplayTime.set(beat.displayStart, new ReservedLayoutArea(beat));
        }
        this.reservedLayoutAreasByDisplayTime.get(beat.displayStart).addSlot(topY, bottomY);
        if (beat.isRest) {
            this.registerRest(beat);
        }
    }
    registerRest(beat) {
        if (!this.restDurationsByDisplayTime.has(beat.displayStart)) {
            this.restDurationsByDisplayTime.set(beat.displayStart, new Map());
        }
        if (!this.restDurationsByDisplayTime.get(beat.displayStart).has(beat.playbackDuration)) {
            this.restDurationsByDisplayTime.get(beat.displayStart).set(beat.playbackDuration, beat.id);
        }
    }
    applyRestCollisionOffset(beat, currentY, linesToPixel) {
        // for the first voice we do not need collision detection on rests
        // we just place it normally
        if (beat.voice.index > 0) {
            // From the Spring-Rod poisitioning we have the guarantee
            // that 2 timewise subsequent elements can never collide 
            // on the horizontal axis. So we only need to check for collisions
            // of elements at the current time position
            // if there are none, we can just use the line
            if (this.reservedLayoutAreasByDisplayTime.has(beat.playbackStart)) {
                // do check for collisions we need to obtain the range on which the 
                // restglyph is placed
                // rest glyphs have their ancor 
                const restSizes = BeamingHelper.computeLineHeightsForRest(beat.duration).map(i => i * linesToPixel);
                let oldRestTopY = currentY - restSizes[0];
                let oldRestBottomY = currentY + restSizes[1];
                let newRestTopY = oldRestTopY;
                const reservedSlots = this.reservedLayoutAreasByDisplayTime.get(beat.playbackStart);
                let hasCollision = false;
                for (const slot of reservedSlots.slots) {
                    if ((oldRestTopY >= slot.topY && oldRestTopY <= slot.bottomY) ||
                        (oldRestBottomY >= slot.topY && oldRestBottomY <= slot.bottomY)) {
                        hasCollision = true;
                        break;
                    }
                }
                if (hasCollision) {
                    // second voice above, the others below
                    if (beat.voice.index == 1) {
                        // move rest above top position
                        // TODO: rest must align with note lines
                        newRestTopY = reservedSlots.topY - restSizes[1] - restSizes[0];
                    }
                    else {
                        // move rest above top position
                        // TODO: rest must align with note lines
                        newRestTopY = reservedSlots.bottomY;
                    }
                    let newRestBottomY = newRestTopY + restSizes[0] + restSizes[1];
                    // moving always happens in full stave spaces
                    const staveSpace = linesToPixel * 2;
                    let distanceInLines = Math.ceil(Math.abs(newRestTopY - oldRestTopY) / staveSpace);
                    // register new min/max offsets
                    reservedSlots.addSlot(newRestTopY, newRestBottomY);
                    if (newRestTopY < oldRestTopY) {
                        return distanceInLines * -staveSpace;
                    }
                    else {
                        return distanceInLines * staveSpace;
                    }
                }
            }
        }
        return 0;
    }
}
//# sourceMappingURL=BarCollisionHelper.js.map
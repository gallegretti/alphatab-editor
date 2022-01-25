import { MidiUtils } from '@src/midi/MidiUtils';
import { Duration } from '@src/model/Duration';
import { Spring } from '@src/rendering/staves/Spring';
import { ModelUtils } from '@src/model/ModelUtils';
import { GraceType } from '@src/model/GraceType';
/**
 * This public class stores size information about a stave.
 * It is used by the layout engine to collect the sizes of score parts
 * to align the parts across multiple staves.
 */
export class BarLayoutingInfo {
    constructor() {
        this._timeSortedSprings = [];
        this._xMin = 0;
        this._minTime = -1;
        this._onTimePositionsForce = 0;
        this._onTimePositions = new Map();
        this._incompleteGraceRodsWidth = 0;
        /**
         * an internal version number that increments whenever a change was made.
         */
        this.version = 0;
        this.preBeatSizes = new Map();
        this.onBeatSizes = new Map();
        this.onBeatCenterX = new Map();
        this.preBeatSize = 0;
        this.postBeatSize = 0;
        this.voiceSize = 0;
        this.minStretchForce = 0;
        this.totalSpringConstant = 0;
        this.incompleteGraceRods = new Map();
        this.allGraceRods = new Map();
        this.springs = new Map();
        this.height = 0;
    }
    updateVoiceSize(size) {
        if (size > this.voiceSize) {
            this.voiceSize = size;
            this.version++;
        }
    }
    setPreBeatSize(beat, size) {
        if (!this.preBeatSizes.has(beat.index) || this.preBeatSizes.get(beat.index) < size) {
            this.preBeatSizes.set(beat.index, size);
            this.version++;
        }
    }
    getPreBeatSize(beat) {
        if (this.preBeatSizes.has(beat.index)) {
            return this.preBeatSizes.get(beat.index);
        }
        return 0;
    }
    setOnBeatSize(beat, size) {
        if (!this.onBeatSizes.has(beat.index) || this.onBeatSizes.get(beat.index) < size) {
            this.onBeatSizes.set(beat.index, size);
            this.version++;
        }
    }
    getOnBeatSize(beat) {
        if (this.onBeatSizes.has(beat.index)) {
            return this.onBeatSizes.get(beat.index);
        }
        return 0;
    }
    getBeatCenterX(beat) {
        if (this.onBeatCenterX.has(beat.index)) {
            return this.onBeatCenterX.get(beat.index);
        }
        return 0;
    }
    setBeatCenterX(beat, x) {
        if (!this.onBeatCenterX.has(beat.index) || this.onBeatCenterX.get(beat.index) < x) {
            this.onBeatCenterX.set(beat.index, x);
            this.version++;
        }
    }
    updateMinStretchForce(force) {
        if (this.minStretchForce < force) {
            this.minStretchForce = force;
        }
    }
    addSpring(start, duration, graceBeatWidth, preBeatWidth, postSpringSize) {
        this.version++;
        let spring;
        if (!this.springs.has(start)) {
            spring = new Spring();
            spring.timePosition = start;
            spring.allDurations.add(duration);
            // check in the previous spring for the shortest duration that overlaps with this spring
            // Gourlay defines that we need the smallest note duration that either starts **or continues** on the current spring.
            if (this._timeSortedSprings.length > 0) {
                let smallestDuration = duration;
                let previousSpring = this._timeSortedSprings[this._timeSortedSprings.length - 1];
                for (const prevDuration of previousSpring.allDurations) {
                    let end = previousSpring.timePosition + prevDuration;
                    if (end >= start && prevDuration < smallestDuration) {
                        smallestDuration = prevDuration;
                    }
                }
            }
            spring.longestDuration = duration;
            spring.postSpringWidth = postSpringSize;
            spring.graceBeatWidth = graceBeatWidth;
            spring.preBeatWidth = preBeatWidth;
            this.springs.set(start, spring);
            let timeSorted = this._timeSortedSprings;
            let insertPos = timeSorted.length - 1;
            while (insertPos > 0 && timeSorted[insertPos].timePosition > start) {
                insertPos--;
            }
            this._timeSortedSprings.splice(insertPos + 1, 0, spring);
        }
        else {
            spring = this.springs.get(start);
            if (spring.postSpringWidth < postSpringSize) {
                spring.postSpringWidth = postSpringSize;
            }
            if (spring.graceBeatWidth < graceBeatWidth) {
                spring.graceBeatWidth = graceBeatWidth;
            }
            if (spring.preBeatWidth < preBeatWidth) {
                spring.preBeatWidth = preBeatWidth;
            }
            if (duration < spring.smallestDuration) {
                spring.smallestDuration = duration;
            }
            if (duration > spring.longestDuration) {
                spring.longestDuration = duration;
            }
            spring.allDurations.add(duration);
        }
        if (this._minTime === -1 || this._minTime > start) {
            this._minTime = start;
        }
        return spring;
    }
    addBeatSpring(beat, preBeatSize, postBeatSize) {
        let start = beat.absoluteDisplayStart;
        if (beat.graceType !== GraceType.None) {
            // For grace beats we just remember the the sizes required for them
            // these sizes are then considered when the target beat is added. 
            const groupId = beat.graceGroup.id;
            if (!this.allGraceRods.has(groupId)) {
                this.allGraceRods.set(groupId, new Array(beat.graceGroup.beats.length));
            }
            if (!beat.graceGroup.isComplete && !this.incompleteGraceRods.has(groupId)) {
                this.incompleteGraceRods.set(groupId, new Array(beat.graceGroup.beats.length));
            }
            let existingSpring = this.allGraceRods.get(groupId)[beat.graceIndex];
            if (existingSpring) {
                if (existingSpring.postSpringWidth < postBeatSize) {
                    existingSpring.postSpringWidth = postBeatSize;
                }
                if (existingSpring.preBeatWidth < preBeatSize) {
                    existingSpring.preBeatWidth = preBeatSize;
                }
            }
            else {
                const graceSpring = new Spring();
                graceSpring.timePosition = start;
                graceSpring.postSpringWidth = postBeatSize;
                graceSpring.preBeatWidth = preBeatSize;
                if (!beat.graceGroup.isComplete) {
                    this.incompleteGraceRods.get(groupId)[beat.graceIndex] = graceSpring;
                }
                this.allGraceRods.get(groupId)[beat.graceIndex] = graceSpring;
            }
        }
        else {
            let graceBeatSize = 0;
            if (beat.graceGroup && this.allGraceRods.has(beat.graceGroup.id)) {
                for (const graceBeat of this.allGraceRods.get(beat.graceGroup.id)) {
                    graceBeatSize += graceBeat.springWidth;
                }
            }
            this.addSpring(start, beat.displayDuration, graceBeatSize, preBeatSize, postBeatSize);
        }
    }
    finish() {
        for (const [k, s] of this.allGraceRods) {
            let offset = 0;
            if (this.incompleteGraceRods.has(k)) {
                for (const sp of s) {
                    offset += sp.preBeatWidth;
                    sp.graceBeatWidth = offset;
                    offset += sp.postSpringWidth;
                }
            }
            else {
                for (let i = s.length - 1; i >= 0; i--) {
                    // for grace beats we store the offset 
                    // in the 'graceBeatWidth' for later use during applying
                    // beat positions
                    s[i].graceBeatWidth = offset;
                    offset -= (s[i].preBeatWidth + s[i].postSpringWidth);
                }
            }
        }
        this._incompleteGraceRodsWidth = 0;
        for (const s of this.incompleteGraceRods.values()) {
            for (const sp of s) {
                this._incompleteGraceRodsWidth += sp.preBeatWidth + sp.postSpringWidth;
            }
        }
        this.calculateSpringConstants();
        this.version++;
    }
    calculateSpringConstants() {
        this._xMin = 0;
        let springs = this.springs;
        for (const spring of springs.values()) {
            if (spring.springWidth < this._xMin) {
                this._xMin = spring.springWidth;
            }
        }
        let totalSpringConstant = 0;
        let sortedSprings = this._timeSortedSprings;
        if (sortedSprings.length === 0) {
            this.totalSpringConstant = -1;
            this.minStretchForce = -1;
            return;
        }
        for (let i = 0; i < sortedSprings.length; i++) {
            let currentSpring = sortedSprings[i];
            let duration = 0;
            if (i === sortedSprings.length - 1) {
                duration = currentSpring.longestDuration;
            }
            else {
                let nextSpring = sortedSprings[i + 1];
                duration = Math.abs(nextSpring.timePosition - currentSpring.timePosition);
            }
            currentSpring.springConstant = this.calculateSpringConstant(currentSpring, duration);
            totalSpringConstant += 1 / currentSpring.springConstant;
        }
        this.totalSpringConstant = 1 / totalSpringConstant;
        // calculate the force required to have at least the minimum size.
        this.minStretchForce = 0;
        // We take the space required between current and next spring
        // and calculate the force needed so that the current spring
        // reserves enough space
        for (let i = 0; i < sortedSprings.length; i++) {
            let currentSpring = sortedSprings[i];
            let requiredSpace = 0;
            if (i === sortedSprings.length - 1) {
                requiredSpace = currentSpring.postSpringWidth;
            }
            else {
                let nextSpring = sortedSprings[i + 1];
                requiredSpace = currentSpring.postSpringWidth + nextSpring.preSpringWidth;
            }
            // for the first spring we need to ensure we take the initial 
            // pre-spring width into account
            if (i === 0) {
                requiredSpace += currentSpring.preSpringWidth;
            }
            let requiredSpaceForce = requiredSpace * currentSpring.springConstant;
            this.updateMinStretchForce(requiredSpaceForce);
        }
    }
    paint(_cx, _cy, _canvas) { }
    // public height: number = 30;
    // public paint(cx: number, cy: number, canvas: ICanvas) {
    //     let sortedSprings: Spring[] = this._timeSortedSprings;
    //     if (sortedSprings.length === 0) {
    //         return;
    //     }
    //     const settings = canvas.settings;
    //     const force = Math.max(settings.display.stretchForce, this.minStretchForce);
    //     const height = this.height * settings.display.scale;
    //     cy -= height;
    //     canvas.color = settings.display.resources.mainGlyphColor;
    //     const font = settings.display.resources.effectFont.clone();
    //     font.size *= 0.8;
    //     canvas.font = font;
    //     canvas.fillText(force.toFixed(2), cx, cy);
    //     cy += settings.display.resources.effectFont.size * 1.5;
    //     let springX: number = sortedSprings[0].preSpringWidth;
    //     for (let i: number = 0; i < sortedSprings.length; i++) {
    //         const spring = sortedSprings[i];
    //         canvas.color = new Color(0, 0, 255, 100);
    //         canvas.fillRect(cx + springX - spring.preSpringWidth, cy, spring.preSpringWidth, height / 2);
    //         canvas.color = new Color(0, 255, 0, 100);
    //         canvas.fillRect(cx + springX, cy, spring.postSpringWidth, height / 2);
    //         canvas.color = settings.display.resources.mainGlyphColor;
    //         canvas.moveTo(cx + springX, cy);
    //         canvas.lineTo(cx + springX, cy + height / 2);
    //         canvas.stroke();
    //         springX += this.calculateWidth(force, spring.springConstant);
    //     }
    // }
    calculateSpringConstant(spring, duration) {
        if (duration <= 0) {
            duration = MidiUtils.toTicks(Duration.SixtyFourth);
        }
        if (spring.smallestDuration === 0) {
            spring.smallestDuration = duration;
        }
        let minDuration = spring.smallestDuration;
        let phi = 1 + 0.85 * Math.log2(duration / BarLayoutingInfo.MinDuration);
        return (minDuration / duration) * (1 / (phi * BarLayoutingInfo.MinDurationWidth));
    }
    spaceToForce(space) {
        if (this.totalSpringConstant !== -1) {
            if (this._timeSortedSprings.length > 0) {
                space -= this._timeSortedSprings[0].preSpringWidth;
            }
            space -= this._incompleteGraceRodsWidth;
            return Math.max(space, 0) * this.totalSpringConstant;
        }
        return -1;
    }
    calculateVoiceWidth(force) {
        let width = 0;
        if (this.totalSpringConstant !== -1) {
            width = this.calculateWidth(force, this.totalSpringConstant);
        }
        if (this._timeSortedSprings.length > 0) {
            width += this._timeSortedSprings[0].preSpringWidth;
        }
        width += this._incompleteGraceRodsWidth;
        return width;
    }
    calculateWidth(force, springConstant) {
        return force / springConstant;
    }
    buildOnTimePositions(force) {
        if (this.totalSpringConstant === -1) {
            return new Map();
        }
        if (ModelUtils.isAlmostEqualTo(this._onTimePositionsForce, force) && this._onTimePositions) {
            return this._onTimePositions;
        }
        this._onTimePositionsForce = force;
        let positions = new Map();
        this._onTimePositions = positions;
        let sortedSprings = this._timeSortedSprings;
        if (sortedSprings.length === 0) {
            return positions;
        }
        let springX = sortedSprings[0].preSpringWidth;
        for (let i = 0; i < sortedSprings.length; i++) {
            positions.set(sortedSprings[i].timePosition, springX);
            springX += this.calculateWidth(force, sortedSprings[i].springConstant);
        }
        return positions;
    }
}
BarLayoutingInfo.MinDuration = 30;
BarLayoutingInfo.MinDurationWidth = 7;
//# sourceMappingURL=BarLayoutingInfo.js.map
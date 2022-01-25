export class MidiUtils {
    /**
     * Converts the given midi tick duration into milliseconds.
     * @param ticks The duration in midi ticks
     * @param tempo The current tempo in BPM.
     * @returns The converted duration in milliseconds.
     */
    static ticksToMillis(ticks, tempo) {
        return (ticks * (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    /**
     * Converts the given midi tick duration into milliseconds.
     * @param millis The duration in milliseconds
     * @param tempo The current tempo in BPM.
     * @returns The converted duration in midi ticks.
     */
    static millisToTicks(millis, tempo) {
        return (millis / (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    /**
     * Converts a duration value to its ticks equivalent.
     */
    static toTicks(duration) {
        return MidiUtils.valueToTicks(duration);
    }
    /**
     * Converts a numerical value to its ticks equivalent.
     * @param duration the numerical proportion to convert. (i.E. timesignature denominator, note duration,...)
     */
    static valueToTicks(duration) {
        let denomninator = duration;
        if (denomninator < 0) {
            denomninator = 1 / -denomninator;
        }
        return (MidiUtils.QuarterTime * (4.0 / denomninator)) | 0;
    }
    static applyDot(ticks, doubleDotted) {
        if (doubleDotted) {
            return ticks + ((ticks / 4) | 0) * 3;
        }
        return ticks + ((ticks / 2) | 0);
    }
    static applyTuplet(ticks, numerator, denominator) {
        return ((ticks * denominator) / numerator) | 0;
    }
    static removeTuplet(ticks, numerator, denominator) {
        return ((ticks * numerator) / denominator) | 0;
    }
    static dynamicToVelocity(dyn) {
        return MidiUtils.MinVelocity + dyn * MidiUtils.VelocityIncrement;
    }
}
MidiUtils.QuarterTime = 960;
MidiUtils.MinVelocity = 15;
MidiUtils.VelocityIncrement = 16;
//# sourceMappingURL=MidiUtils.js.map
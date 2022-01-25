/**
 * This public enumeration lists all types of automations.
 */
export var AutomationType;
(function (AutomationType) {
    /**
     * Tempo change.
     */
    AutomationType[AutomationType["Tempo"] = 0] = "Tempo";
    /**
     * Colume change.
     */
    AutomationType[AutomationType["Volume"] = 1] = "Volume";
    /**
     * Instrument change.
     */
    AutomationType[AutomationType["Instrument"] = 2] = "Instrument";
    /**
     * Balance change.
     */
    AutomationType[AutomationType["Balance"] = 3] = "Balance";
})(AutomationType || (AutomationType = {}));
/**
 * Automations are used to change the behaviour of a song.
 * @cloneable
 * @json
 */
export class Automation {
    constructor() {
        /**
         * Gets or sets whether the automation is applied linear.
         */
        this.isLinear = false;
        /**
         * Gets or sets the type of the automation.
         */
        this.type = AutomationType.Tempo;
        /**
         * Gets or sets the target value of the automation.
         */
        this.value = 0;
        /**
         * Gets or sets the relative position of of the automation.
         */
        this.ratioPosition = 0;
        /**
         * Gets or sets the additional text of the automation.
         */
        this.text = '';
    }
    static buildTempoAutomation(isLinear, ratioPosition, value, reference) {
        if (reference < 1 || reference > 5) {
            reference = 2;
        }
        let references = new Float32Array([1, 0.5, 1.0, 1.5, 2.0, 3.0]);
        let automation = new Automation();
        automation.type = AutomationType.Tempo;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value * references[reference];
        return automation;
    }
    static buildInstrumentAutomation(isLinear, ratioPosition, value) {
        let automation = new Automation();
        automation.type = AutomationType.Instrument;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value;
        return automation;
    }
}
//# sourceMappingURL=Automation.js.map
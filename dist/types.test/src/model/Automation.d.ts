/**
 * This public enumeration lists all types of automations.
 */
export declare enum AutomationType {
    /**
     * Tempo change.
     */
    Tempo = 0,
    /**
     * Colume change.
     */
    Volume = 1,
    /**
     * Instrument change.
     */
    Instrument = 2,
    /**
     * Balance change.
     */
    Balance = 3
}
/**
 * Automations are used to change the behaviour of a song.
 * @cloneable
 * @json
 */
export declare class Automation {
    /**
     * Gets or sets whether the automation is applied linear.
     */
    isLinear: boolean;
    /**
     * Gets or sets the type of the automation.
     */
    type: AutomationType;
    /**
     * Gets or sets the target value of the automation.
     */
    value: number;
    /**
     * Gets or sets the relative position of of the automation.
     */
    ratioPosition: number;
    /**
     * Gets or sets the additional text of the automation.
     */
    text: string;
    static buildTempoAutomation(isLinear: boolean, ratioPosition: number, value: number, reference: number): Automation;
    static buildInstrumentAutomation(isLinear: boolean, ratioPosition: number, value: number): Automation;
}

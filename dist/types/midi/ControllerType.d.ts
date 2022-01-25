/**
 * Lists all midi controllers.
 */
export declare enum ControllerType {
    /**
     * Bank Select. MSB
     */
    BankSelectCoarse = 0,
    /**
     * Modulation wheel or lever MSB
     */
    ModulationCoarse = 1,
    /**
     * Data entry MSB
     */
    DataEntryCoarse = 6,
    /**
     * Channel Volume MSB
     */
    VolumeCoarse = 7,
    /**
     * Pan MSB
     */
    PanCoarse = 10,
    /**
     * Expression Controller MSB
     */
    ExpressionControllerCoarse = 11,
    /**
     * Modulation wheel or level LSB
     */
    ModulationFine = 33,
    /**
     * Data Entry LSB
     */
    DataEntryFine = 38,
    /**
     * Channel Volume LSB
     */
    VolumeFine = 39,
    /**
     * Pan LSB
     */
    PanFine = 42,
    /**
     * Expression controller LSB
     */
    ExpressionControllerFine = 43,
    /**
     * Damper pedal (sustain)
     */
    HoldPedal = 64,
    /**
     * Legato Footswitch
     */
    LegatoPedal = 68,
    /**
     * Non-Registered Parameter Number LSB
     */
    NonRegisteredParameterFine = 98,
    /**
     * Non-Registered Parameter Number MSB
     */
    NonRegisteredParameterCourse = 99,
    /**
     * Registered Parameter Number LSB
     */
    RegisteredParameterFine = 100,
    /**
     * Registered Parameter Number MSB
     */
    RegisteredParameterCourse = 101,
    /**
     * Reset all controllers
     */
    ResetControllers = 121,
    /**
     * All notes of.
     */
    AllNotesOff = 123
}

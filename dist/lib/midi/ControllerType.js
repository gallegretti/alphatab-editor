/**
 * Lists all midi controllers.
 */
export var ControllerType;
(function (ControllerType) {
    /**
     * Bank Select. MSB
     */
    ControllerType[ControllerType["BankSelectCoarse"] = 0] = "BankSelectCoarse";
    /**
     * Modulation wheel or lever MSB
     */
    ControllerType[ControllerType["ModulationCoarse"] = 1] = "ModulationCoarse";
    //BreathControllerCoarse = 0x02,
    //FootControllerCoarse = 0x04,
    //PortamentoTimeCoarse = 0x05,
    /**
     * Data entry MSB
     */
    ControllerType[ControllerType["DataEntryCoarse"] = 6] = "DataEntryCoarse";
    /**
     * Channel Volume MSB
     */
    ControllerType[ControllerType["VolumeCoarse"] = 7] = "VolumeCoarse";
    //BalanceCoarse = 0x08,
    /**
     * Pan MSB
     */
    ControllerType[ControllerType["PanCoarse"] = 10] = "PanCoarse";
    /**
     * Expression Controller MSB
     */
    ControllerType[ControllerType["ExpressionControllerCoarse"] = 11] = "ExpressionControllerCoarse";
    //EffectControl1Coarse = 0x0C,
    //EffectControl2Coarse = 0x0D,
    //GeneralPurposeSlider1 = 0x10,
    //GeneralPurposeSlider2 = 0x11,
    //GeneralPurposeSlider3 = 0x12,
    //GeneralPurposeSlider4 = 0x13,
    //BankSelectFine = 0x20,
    /**
     * Modulation wheel or level LSB
     */
    ControllerType[ControllerType["ModulationFine"] = 33] = "ModulationFine";
    //BreathControllerFine = 0x22,
    //FootControllerFine = 0x24,
    //PortamentoTimeFine = 0x25,
    /**
     * Data Entry LSB
     */
    ControllerType[ControllerType["DataEntryFine"] = 38] = "DataEntryFine";
    /**
     * Channel Volume LSB
     */
    ControllerType[ControllerType["VolumeFine"] = 39] = "VolumeFine";
    //BalanceFine = 0x28,
    /**
     * Pan LSB
     */
    ControllerType[ControllerType["PanFine"] = 42] = "PanFine";
    /**
     * Expression controller LSB
     */
    ControllerType[ControllerType["ExpressionControllerFine"] = 43] = "ExpressionControllerFine";
    //EffectControl1Fine = 0x2C,
    //EffectControl2Fine = 0x2D,
    /**
     * Damper pedal (sustain)
     */
    ControllerType[ControllerType["HoldPedal"] = 64] = "HoldPedal";
    //Portamento = 0x41,
    //SostenutoPedal = 0x42,
    //SoftPedal = 0x43,
    /**
     * Legato Footswitch
     */
    ControllerType[ControllerType["LegatoPedal"] = 68] = "LegatoPedal";
    //Hold2Pedal = 0x45,
    //SoundVariation = 0x46,
    //SoundTimbre = 0x47,
    //SoundReleaseTime = 0x48,
    //SoundAttackTime = 0x49,
    //SoundBrightness = 0x4A,
    //SoundControl6 = 0x4B,
    //SoundControl7 = 0x4C,
    //SoundControl8 = 0x4D,
    //SoundControl9 = 0x4E,
    //SoundControl10 = 0x4F,
    //GeneralPurposeButton1 = 0x50,
    //GeneralPurposeButton2 = 0x51,
    //GeneralPurposeButton3 = 0x52,
    //GeneralPurposeButton4 = 0x53,
    //EffectsLevel = 0x5B,
    //TremuloLevel = 0x5C,
    //ChorusLevel = 0x5D,
    //CelesteLevel = 0x5E,
    //PhaseLevel = 0x5F,
    //DataButtonIncrement = 0x60,
    //DataButtonDecrement = 0x61,
    /**
     * Non-Registered Parameter Number LSB
     */
    ControllerType[ControllerType["NonRegisteredParameterFine"] = 98] = "NonRegisteredParameterFine";
    /**
     * Non-Registered Parameter Number MSB
     */
    ControllerType[ControllerType["NonRegisteredParameterCourse"] = 99] = "NonRegisteredParameterCourse";
    /**
     * Registered Parameter Number LSB
     */
    ControllerType[ControllerType["RegisteredParameterFine"] = 100] = "RegisteredParameterFine";
    /**
     * Registered Parameter Number MSB
     */
    ControllerType[ControllerType["RegisteredParameterCourse"] = 101] = "RegisteredParameterCourse";
    //AllSoundOff = 0x78,
    /**
     * Reset all controllers
     */
    ControllerType[ControllerType["ResetControllers"] = 121] = "ResetControllers";
    //LocalKeyboard = 0x7A,
    /**
     * All notes of.
     */
    ControllerType[ControllerType["AllNotesOff"] = 123] = "AllNotesOff";
    //OmniModeOff = 0x7C,
    //OmniModeOn = 0x7D,
    //MonoMode = 0x7E,
    //PolyMode = 0x7F
})(ControllerType || (ControllerType = {}));
//# sourceMappingURL=ControllerType.js.map
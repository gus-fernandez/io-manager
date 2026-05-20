// resources/js/Device/Modules/midiCC.js

export const CC = {
    MODWHEEL        : 1,  // 0.0f to 1.0f
    MOD_RATE        : 2,
    MOD_TO_FREQ     : 3,
    MOD_TO_CUT      : 4,
    MOD_TO_PAN      : 5,

    LFO_WAVEFORM    : 6,   // LFO Waveform Table (0.0f to 1.0f)
    LFO_RATE        : 7,   // 0 to 40000
    LFO_AMOUNT      : 8,   // -1.0f to 1.0f
    LFO_PHASE       : 9,   // -1.0f to 1.0f
    LFO_DELAY       : 10,  // 0 to 10000
    LFO_DEST        : 11,  // LFO Dest Table (0.0f to 1.0f)
    LFO_SYNC        : 12,  // Button
    LFO_TRIGGER     : 13,  // Button
    LFO_INV_DELAY   : 14,  // Button

    OSC1_WAVEFORM     : 15,  // OSC Waveform Table (0.0f to 1.0f)
    OSC1_VOLUME       : 16,  // 0.0f to 1.0f
    OSC1_PHASE        : 17,  // -1.0f to 1.0f
    OSC1_OCT          : 18,  // Octaves Table (0.0f to 1.0f)
    OSC1_TUNE         : 19,  // Semitones Table (0.0f to 1.0f)
    OSC1_FINE         : 20,  // 0.943874f to 1.0f to 1.059463f
    OSC1_HARDSYNC     : 21,  // Button
    OSC1_LFO_ACTIVE   : 22,  // Button
    OSC1_AD_ACTIVE    : 23,  // Button

    OSC2_WAVEFORM     : 24,
    OSC2_VOLUME       : 25,
    OSC2_PHASE        : 26,
    OSC2_OCT          : 27,
    OSC2_TUNE         : 28,
    OSC2_FINE         : 29,
    OSC2_HARDSYNC     : 30, // Button
    OSC2_LFO_ACTIVE   : 31, // Button
    OSC2_AD_ACTIVE    : 32, // Button

    OSC3_WAVEFORM     : 33,
    OSC3_VOLUME       : 34,
    OSC3_OCT          : 36,
    OSC3_TUNE         : 37,
    OSC3_FINE         : 38,
    OSC3_LFO_ACTIVE   : 39, // Button
    OSC3_AD_ACTIVE    : 40,  // Button

    FX_CRUSH_LPF      : 41,
    FX_DELAY_X2       : 42,

    VCF_FILTER_TYPE   : 43,  // VCF Table (0.0f - 1.0f)
    VCF_CUTOFF        : 44,  // 0.0f to 1.0f
    VCF_RESONANCE     : 45,  // 0.0f to 1.0f

    VCF_A        : 46,  // 0 to 40000
    VCF_D        : 47,  // 0 to 40000
    VCF_S        : 48,  // 0.0f to 1.0f
    VCF_R        : 49,  // 0 to 40000
    VCF_ENV      : 50,  // -1.0f to 1.0f

    AMP_A        : 51,  // 0 to 40000
    AMP_D        : 52,  // 0 to 40000
    AMP_S        : 53,  // 0.0f to 1.0f
    AMP_R        : 54,  // 0 to 40000

    AD_ATTACK         : 55,  // 0 to 40000
    AD_DECAY          : 56,  // 0 to 40000
    AD_AMOUNT         : 57,  // -1.0f to 1.0f
    AD_DEST           : 58,  // AD Dest Table (0.0f to 1.0f)
    AD_RESET          : 59, // Button
    AD_SYNC           : 60,  // Button

    FX_SATURATION     : 61,  // 0.0f to 1.0f
    FX_HPF_CUT        : 62, // 0.0f to 0.1f <- Check
    FX_BITCRUSH       : 63,
    FX_RATECRUSH      : 64,
    FX_RATE_MIX       : 65,
    FX_CHORUS_WET     : 66, // 0.0f to 1.0f
    FX_CHORUS_RATE    : 67,  // 0.0f to 0.2f
    FX_CHORUS_DEPTH   : 68,  // 0.0f to 1.0f
    FX_DELAY_WET      : 69,  // 0.0f to 1.0f
    FX_DELAY_TIME     : 70,  // 0.0f to 1.0f
    FX_DELAY_FEED     : 71,  // 0.0f to 1.0f
    FX_DELAY_LPF      : 72,  // 0.0f to 1.0f

    RING_AMOUNT       : 73,  // 0.0f to 1.0f
    OSC_SPREAD        : 74,  // 0.0f to 1.0f
    OSC_DRIFT         : 75,
    GLOBAL_DETUNE     : 76,
    MASTER_VOLUME     : 77,  // 0.0f to 1.0f
    PRE_GAIN          : 78,
    VOICE_MODE        : 79,  // POLY MONO
    UNI_VOICES        : 80,  //1 - 8
    GLIDE_TIME        : 81,  // Millis
    GLIDE_AUTO        : 82,  //0 1
    HOLD              : 83,  //0 1

    BPM               : 84,
    CLK_DIVIDER       : 85,
    EXT               : 86,

    SELECT_BEND       : 87,  // Pitch: 0.125f to 1.0f to 4.0f. VCF: 0.0f to VCFcutoff to 1.0f
    SELECT_VEL        : 88,  // 0.0f to 1.0
    SELECT_MODWHEEL   : 89,
    MODWHEEL_SYNC     : 90,

    BEND_TO_FREQ      : 91,
    BEND_TO_CUT       : 92,
    VEL_TO_CUT        : 93,
    VEL_TO_VOL        : 94,

    OSC3_NOISE_COLOR  : 95,
    OSC3_NOISE_RATE   : 96,
    OSC3_NOISE_RESO   : 97,

    VCF_KEYFOLLOW     : 98, // 0.0f to 1.0f not

    ARP_SYNC          : 99,
    ARP_TYPE          : 100,
    ARP_RATE          : 101,
    ARP_LEN           : 102,
    ARP_STEPS         : 103
};

if (import.meta.hot) {
    import.meta.hot.accept();
}
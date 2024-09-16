import { Regex } from '@companion-module/base'

export const tiles = [
	{ id: 'tile1', label: 'Tile 1' },
	{ id: 'tile2', label: 'Tile 2' },
	{ id: 'tile3', label: 'Tile 3' },
	{ id: 'tile4', label: 'Tile 4' },
	{ id: 'tile5', label: 'Tile 5' },
	{ id: 'tile6', label: 'Tile 6' },
	{ id: 'tile7', label: 'Tile 7' },
	{ id: 'tile8', label: 'Tile 8' },
	{ id: 'focus', label: 'Tile In Focus' },
]

export const ip = [
	{ id: 'IP1', label: 'IP 1' },
	{ id: 'IP2', label: 'IP 2' },
]

export const config = [
	{ id: 'config0', label: 'Config 0' },
	{ id: 'config1', label: 'Config 1' },
	{ id: 'config2', label: 'Config 2' },
	{ id: 'config3', label: 'Config 3' },
	{ id: 'config4', label: 'Config 4' },
	{ id: 'config5', label: 'Config 5' },
]

export const actionOptions = {
	tiles: {
		id: 'scope',
		type: 'dropdown',
		label: 'Scope',
		default: tiles[0].id,
		choices: tiles,
		useVariables: true,
		allowCustom: true,
		regex: Regex.SOMETHING,
		tooltip: 'Requires Tile Scope of tile1 through tile8',
	},
	ip: {
		id: 'scope',
		type: 'dropdown',
		label: 'Scope',
		default: ip[0].id,
		choices: ip,
		useVariables: true,
		allowCustom: true,
		regex: Regex.SOMETHING,
		tooltip: 'Requires a scope of IP1 or IP2',
	},
	config: {
		id: 'scope',
		type: 'dropdown',
		label: 'Scope',
		default: config[0].id,
		choices: config,
		useVariables: true,
		allowCustom: true,
		regex: Regex.SOMETHING,
		tooltip: 'Config/Input Scope: config0 to config5',
	},
	useVar: {
		id: 'useVar',
		type: 'checkbox',
		label: 'Use Variable',
		default: false,
	},
	modeVar: {
		id: 'modeVar',
		type: 'textinput',
		default: '',
		useVariables: true,
		regex: Regex.SOMETHING,
		isVisible: (options) => {
			return options.useVar
		},
	},

	modeDropdown: {
		id: 'mode',
		type: 'dropdown',
		label: 'Mode',
		useVariables: true,
		allowCustom: true,
		regex: Regex.SOMETHING,
	},
	integerInput: {
		id: 'mode',
		type: 'number',
		range: true,
		min: 0,
		step: 1,
		default: 0,
		isVisible: (options) => {
			return !options.useVar
		},
	},
}
export const activeInputChoices = [
	{ id: 'set', label: 'Set' },
	{ id: 'get', label: 'Get' },
	{ id: 'inc', label: 'Increment' },
	{ id: 'dec', label: 'Decrement' },
]

export const audioSessionControlChoices = [
	{ id: 'AUDIO_SESSION_CONTROL_STOP', label: 'Stop' },
	{ id: 'AUDIO_SESSION_CONTROL_RUN', label: 'Run' },
	{ id: 'AUDIO_SESSION_CONTROL_RESET', label: 'Reset' },
]

export const loudnessSessionControlChoices = [
	{ id: 'LOUDNESS_SESSION_CONTROL_STOP', label: 'Stop' },
	{ id: 'LOUDNESS_SESSION_CONTROL_RUN', label: 'Run' },
	{ id: 'LOUDNESS_SESSION_CONTROL_RESET', label: 'Reset' },
]

export const videoSessionControlChoices = [
	{ id: 'IOSLAVE_SESSION_CONTROL_STOP', label: 'Stop' },
	{ id: 'IOSLAVE_SESSION_CONTROL_RUN', label: 'Run' },
	{ id: 'IOSLAVE_SESSION_CONTROL_RESET', label: 'Reset' },
]

export const ipSessionControlChoices = [
	{ id: 'IOSLAVE_SESSION_CONTROL_STOP', label: 'Stop' },
	{ id: 'IOSLAVE_SESSION_CONTROL_RUN', label: 'Run' },
	{ id: 'IOSLAVE_SESSION_CONTROL_RESET', label: 'Reset' },
]

export const tileSelectChoices = [
	{ id: 0, label: 'None' },
	{ id: 1, label: 'Tile 1' },
	{ id: 2, label: 'Tile 2' },
	{ id: 3, label: 'Tile 3' },
	{ id: 4, label: 'Tile 4' },
	{ id: 5, label: 'Tile 5' },
	{ id: 6, label: 'Tile 6' },
	{ id: 7, label: 'Tile 7' },
	{ id: 8, label: 'Tile 8' },
]

export const tileFullscreenModeChoices = [
	{ id: 'TILE_FULLSCREEN_MODE_NORMAL', label: 'Normal' },
	{ id: 'TILE_FULLSCREEN_MODE_EXTENDED', label: 'Extended' },
]

export const tileInFocusChoices = [
	{ id: 1, label: 'Tile 1' },
	{ id: 2, label: 'Tile 2' },
	{ id: 3, label: 'Tile 3' },
	{ id: 4, label: 'Tile 4' },
	{ id: 5, label: 'Tile 5' },
	{ id: 6, label: 'Tile 6' },
	{ id: 7, label: 'Tile 7' },
	{ id: 8, label: 'Tile 8' },
]

export const audioBallisticChoices = [
	{ id: 'AUDIO_BALLISTIC_PPM_1', label: 'PPM 1' },
	{ id: 'AUDIO_BALLISTIC_PPM_2', label: 'PPM 2' },
	{ id: 'AUDIO_BALLISTIC_TRUE_PEAK', label: 'True Peak' },
]

export const loudnessMeteringModeChoices = [
	{ id: 'LOUDNESS_METER_MODE_1770_2_DI', label: 'BS.1770-1 with DI' },
	{ id: 'LOUDNESS_METER_MODE_1770_1_DI', label: 'BS.1770-2 with DI' },
	{ id: 'LOUDNESS_METER_MODE_1770_2', label: 'BS.1770-2' },
	{ id: 'LOUDNESS_METER_MODE_LEQA_DI', label: 'Leq(A) with DI' },
]

export const loudnessFullScaleUnitsChoices = [
	{ id: 'LOUDNESS_FULL_SCALE_UNITS_LUFS', label: 'LUFS' },
	{ id: 'LOUDNESS_FULL_SCALE_UNITS_LKFS', label: 'LKFS' },
]

export const loudnessTruePeakDcBlockChoices = [
	{ id: 'TRUE_PEAK_DC_BLOCK_OFF', label: 'OFF' },
	{ id: 'TRUE_PEAK_DC_BLOCK_ON', label: 'ON' },
]

export const loudnessTruePeakEmphasisChoices = [
	{ id: 'TRUE_PEAK_EMPHASIS_OFF', label: 'OFF' },
	{ id: 'TRUE_PEAK_EMPHASIS_ON', label: 'ON' },
]

export const loudnessBallisticChoices = [
	{ id: 'LOUDNESS_BALLISTIC_SHORT_AVERAGE', label: 'Short Average' },
	{ id: 'LOUDNESS_BALLISTIC_LONG_AVERAGE', label: 'Long Average' },
	{ id: 'LOUDNESS_BALLISTIC_EBU_R128_M', label: 'EBU R128 M' },
]

export const loudnessShortGatingWindowChoices = [
	{ id: 'LOUDNESS_SHORT_GATING_WINDOW_EBU_R128_3S', label: 'EBU R128 (3s)' },
	{ id: 'LOUDNESS_SHORT_GATING_WINDOW_LEGACY_10S', label: 'Legacy (10s)' },
]

export const loudnessLoadPresetChoices = [
	{ id: 'LOUDNESS_PRESET_EBU_R128_2014', label: 'EBU R128:2014' },
	{ id: 'LOUDNESS_PRESET_ATSC_A85_2013', label: 'ATSC A/85:2013' },
]

export const audioProgramSurroundOrderChoices = [
	{ id: 'AUDIO_PROGRAM_SURROUND_ORDER_LRC', label: 'LRC' },
	{ id: 'AUDIO_PROGRAM_SURROUND_ORDER_LCR', label: 'LCR' },
]

export const dolbyMetadataSourceChoices = [
	{ id: 'DOLBY_METADATA_SOURCE_AUTO', label: 'AUTO' },
	{ id: 'DOLBY_METADATA_SOURCE_AES', label: 'AES' },
	{ id: 'DOLBY_METADATA_SOURCE_VANC', label: 'VANC' },
]

export const audioDownmixModeChoices = [
	{ id: 'AUDIO_DOWNMIX_MODE_LO_RO', label: 'LO RO' },
	{ id: 'AUDIO_DOWNMIX_MODE_LT_RT', label: 'LT RT' },
	{ id: 'AUDIO_DOWNMIX_MODE_MONO', label: 'MONO' },
]

export const audioSoloModeChoices = [
	{ id: 'AUDIO_SOLO_MUTE_MODE_SOLO_ON', label: 'SOLO ON' },
	{ id: 'AUDIO_SOLO_MUTE_MODE_OFF', label: 'OFF' },
]

export const dolbyDrcModeChoices = [
	{ id: 'AUDIO_DOLBY_DRC_MODE_OFF', label: 'Off' },
	{ id: 'AUDIO_DOLBY_DRC_MODE_LINE', label: 'Line' },
	{ id: 'AUDIO_DOLBY_DRC_MODE_RF', label: 'RF' },
]

export const analogAudioOutputModeChoices = [
	{ id: 'ANALOG_AUDIO_OUT_DISCRETE_CHANNELS', label: 'Discrete' },
	{ id: 'ANALOG_AUDIO_OUT_DOWNMIX', label: 'Downmix' },
]

export const audioAuxDisplayModeChoices = [
	{ id: 'AUDIO_AUX_DISPLAY_MODE_NONE', label: 'None' },
	{ id: 'AUDIO_AUX_DISPLAY_MODE_LISSAJOUS', label: 'Lissajous' },
	{ id: 'AUDIO_AUX_DISPLAY_MODE_SURROUND', label: 'Surround' },
	{ id: 'AUDIO_AUX_DISPLAY_MODE_LOUD', label: 'Loudness' },
]

export const audioDisplayLoudnessMeterChoices = [
	{ id: 'AUDIO_DISPLAY_LOUDNESS_METER_OFF', label: 'Off' },
	{ id: 'AUDIO_DISPLAY_LOUDNESS_METER_ON', label: 'On' },
]

export const audioSessionDisplayChoices = [
	{ id: 'AUDIO_SESSION_DISPLAY_OFF', label: 'Off' },
	{ id: 'AUDIO_SESSION_DISPLAY_ON', label: 'On' },
]

export const surroundDominanceIndicatorChoices = [
	{ id: 'AUDIO_DISPLAY_SURROUND_DOMINANCE_OFF', label: 'Off' },
	{ id: 'AUDIO_DISPLAY_SURROUND_DOMINANCE_ON', label: 'On' },
]

export const surroundImmersiveDominanceIndicatorChoices = [
	{ id: 'AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_OFF', label: 'Off' },
	{ id: 'AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_ON', label: 'On' },
]

export const surroundBedSelectChoices = [
	{ id: 'AUDIO_DISPLAY_SURROUND_BED_SELECT_MAIN', label: 'Main' },
	{ id: 'AUDIO_DISPLAY_SURROUND_BED_SELECT_UPPER', label: 'Upper' },
	{ id: 'AUDIO_DISPLAY_SURROUND_BED_SELECT_BOTH', label: 'Both' },
]

export const surroundImmersivePsiBedSelectChoices = [
	{ id: 'AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_MAIN', label: 'Main' },
	{ id: 'AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_UPPER', label: 'Upper' },
]

export const avdelayUserOffsetModeChoices = [
	{ id: 'AVDELAY_USER_OFFSET_MODE_OFF', label: 'Off' },
	{ id: 'AVDELAY_USER_OFFSET_MODE_ON', label: 'On' },
]

export const sdiLoopThroughChoices = [
	{ id: 'MEDIA_MODE_IP_4_IN', label: 'Off' },
	{ id: 'MEDIA_MODE_IP_2_IN', label: 'On' },
]

export const ipVideoPhyBitRateChoices = [
	{ id: 10, label: '10 Gbps' },
	{ id: 25, label: '25 Gbps' },
]

export const ipVideoPhyFecModeChoices = [
	{ id: 'BD_IFC_IP_VIDEO_PHY_FEC_MODE_BYPASS', label: 'Bypass' },
	{ id: 'BD_IFC_IP_VIDEO_PHY_FEC_MODE_ENABLE', label: 'Enable' },
]

export const camappDisplayTypeChoices = [
	{ id: 'CAMAPP_DISPLAY_TYPE_WAVEFORM', label: 'Waveform' },
	{ id: 'CAMAPP_DISPLAY_TYPE_STOP', label: 'Stop' },
]

export const camappGainChoices = [
	{ id: 'CAMAPP_GAIN_X1', label: 'x1' },
	{ id: 'CAMAPP_GAIN_X2', label: 'x2' },
	{ id: 'CAMAPP_GAIN_X5', label: 'x5' },
	{ id: 'CAMAPP_GAIN_X10', label: 'x10' },
]

export const camappSweepChoices = [
	{ id: 'CAMAPP_SWEEP_1_LINE', label: 'Line' },
	{ id: 'CAMAPP_SWEEP_1_FIELD', label: 'Field' },
]

export const camappFilterChoices = [
	{ id: 'CAMAPP_FILTER_FLAT', label: 'Flat' },
	{ id: 'CAMAPP_FILTER_LOW_PASS', label: 'Low Pass' },
]

export const camappThumbnailChoices = [
	{ id: 'CAMAPP_THUMBNAIL_ON', label: 'On' },
	{ id: 'CAMAPP_THUMBNAIL_OFF', label: 'Off' },
]

export const camappGraticuleUnitsChoices = [
	{ id: 'CAMAPP_GRAT_UNITS_PERCENT', label: 'Waveform - Percent' },
	{ id: 'CAMAPP_GRAT_UNITS_NITS', label: 'Waveform - Nits' },
	{ id: 'CAMAPP_GRAT_UNITS_STOP', label: 'Waveform - Stop' },
	{ id: 'CAMAPP_GRAT_UNITS_LOG_NITS', label: 'Stop - Log Nits' },
	{ id: 'CAMAPP_GRAT_UNITS_LOG_STOP', label: 'Stop - Log Stop' },
]

export const diagnosticUrlPresetChoices = [
	{ id: 'COMPOSITOR_URL_HOME', label: 'Home' },
	{ id: 'COMPOSITOR_URL_TOUCH_TEST', label: 'Touch Test' },
	{ id: 'COMPOSITOR_URL_RED', label: 'Red' },
	{ id: 'COMPOSITOR_URL_GREEN', label: 'Green' },
	{ id: 'COMPOSITOR_URL_BLUE', label: 'Blue' },
	{ id: 'COMPOSITOR_URL_GRAY20', label: 'Gray 20' },
	{ id: 'COMPOSITOR_URL_GRAY45', label: 'Gray 45' },
	{ id: 'COMPOSITOR_URL_BLACK', label: 'Black' },
	{ id: 'COMPOSITOR_URL_WHITE', label: 'White' },
]

export const extendedDisplayModeChoices = [
	{ id: 'COMPOSITOR_DISPLAY_MODE_SINGLE', label: 'Single' },
	{ id: 'COMPOSITOR_DISPLAY_MODE_DOUBLE', label: 'Double' },
]

export const diamondModeChoices = [
	{ id: 0, label: 'Normal Diamond' },
	{ id: 1, label: 'Split Diamond' },
]

export const diamondLutChoices = [
	{ id: 'DIAMOND_LUT_OFF', label: 'Off' },
	{ id: 'DIAMOND_LUT_ON', label: 'On' },
]

export const mpiLedColorChoices = [
	{ id: 'LED_COLOR_OFF', label: 'Off' },
	{ id: 'LED_COLOR_GREEN', label: 'Green' },
	{ id: 'LED_COLOR_RED', label: 'Red' },
	{ id: 'LED_COLOR_YELLOW', label: 'Yellow' },
	{ id: 'LED_COLOR_BLUE', label: 'Blue' },
	{ id: 'LED_COLOR_CYAN', label: 'Cyan' },
	{ id: 'LED_COLOR_MAGENTA', label: 'Magenta' },
	{ id: 'LED_COLOR_WHITE', label: 'White' },
]

export const extrefSweepChoices = [
	{ id: 0, label: '1 Line' },
	{ id: 1, label: '2 Line' },
	{ id: 2, label: '1 Field' },
	{ id: 3, label: '2 Field' },
]

export const extrefGainChoices = [
	{ id: 0, label: '0' },
	{ id: 1, label: '1' },
	{ id: 2, label: '2' },
	{ id: 5, label: '5' },
]

export const extrefHmagChoices = [
	{ id: 0, label: 'Disable' },
	{ id: 1, label: 'Enable' },
]

export const eyeMeterEnableChoices = [
	{ id: 0, label: 'Disable' },
	{ id: 1, label: 'Enable' },
]

export const eyeSweepChoices = [
	{ id: 0, label: '3 Eye' },
	{ id: 1, label: 'Word (10 Eye/20 Eye)' },
	{ id: 2, label: '1 Field' },
	{ id: 3, label: '2 Field' },
]

export const fpTestModeChoices = [
	{ id: 'FP_TEST_MODE_NONE', label: 'Off' },
	{ id: 'FP_TEST_MODE_BUTTON', label: 'Button' },
	{ id: 'FP_TEST_MODE_LED', label: 'LED' },
]

export const stopSweepChoices = [
	{ id: 16, label: 'Parade style 1 line sweep' },
	{ id: 18, label: 'Parade style 1 field sweep' },
	{ id: 0, label: 'Overlay style 1 line sweep' },
	{ id: 1, label: 'Overlay style 2 line sweep' },
	{ id: 2, label: 'Overlay style 1 field sweep' },
	{ id: 3, label: 'Overlay style 2 field sweep' },
]

export const stopColorTraceChoices = [
	{ id: 'FSTOP_COLOR_TRACE_OFF', label: 'Off' },
	{ id: 'FSTOP_COLOR_TRACE_ON', label: 'On' },
]

export const stopEnableBestGainChoices = [
	{ id: 'FSTOP_BEST_ENABLE_OFF', label: 'Off' },
	{ id: 'FSTOP_BEST_ENABLE_ON', label: 'On' },
]

export const stopHmagChoices = [
	{ id: 0, label: 'Disable' },
	{ id: 1, label: 'Enable' },
]

export const stopActiveAreaChoices = [
	{ id: 'FSTOP_ACTIVE_AREA_OFF', label: 'Off' },
	{ id: 'FSTOP_ACTIVE_AREA_ON', label: 'On' },
]

export const stopGammaReferenceChoices = [
	{ id: 0, label: 'Scene Light' },
	{ id: 1, label: 'Display Light' },
]

export const stopEnableLowPassFilterChoices = [
	{ id: 'FSTOP_LPF_ENABLE_OFF', label: 'Off' },
	{ id: 'FSTOP_LPF_ENABLE_ON', label: 'On' },
]

export const gpioPresetRecallEnableChoices = [
	{ id: 'GPIO_PRESET_RECALL_ENABLE_OFF', label: 'Off' },
	{ id: 'GPIO_PRESET_RECALL_ENABLE_ON', label: 'On' },
]

export const audioPairAuxOutModeChoices = [
	{ id: 'AUX_OUT_MODE_FIXED_CHANNELS', label: 'Fixed Channels' },
	{ id: 'AUX_OUT_MODE_PAIR_ON_CH1_CH2', label: 'Pair On Ch1 Ch2' },
]

export const sourceConfigVidLinksChoices = [
	{ id: 'IOSLAVE_SOURCE_CONFIG_VID_LINKS_SINGLE', label: 'Single' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_VID_LINKS_QUAD', label: 'Quad' },
]

export const sourceConfigColorimetryChoices = [
	{ id: 'IOSLAVE_SOURCE_CONFIG_COLORIMETRY_709', label: 'Rec 709' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_COLORIMETRY_BT2020', label: 'BT 2020' },
]

export const sourceConfigEotfChoices = [
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_SDR_NARROW', label: 'SDR Narrow' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_SDR_FULL', label: 'SDR Full' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_PQ_NARROW', label: 'PQ Narrow' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_PQ_FULL', label: 'PQ Full' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_HLG', label: 'HLG' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_SLOG2', label: 'S-Log 2' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3', label: 'S-Log 3' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3_LIVE_HDR', label: 'S-Log 3 (Live HDR)' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_EOTF_LOGC', label: 'Log C' },
]

export const audioInputTypeChoices = [
	{ id: 'AUDIO_INPUT_TYPE_PCM', label: 'PCM' },
	{ id: 'AUDIO_INPUT_TYPE_DOLBY', label: 'Dolby' },
]

export const audioPcmProgramChoices = [
	{ id: 'AUDIO_PCM_PROGRAM_OFF', label: 'Off' },
	{ id: 'AUDIO_PCM_PROGRAM_ON', label: 'On' },
]

export const xmitMode2110Choices = [
	{ id: 'IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_N', label: 'Gapped' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_NL', label: 'Narrow Linear' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_W', label: 'Wide Linear' },
]

export const remoteConfigModeChoices = [
	{ id: 'IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_OFF', label: 'Off' },
	{ id: 'IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_NMOS', label: 'NMOS' },
]

export const inputEditModeChoices = [
	{ id: 'IOSLAVE_UI_EDIT_MODE_OFF', label: 'Off' },
	{ id: 'IOSLAVE_UI_EDIT_MODE_ON', label: 'On' },
]

export const extRefOutChoices = [
	{ id: 'EXT_REF_OUT_LOOPTHROUGH', label: 'Loop' },
	{ id: 'EXT_REF_OUT_TERMINATE', label: 'Terminate' },
	{ id: 'EXT_REF_OUT_PPS', label: 'PPS' },
]

export const ipFastSwitchEnableChoices = [
	{ id: 'IP_FAST_SWITCH_ENABLE_OFF', label: 'Off' },
	{ id: 'IP_FAST_SWITCH_ENABLE_ON', label: 'On' },
]

export const ignoreRtpSequenceErrorChoices = [
	{ id: 'IP_IGNORE_RTP_SEQUENCE_ERROR_OFF', label: 'Report' },
	{ id: 'IP_IGNORE_RTP_SEQUENCE_ERROR_ON', label: 'Ignore' },
]

export const jitterMeterEnableChoices = [
	{ id: 0, label: 'Off' },
	{ id: 1, label: 'On' },
]

export const jitterSweepChoices = [
	{ id: 0, label: '1 Line' },
	{ id: 1, label: '2 Line' },
	{ id: 2, label: '1 Field' },
	{ id: 3, label: '2 Field' },
]

export const lightningVerticalVarEnableChoices = [
	{ id: 'LIGHTNING_V_VAR_ENABLE_OFF', label: 'Off' },
	{ id: 'LIGHTNING_V_VAR_ENABLE_ON', label: 'On' },
]

export const lightningHorizontalVarEnableChoices = [
	{ id: 'LIGHTNING_H_VAR_ENABLE_OFF', label: 'Off' },
	{ id: 'LIGHTNING_H_VAR_ENABLE_ON', label: 'On' },
]

export const lightningLutChoices = [
	{ id: 'LIGHTNING_LUT_OFF', label: 'Off' },
	{ id: 'LIGHTNING_LUT_ON', label: 'On' },
]

export const measureAssignChoices = [
	{ id: 'MEASURE_ASSIGN_CHANNEL_STATUS', label: 'AES Channel Status' },
	{ id: 'MEASURE_ASSIGN_ANC_DATA', label: 'ANC Session' },
	{ id: 'MEASURE_ASSIGN_AUDIO', label: 'Audio' },
	{ id: 'MEASURE_ASSIGN_AV_DELAY', label: 'A/V Delay' },
	{ id: 'MEASURE_ASSIGN_CAMAPP', label: 'Cam App' },
	{ id: 'MEASURE_ASSIGN_CIE', label: 'CIE' },
	{ id: 'MEASURE_ASSIGN_DATALIST', label: 'Datalist' },
	{ id: 'MEASURE_ASSIGN_DIAMOND', label: 'Diamond' },
	{ id: 'MEASURE_ASSIGN_DOLBY_STATUS', label: 'Dolby Status' },
	{ id: 'MEASURE_ASSIGN_ERROR_STATUS', label: 'Event Log' },
	{ id: 'MEASURE_ASSIGN_EXTREF', label: 'External Reference' },
	{ id: 'MEASURE_ASSIGN_EYE', label: 'Eye' },
	{ id: 'MEASURE_ASSIGN_IP_GEN_STATUS', label: 'IP Generator' },
	{ id: 'MEASURE_ASSIGN_IP_GRAPHS', label: 'IP Graphs' },
	{ id: 'MEASURE_ASSIGN_IP_SESSION', label: 'IP Session' },
	{ id: 'MEASURE_ASSIGN_IP_STATUS', label: 'IP Status' },
	{ id: 'MEASURE_ASSIGN_JITTER', label: 'Jitter' },
	{ id: 'MEASURE_ASSIGN_LIGHTNING', label: 'Lightning' },
	{ id: 'MEASURE_ASSIGN_PICTURE', label: 'Picture' },
	{ id: 'MEASURE_ASSIGN_IP_PIT', label: 'PIT Histogram' },
	{ id: 'MEASURE_ASSIGN_PTP_GRAPHS', label: 'PTP Graphs' },
	{ id: 'MEASURE_ASSIGN_GEN_STATUS', label: 'SDI Generator' },
	{ id: 'MEASURE_ASSIGN_FSTOP', label: 'Stop Display' },
	{ id: 'MEASURE_ASSIGN_SYNC_DISPLAY', label: 'Stream Timing' },
	{ id: 'MEASURE_ASSIGN_TIMING_DISPLAY', label: 'Timing' },
	{ id: 'MEASURE_ASSIGN_VECTOR', label: 'Vector' },
	{ id: 'MEASURE_ASSIGN_VIDEO_SESSION', label: 'Video Session' },
	{ id: 'MEASURE_ASSIGN_WAVEFORM', label: 'Waveform' },
]

export const lineSelectEnableChoices = [
	{ id: 'MEASURE_LINE_SELECT_ENABLE_OFF', label: 'Off' },
	{ id: 'MEASURE_LINE_SELECT_ENABLE_ON', label: 'On' },
]

export const measureBarTargetChoices = [
	{ id: 'MEASURE_BAR_TARGET_75', label: '75%' },
	{ id: 'MEASURE_BAR_TARGET_100', label: '100%' },
]

export const measureTileModeChoices = [
	{ id: 'MEASURE_TILE_MODE_QUARTER_TILE', label: 'Quarter Tile' },
	{ id: 'MEASURE_TILE_MODE_TWO_TILE_VERTICAL', label: 'Two Tile Vertical' },
]

export const nmosDiscoveryChoices = [
	{ id: 'NMOS_MANAGER_ENABLE_DISABLED', label: 'Disabled' },
	{ id: 'NMOS_MANAGER_ENABLE_ENABLED', label: 'Enabled' },
]

export const nmosDnsTypeChoices = [
	{ id: 'NMOS_DNS_TYPE_UNICAST', label: 'Unicast' },
	{ id: 'NMOS_DNS_TYPE_MULTICAST', label: 'Multicast' },
	{ id: 'NMOS_DNS_TYPE_AUTO', label: 'Auto' },
]

export const nmosApiVersion = [
	{ id: 'NMOS_API_VERSION_1P2', label: 'V 1.2' },
	{ id: 'NMOS_API_VERSION_1P3', label: 'V 1.3' },
]

export const nmosPersistentReceiversChoices = [
	{ id: 'NMOS_MANAGER_PERSISTENT_RECEIVERS_DISABLED', label: 'Disabled' },
	{ id: 'NMOS_MANAGER_PERSISTENT_RECEIVERS_ENABLED', label: 'Enabled' },
]

export const jitterHpfChoices = [
	{ id: 0, label: 'Timing' },
	{ id: 1, label: 'Alignment' },
	{ id: 2, label: '10 Hz' },
	{ id: 3, label: '100 Hz' },
	{ id: 4, label: '1 kHz' },
	{ id: 5, label: '10 kHz' },
	{ id: 6, label: '100 kHz' },
]

export const closedCaptionsDisplayChoices = [
	{ id: 'PICTURE_CC_DISPLAY_OFF', label: 'Off' },
	{ id: 'PICTURE_CC_DISPLAY_AUTO', label: 'Auto' },
	{ id: 'PICTURE_CC_DISPLAY_CEA608', label: 'CEA 608' },
	{ id: 'PICTURE_CC_DISPLAY_CEA708', label: 'CEA 708' },
	{ id: 'PICTURE_CC_DISPLAY_WST', label: 'WST' },
	{ id: 'PICTURE_CC_DISPLAY_ARIB', label: 'ARIB' },
]

export const pictureSafeChoices = [
	{ id: 'PICTURE_SAFE_GRAT_OFF', label: 'Off' },
	{ id: 'PICTURE_SAFE_GRAT_AUTO', label: 'Auto' },
	{ id: 'PICTURE_SAFE_GRAT_4X3', label: '4 x 3' },
	{ id: 'PICTURE_SAFE_GRAT_14X9', label: '14 x 9' },
	{ id: 'PICTURE_SAFE_GRAT_16X9', label: '16 x 9' },
	{ id: 'PICTURE_SAFE_GRAT_CUSTOM_1', label: 'Custom 1' },
	{ id: 'PICTURE_SAFE_GRAT_CUSTOM_2', label: 'Custom 2' },
]

export const pictureCenterGratChoices = [
	{ id: 'PICTURE_GRAT_CENTER_OFF', label: 'Off' },
	{ id: 'PICTURE_GRAT_CENTER_ON', label: 'On' },
]

export const closedCaptions608ChannelChoices = [
	{ id: 'PICTURE_CC_SERVICE_608_CC1', label: '1' },
	{ id: 'PICTURE_CC_SERVICE_608_CC2', label: '2' },
	{ id: 'PICTURE_CC_SERVICE_608_CC3', label: '3' },
	{ id: 'PICTURE_CC_SERVICE_608_CC4', label: '4' },
]

export const closedCaptions708ServiceChoices = [
	{ id: 'PICTURE_CC_SERVICE_708_SVC1', label: '1' },
	{ id: 'PICTURE_CC_SERVICE_708_SVC2', label: '2' },
	{ id: 'PICTURE_CC_SERVICE_708_SVC3', label: '3' },
	{ id: 'PICTURE_CC_SERVICE_708_SVC4', label: '4' },
	{ id: 'PICTURE_CC_SERVICE_708_SVC5', label: '5' },
	{ id: 'PICTURE_CC_SERVICE_708_SVC6', label: '6' },
]

export const closedCaptionsAribTypeChoices = [
	{ id: 'PICTURE_CC_ARIB_B37_TYPE_HD', label: 'HD' },
	{ id: 'PICTURE_CC_ARIB_B37_TYPE_SD', label: 'SD' },
	{ id: 'PICTURE_CC_ARIB_B37_TYPE_MOBILE', label: 'Mobile' },
]

export const pictureAfdGratChoices = [
	{ id: 'PICTURE_AFD_GRAT_OFF', label: 'Off' },
	{ id: 'PICTURE_AFD_GRAT_ON', label: 'On' },
]

export const pictureAfdGratOverlayChoices = [
	{ id: 'PICTURE_AFD_GRAT_OVERLAY_OFF', label: 'Off' },
	{ id: 'PICTURE_AFD_GRAT_OVERLAY_ON', label: 'On' },
]

export const pictureLutChoices = [
	{ id: 'PICTURE_LUT_OFF', label: 'Off' },
	{ id: 'PICTURE_LUT_ON', label: 'On' },
]

export const pictureFormatOverlayChoices = [
	{ id: 'PICTURE_TIMING_INFO_SWITCH_OFF', label: 'Off' },
	{ id: 'PICTURE_TIMING_INFO_SWITCH_ON', label: 'On' },
]

export const pictureFalseColorGamutModeChoices = [
	{ id: 'PICTURE_OUTSIDE_709_MODE_709_P3', label: '709 - P3' },
	{ id: 'PICTURE_OUTSIDE_709_MODE_P3_2020', label: 'P3 - 2020' },
	{ id: 'PICTURE_OUTSIDE_709_MODE_709_P3_2020', label: 'Both' },
]

export const pictureFalseColorChoices = [
	{ id: 'PICTURE_FALSE_COLOR_OFF', label: 'Off' },
	{ id: 'PICTURE_FALSE_COLOR_ON', label: 'On' },
]

export const pictureFalseColorModeChoices = [
	{ id: 'FALSE_COLOR_MODE_LUMA', label: 'Luma' },
	{ id: 'FALSE_COLOR_MODE_AREA', label: 'Area' },
	{ id: 'FALSE_COLOR_MODE_GAMUT', label: 'Gamut' },
]

export const pictureFalseColorBandMeterChoices = [
	{ id: 'PICTURE_FALSE_COLOR_BAND_METER_HIDE', label: 'Hide' },
	{ id: 'PICTURE_FALSE_COLOR_BAND_METER_SHOW', label: 'Show' },
]

export const closedCaptionsInfoEnableChoices = [
	{ id: 'PICTURE_CC_INFO_SWITCH_OFF', label: 'Off' },
	{ id: 'PICTURE_CC_INFO_SWITCH_ON', label: 'On' },
]

export const sourceIdDisplayChoices = [
	{ id: 'PICTURE_SOURCE_ID_INFO_ENABLE_OFF', label: 'Off' },
	{ id: 'PICTURE_SOURCE_ID_INFO_ENABLE_ON', label: 'On' },
]

export const pictureAspectRatioChoices = [
	{ id: 'PICTURE_ASPECT_RATIO_AUTO', label: 'Auto' },
	{ id: 'PICTURE_ASPECT_RATIO_16x9', label: '16 x 9' },
]

export const presetRecallSavedInputsChoices = [
	{ id: 'PRESET_RECALL_SAVED_INPUTS_OFF', label: 'Off' },
	{ id: 'PRESET_RECALL_SAVED_INPUTS_ON', label: 'On' },
]

export const presetEditModeChoices = [
	{ id: 'PRESET_EDIT_MODE_OFF', label: 'Off' },
	{ id: 'PRESET_EDIT_MODE_ON', label: 'On' },
]

export const ptpProfileChoices = [
	{ id: 'PTP_PROFILE_2059', label: 'ST 2059' },
	{ id: 'PTP_PROFILE_AES67', label: 'AES 67' },
	{ id: 'PTP_PROFILE_GENERIC', label: 'Generic' },
]

export const ptpCommMode2059ProfileChoices = [
	{ id: 'PTP_COMM_MODE_MULTICAST', label: 'Multicast' },
	{ id: 'PTP_COMM_MODE_MIXED_SMPTE_NO_NEG', label: 'Mixed SMPTE No Neg' },
]

export const snmpTrapEnableChoices = [
	{ id: 'SNMP_TRAP_ENABLE_OFF', label: 'Off' },
	{ id: 'SNMP_TRAP_ENABLE_ON', label: 'On' },
]

export const timingMeasureModeChoices = [
	{ id: 'STATUS_TIMING_MEASURE_MODE_VIDEO_TO_REF', label: 'Video to Reference' },
	{ id: 'STATUS_TIMING_MEASURE_MODE_ANALOG_TO_PTP', label: 'Analog to PTP' },
]

export const extendedStatusBarPinnedMenuChoices = [
	{ id: 'TILE_EXTENDED_STATUS_BAR_PINNED_MENU_OFF', label: 'Off' },
	{ id: 'TILE_EXTENDED_STATUS_BAR_PINNED_MENU_INPUT', label: 'Input' },
	{ id: 'TILE_EXTENDED_STATUS_BAR_PINNED_MENU_PRESET', label: 'Preset' },
]

export const cieColorSpaceChoices = [
	{ id: 'TILE_CIE_COLOR_SPACE_1931', label: '1931' },
	{ id: 'TILE_CIE_COLOR_SPACE_1976', label: '1976' },
]

export const cieTraceAppearanceChoices = [
	{ id: 'TILE_CIE_COLOR_TRACE_OFF', label: 'Monochrome' },
	{ id: 'TILE_CIE_COLOR_TRACE_ON', label: 'Color' },
]

export const outOfGamutAlarmChoices = [
	{ id: 'GAMUT_ERROR_CHECK_OFF', label: 'Off' },
	{ id: 'GAMUT_ERROR_CHECK_ON', label: 'On' },
]

export const gamutAlarmThresholdsPresetChoices = [
	{ id: 'GAMUT_ERROR_PRESET_R103', label: 'EBU R103 Preferred Min/Max' },
]

export const hdrAlarmsChoices = [
	{ id: 'HDR_ALARMS_OFF', label: 'Off' },
	{ id: 'HDR_ALARMS_ON', label: 'On' },
]

export const gratColourChoices = [
	{ id: 'PICTURE_GRAT_COLOR_GRAY', label: 'Gray' },
	{ id: 'PICTURE_GRAT_COLOR_BLACK', label: 'Black' },
	{ id: 'PICTURE_GRAT_COLOR_LIGHT_BLUE', label: 'Light Blue' },
	{ id: 'PICTURE_GRAT_COLOR_MAGENTA', label: 'Magenta' },
	{ id: 'PICTURE_GRAT_COLOR_LIMEGREEN', label: 'Limegreen' },
	{ id: 'PICTURE_GRAT_COLOR_ORANGE', label: 'Orange' },
	{ id: 'PICTURE_GRAT_COLOR_TS_BLUE', label: 'TS Blue' },
	{ id: 'PICTURE_GRAT_COLOR_WHITE', label: 'White' },
	{ id: 'PICTURE_GRAT_COLOR_YELLOW', label: 'Yellow' },
]

export const pictureSafeAreaStdChoices = [
	{ id: 'PICTURE_SAFE_AREA_STD_S2046', label: 'S2046' },
	{ id: 'PICTURE_SAFE_AREA_STD_SMPTE', label: 'SMPTE' },
	{ id: 'PICTURE_SAFE_AREA_STD_ITU', label: 'ITU' },
	{ id: 'PICTURE_SAFE_AREA_STD_ARIB', label: 'ARIB' },
]

export const timecodeOverlayChoices = [
	{ id: 'TILE_UI_TIMECODE_OVERLAY_OFF', label: 'Off' },
	{ id: 'TILE_UI_TIMECODE_OVERLAY_ON', label: 'On' },
]

export const timecodeSelectChoices = [
	{ id: 'OFF', label: 'OFF' },
	{ id: 'LTC', label: 'LTC' },
	{ id: 'VITC', label: 'VITC' },
]

export const timingRefSourceChoices = [
	{ id: 'TIMING_REF_SOURCE_BLACK', label: 'Black' },
	{ id: 'TIMING_REF_SOURCE_PTP', label: 'PTP' },
	{ id: 'TIMING_REF_SOURCE_INTERNAL', label: 'Internal' },
]

export const vectorGainChoices = [
	{ id: 'VECTOR_GAIN_X1', label: 'x1' },
	{ id: 'VECTOR_GAIN_X2', label: 'x2' },
	{ id: 'VECTOR_GAIN_X5', label: 'x5' },
	{ id: 'VECTOR_GAIN_X10', label: 'x10' },
]

export const vectorVarEnableChoices = [
	{ id: 'VECTOR_VAR_ENABLE_OFF', label: 'Off' },
	{ id: 'VECTOR_VAR_ENABLE_ON', label: 'On' },
]

export const vectorLutChoices = [
	{ id: 'VECTOR_LUT_OFF', label: 'Off' },
	{ id: 'VECTOR_LUT_ON', label: 'On' },
]

export const vectorIqAxisChoices = [
	{ id: 0, label: 'Off' },
	{ id: 1, label: 'On' },
]

export const vectorSdiCompassRoseChoices = [
	{ id: 0, label: 'Off' },
	{ id: 1, label: 'On' },
]

export const sdiVidOutChoices = [
	{ id: 'VID_OUT_MODE_LOOPOUT', label: 'Loop' },
	{ id: 'VID_OUT_MODE_GEN', label: 'Generator' },
]

export const sdiGenEnableChoices = [
	{ id: 'VID_OUT_SDI_GEN_ENABLE_OFF', label: 'Off' },
	{ id: 'VID_OUT_SDI_GEN_ENABLE_ON', label: 'On' },
]

export const sdiGenVideoMovingPixChoices = [
	{ id: 'VID_OUT_SDI_MOVING_PIX_MODE_OFF', label: 'Off' },
	{ id: 'VID_OUT_SDI_MOVING_PIX_MODE_ON', label: 'On' },
]

export const waveformModeChoices = [
	{ id: 'WAVEFORM_MODE_YPBPR', label: 'YPbPr' },
	{ id: 'WAVEFORM_MODE_RGB', label: 'RGB' },
	{ id: 'WAVEFORM_MODE_YRGB', label: 'YRGB' },
]

export const waveformFilterChoices = [
	{ id: 'WAVEFORM_FILTER_FLAT', label: 'Flat' },
	{ id: 'WAVEFORM_FILTER_LOW_PASS', label: 'Low Pass' },
]

export const waveformSweepChoices = [
	{ id: 16, label: 'Parade style 1 line sweep' },
	{ id: 18, label: 'Parade style 1 field sweep' },
	{ id: 0, label: 'Overlay style 1 line sweep' },
	{ id: 1, label: 'Overlay style 2 line sweep' },
	{ id: 2, label: 'Overlay style 1 field sweep' },
	{ id: 3, label: 'Overlay style 2 field sweep' },
]

export const waveformColorTraceChoices = [
	{ id: 'WAVEFORM_COLOR_TRACE_OFF', label: 'Off' },
	{ id: 'WAVEFORM_COLOR_TRACE_ON', label: 'On' },
]

export const waveformVarEnableChoices = [
	{ id: 'WAVEFORM_VAR_ENABLE_OFF', label: 'Off' },
	{ id: 'WAVEFORM_VAR_ENABLE_ON', label: 'On' },
]

export const waveformHmagChoices = [
	{ id: 0, label: 'Disable' },
	{ id: 1, label: 'Enable' },
]

export const waveformVerticalCursorEnableChoices = [
	{ id: 'WAVEFORM_VERTICAL_CURSOR_ENABLE_OFF', label: 'Off' },
	{ id: 'WAVEFORM_VERTICAL_CURSOR_ENABLE_ON', label: 'On' },
]

export const waveformHorizontalCursorEnableChoices = [
	{ id: 'WAVEFORM_HORIZONTAL_CURSOR_ENABLE_OFF', label: 'Off' },
	{ id: 'WAVEFORM_HORIZONTAL_CURSOR_ENABLE_ON', label: 'On' },
]

export const waveformGratSdiUnits = [
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_MV', label: 'mV' },
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_PERCENT', label: 'Percent' },
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_NITS', label: 'Nits' },
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_REFLECTANCE', label: 'Reflectance' },
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_STOP', label: 'Stop' },
	{ id: 'WAVEFORM_GRAT_SDI_UNITS_CV', label: 'Code Value' },
]

export const waveformLutChoices = [
	{ id: 'WAVEFORM_LUT_OFF', label: 'Off' },
	{ id: 'WAVEFORM_LUT_ON', label: 'On' },
]

export const waveformActiveAreaChoices = [
	{ id: 'WAVEFORM_LUT_OFF', label: 'Off' },
	{ id: 'WAVEFORM_ACTIVE_AREA_ON', label: 'On' },
]

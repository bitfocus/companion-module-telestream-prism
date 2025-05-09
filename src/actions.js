import { Regex } from '@companion-module/base'
import {
	actionOptions,
	activeInputChoices,
	audioSessionControlChoices,
	loudnessSessionControlChoices,
	videoSessionControlChoices,
	ipSessionControlChoices,
	tileSelectChoices,
	tileFullscreenModeChoices,
	tileInFocusChoices,
	audioBallisticChoices,
	loudnessMeteringModeChoices,
	loudnessFullScaleUnitsChoices,
	loudnessTruePeakDcBlockChoices,
	loudnessTruePeakEmphasisChoices,
	loudnessBallisticChoices,
	loudnessShortGatingWindowChoices,
	loudnessLoadPresetChoices,
	audioProgramSurroundOrderChoices,
	dolbyMetadataSourceChoices,
	audioDownmixModeChoices,
	audioSoloModeChoices,
	dolbyDrcModeChoices,
	analogAudioOutputModeChoices,
	audioAuxDisplayModeChoices,
	audioDisplayLoudnessMeterChoices,
	audioSessionDisplayChoices,
	surroundDominanceIndicatorChoices,
	surroundImmersiveDominanceIndicatorChoices,
	surroundBedSelectChoices,
	surroundImmersivePsiBedSelectChoices,
	avdelayUserOffsetModeChoices,
	sdiLoopThroughChoices,
	ipVideoPhyBitRateChoices,
	ipVideoPhyFecModeChoices,
	camappDisplayTypeChoices,
	camappGainChoices,
	camappSweepChoices,
	camappFilterChoices,
	camappThumbnailChoices,
	camappGraticuleUnitsChoices,
	diagnosticUrlPresetChoices,
	extendedDisplayModeChoices,
	diamondModeChoices,
	diamondLutChoices,
	mpiLedColorChoices,
	extrefSweepChoices,
	extrefGainChoices,
	extrefHmagChoices,
	eyeMeterEnableChoices,
	eyeSweepChoices,
	fpTestModeChoices,
	stopSweepChoices,
	stopColorTraceChoices,
	stopEnableBestGainChoices,
	stopHmagChoices,
	stopActiveAreaChoices,
	stopGammaReferenceChoices,
	stopEnableLowPassFilterChoices,
	gpioPresetRecallEnableChoices,
	audioPairAuxOutModeChoices,
	sourceConfigVidLinksChoices,
	sourceConfigColorimetryChoices,
	sourceConfigEotfChoices,
	audioInputTypeChoices,
	audioPcmProgramChoices,
	xmitMode2110Choices,
	remoteConfigModeChoices,
	inputEditModeChoices,
	extRefOutChoices,
	ipFastSwitchEnableChoices,
	ignoreRtpSequenceErrorChoices,
	jitterMeterEnableChoices,
	jitterSweepChoices,
	lightningVerticalVarEnableChoices,
	lightningHorizontalVarEnableChoices,
	lightningLutChoices,
	measureAssignChoices,
	lineSelectEnableChoices,
	measureBarTargetChoices,
	measureTileModeChoices,
	nmosDiscoveryChoices,
	nmosDnsTypeChoices,
	nmosApiVersion,
	nmosPersistentReceiversChoices,
	jitterHpfChoices,
	closedCaptionsDisplayChoices,
	pictureSafeChoices,
	pictureCenterGratChoices,
	closedCaptions608ChannelChoices,
	closedCaptions708ServiceChoices,
	closedCaptionsAribTypeChoices,
	pictureAfdGratChoices,
	pictureAfdGratOverlayChoices,
	pictureLutChoices,
	pictureFormatOverlayChoices,
	pictureFalseColorChoices,
	pictureFalseColorBandMeterChoices,
	closedCaptionsInfoEnableChoices,
	sourceIdDisplayChoices,
	pictureAspectRatioChoices,
	presetRecallSavedInputsChoices,
	presetEditModeChoices,
	ptpProfileChoices,
	ptpCommMode2059ProfileChoices,
	snmpTrapEnableChoices,
	timingMeasureModeChoices,
	extendedStatusBarPinnedMenuChoices,
	cieColorSpaceChoices,
	cieTraceAppearanceChoices,
	outOfGamutAlarmChoices,
	gamutAlarmThresholdsPresetChoices,
	hdrAlarmsChoices,
	gratColourChoices,
	pictureSafeAreaStdChoices,
	timecodeOverlayChoices,
	timecodeSelectChoices,
	timingRefSourceChoices,
	vectorGainChoices,
	vectorVarEnableChoices,
	vectorLutChoices,
	vectorIqAxisChoices,
	vectorSdiCompassRoseChoices,
	sdiVidOutChoices,
	sdiGenEnableChoices,
	sdiGenVideoMovingPixChoices,
	waveformModeChoices,
	waveformFilterChoices,
	waveformSweepChoices,
	waveformColorTraceChoices,
	waveformVarEnableChoices,
	waveformHmagChoices,
	waveformVerticalCursorEnableChoices,
	waveformHorizontalCursorEnableChoices,
	waveformGratSdiUnits,
	waveformLutChoices,
	waveformActiveAreaChoices,
} from './choices.js'

async function parseTileScope(options, self, context) {
	const scope = await context.parseVariablesInString(options.scope)
	return scope == 'focus' ? `tile${self.prism.tileInFocus}` : scope
}

export default function (self) {
	self.setActionDefinitions({
		activeInput: {
			name: 'Active Input',
			description: `Change the unit's active input`,
			learnTimeout: 10000,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'set',
					choices: activeInputChoices,
				},
				{
					...actionOptions.modeDropdown,
					id: 'input',
					label: 'Input',
					choices: self.prism.input_list,
					default: self.prism.input_list[0].id,
					allowCustom: false,
					isVisible: (options) => {
						return options.useVar === false && options.action == 'set'
					},
				},
				{
					...actionOptions.modeVar,
					id: 'inputVar',
					label: 'Input',
					isVisible: (options) => {
						return options.useVar === true && options.action == 'set'
					},
					tooltip: 'Varible must return an integer between 0 and 5',
				},
				{
					...actionOptions.useVar,
					isVisible: (options) => {
						return options.action == 'set'
					},
				},
			],
			callback: async ({ options }, context) => {
				let prismInput
				switch (options.action) {
					case 'set':
						prismInput = options.useVar
							? parseInt(await context.parseVariablesInString(options.inputVar))
							: parseInt(options.input)
						break
					case 'inc':
						prismInput = self.prism.input >= 5 ? 0 : self.prism.input + 1
						break
					case 'dec':
						prismInput = self.prism.input <= 0 ? 5 : self.prism.input - 1
						break
					case 'get':
						self.getInput()
						return
				}
				if (isNaN(prismInput) || prismInput < 0 || prismInput > 5) {
					self.log('warn', `input out of range ${prismInput}`)
					return undefined
				}
				const result = await self.postCommand('/activeinput', { input: prismInput })
				if (result) await self.getInput()
				return result
			},
			learn: async (action) => {
				const newInput = await self.getInput()
				if (newInput === undefined) {
					return undefined
				}
				return {
					...action.options,
					input: newInput,
				}
			},
			subscribe: async () => {
				await self.getInput()
			},
		},
		getPresets: {
			name: 'Get Presets',
			description: `Get list of presets`,
			options: [],
			callback: async () => {
				return await self.getPresets()
			},
			subscribe: async () => {
				await self.getPresets()
			},
		},
		loadPreset: {
			name: 'Load Preset',
			description: `Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]". Or recall Factory Preset by sending "factory"`,
			options: [
				{
					id: 'preset',
					type: 'dropdown',
					label: 'Preset',
					default: self.prism.presets[0].id,
					choices: self.prism.presets,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]"',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loadpreset', { string: await context.parseVariablesInString(options.preset) })
			},
			subscribe: async () => {
				await self.getPresets()
			},
		},
		ancSessionControl: {
			name: 'ANC Session Control',
			description: `Reset anc session`,
			options: [],
			callback: async () => {
				return await self.postCommand('/anc_session_control', { ints: ['ANC_ENGINE_SESSION_CONTROL_RESET'] })
			},
		},
		audioSessionControl: {
			name: 'Audio Session Control',
			description: `Stop, Run or Reset the audio session`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: audioSessionControlChoices[0].id,
					choices: audioSessionControlChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AUDIO_SESSION_CONTROL_STOP, AUDIO_SESSION_CONTROL_RUN, AUDIO_SESSION_CONTROL_RESET',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/audio_session_control', {
					ints: [await context.parseVariablesInString(options.action)],
				})
			},
		},
		loudnessSessionControl: {
			name: 'Loudness Session Control',
			description: `Stop, Run or Reset the loudness session`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: loudnessSessionControlChoices[0].id,
					choices: loudnessSessionControlChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: LOUDNESS_SESSION_CONTROL_STOP, LOUDNESS_SESSION_CONTROL_RUN, LOUDNESS_SESSION_CONTROL_RESET',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_session_control', {
					ints: [await context.parseVariablesInString(options.action)],
				})
			},
		},
		videoSessionControl: {
			name: 'Video Session Control',
			description: `Stop, Run or Reset the video session`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: videoSessionControlChoices[0].id,
					choices: videoSessionControlChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IOSLAVE_SESSION_CONTROL_STOP, IOSLAVE_SESSION_CONTROL_RUN, IOSLAVE_SESSION_CONTROL_RESET',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/video_session_control', {
					ints: [await context.parseVariablesInString(options.action)],
				})
			},
		},
		ipSessionControl: {
			name: 'IP Session Control',
			description: `Stop, Run or Reset the IP session`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: ipSessionControlChoices[0].id,
					choices: ipSessionControlChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IOSLAVE_SESSION_CONTROL_STOP, IOSLAVE_SESSION_CONTROL_RUN, IOSLAVE_SESSION_CONTROL_RESET',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/ip_session_control', {
					ints: [await context.parseVariablesInString(options.action)],
				})
			},
		},
		tileSelect: {
			name: 'Tile Select',
			description: `Select a tile to expand to full screen`,
			options: [
				{
					...actionOptions.modeDropdown,
					id: 'tile',
					label: 'Tile',
					default: tileSelectChoices[0].id,
					choices: tileSelectChoices,
					tooltip: 'Variable must return an integer between 0 and 8.',
				},
			],
			callback: async ({ options }, context) => {
				const tile = parseInt(await context.parseVariablesInString(options.tile))
				if (isNaN(tile) || tile < 0 || tile > 8) {
					self.log('warn', `An out of range variable has been passed to Tile Select: ${tile}`)
					return undefined
				}
				return await self.postCommand('/tile_select', { ints: [tile] })
			},
		},
		tileFullscreenMode: {
			name: 'Tile Fullscreen Mode',
			description: `Set the mode of fullscreen for the secondary display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: tileFullscreenModeChoices[0].id,
					choices: tileFullscreenModeChoices,
					tooltip: 'Options: TILE_FULLSCREEN_MODE_NORMAL, TILE_FULLSCREEN_MODE_EXTENDED',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/tile_fullscreen_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		tileInFocus: {
			name: 'Tile In Focus',
			description: `Select a tile to set the context of the application menu. If the application menu is open, a colored ring will appear around the selected tile`,
			options: [
				{
					...actionOptions.modeDropdown,
					id: 'tile',
					label: 'Tile',
					default: tileInFocusChoices[0].id,
					choices: tileInFocusChoices,
					tooltip: 'Variable must return an integer between 1 and 8.',
				},
			],
			callback: async ({ options }, context) => {
				let tile = parseInt(await context.parseVariablesInString(options.tile))
				if (isNaN(tile) || tile < 1 || tile > 8) {
					self.log('warn', `An out of range variable has been passed to Tile In Focus: ${tile}`)
					return undefined
				}
				const response = await self.postCommand('/tile_in_focus', { ints: [tile] })
				if (
					response === undefined ||
					response.data === undefined ||
					response.data.ints === undefined ||
					!Array.isArray(response.data.ints)
				) {
					self.log('warn', 'tile_in_focus response contains no data')
					return undefined
				}
				if (response.data.ints.length == 1 && !isNaN(parseInt(response.data.ints[0]))) {
					let varList = []
					self.prism.tileInFocus = parseInt(response.data.ints[0])
					varList['tileInFocus'] = self.prism.tileInFocus
					self.setVariableValues(varList)
					self.checkFeedbacks('tileInFocus')
					return self.prism.input
				} else {
					self.log('warn', 'tile_in_focus returned a NaN or unexpected  length')
					return undefined
				}
			},
			learn: async (action) => {
				const newTile = await self.getTileInFocus()
				if (newTile === undefined) {
					return undefined
				}
				return {
					...action.options,
					tile: newTile,
				}
			},
		},
		audioBallistic: {
			name: 'Audio Ballistic',
			description: `Ballistic Type for Audio Bars`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Ballistic Mode',
					default: audioBallisticChoices[0].id,
					choices: audioBallisticChoices,
					tooltip: 'Available Options: AUDIO_BALLISTIC_PPM_1, AUDIO_BALLISTIC_PPM_2, AUDIO_BALLISTIC_TRUE_PEAK.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/audio_ballistic', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessMeteringMode: {
			name: 'Loudness Metering Mode',
			description: `The mode defines which weighting function and gating techniques are used when loudness metering is performed`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Loudness Metering Mode',
					default: loudnessMeteringModeChoices[0].id,
					choices: loudnessMeteringModeChoices,
					tooltip:
						'Available options are: LOUDNESS_METER_MODE_1770_2_DI, LOUDNESS_METER_MODE_1770_1_DI, LOUDNESS_METER_MODE_1770_2, LOUDNESS_METER_MODE_LEQA_DI',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_metering_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessFullScaleUnits: {
			name: 'Loudness Full Scale Unit',
			description: `Full scale unit selection for Loudness Auxiliary Display`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Full Scale Units',
					default: loudnessFullScaleUnitsChoices[0].id,
					choices: loudnessFullScaleUnitsChoices,
					tooltip: 'Available options are: LOUDNESS_FULL_SCALE_UNITS_LUFS, LOUDNESS_FULL_SCALE_UNITS_LKFS',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_full_scale_units', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessTruePeakDcBlock: {
			name: 'Loudness True Peak DC Blocking Filter',
			description: `Boolean indicating whether the DC Blocking filter is used for true‐peak measurements`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'DC Blocking Mode',
					default: loudnessTruePeakDcBlockChoices[0].id,
					choices: loudnessTruePeakDcBlockChoices,
					tooltip: 'Available options are: TRUE_PEAK_DC_BLOCK_OFF, TRUE_PEAK_DC_BLOCK_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_true_peak_dc_block', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessTruePeakEmphasis: {
			name: 'Loudness True Peak Emphasis',
			description: `Boolean indicating whether the emphasis filter is used for true-peak measurements`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Emphasis',
					default: loudnessTruePeakEmphasisChoices[0].id,
					choices: loudnessTruePeakEmphasisChoices,
					tooltip: 'Available options are: TRUE_PEAK_EMPHASIS_OFF, TRUE_PEAK_EMPHASIS_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_true_peak_emphasis', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessBallistic: {
			name: 'Loudness Ballistic',
			description: `Selection for Program Loudness Bar Ballistic type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Emphasis',
					default: loudnessBallisticChoices[0].id,
					choices: loudnessBallisticChoices,
					tooltip:
						'Available options are: LOUDNESS_BALLISTIC_SHORT_AVERAGE, LOUDNESS_BALLISTIC_LONG_AVERAGE, LOUDNESS_BALLISTIC_EBU_R128_M',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_ballistic', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessShortGatingWindow: {
			name: 'Loudness Short Gating Window',
			description: `Set the duration of the Short Term Loudness Gating window`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Gating Window',
					default: loudnessShortGatingWindowChoices[0].id,
					choices: loudnessShortGatingWindowChoices,
					tooltip:
						'Available options are: LOUDNESS_SHORT_GATING_WINDOW_EBU_R128_3S, LOUDNESS_SHORT_GATING_WINDOW_LEGACY_10S',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_short_gating_window', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessLoadPreset: {
			name: 'Loudness Load Preset',
			description: `Load a predefined Loudness Meter Configuration preset`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Preset',
					default: loudnessLoadPresetChoices[0].id,
					choices: loudnessLoadPresetChoices,
					tooltip: 'Available Option: LOUDNESS_PRESET_EBU_R128_2014, LOUDNESS_PRESET_ATSC_A85_2013',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/loudness_load_preset', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioProgramSurroundOrder: {
			name: 'Audio Program Surround Order',
			description: `Select audio program surround order`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Gating Window',
					default: audioProgramSurroundOrderChoices[0].id,
					choices: audioProgramSurroundOrderChoices,
					tooltip: 'Available Options: AUDIO_PROGRAM_SURROUND_ORDER_LRC, AUDIO_PROGRAM_SURROUND_ORDER_LCR',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/audio_program_surround_order', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		dolbyMetadataSource: {
			name: 'Dolby Metadata Source',
			description: `Dolby metadata source selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Metadata Source',
					default: dolbyMetadataSourceChoices[0].id,
					choices: dolbyMetadataSourceChoices,
					tooltip:
						'Available options are DOLBY_METADATA_SOURCE_AUTO, DOLBY_METADATA_SOURCE_AES and DOLBY_METADATA_SOURCE_VANC',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/dolby_metadata_source', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioDownmixMode: {
			name: 'Audio Downmix Mode',
			description: `Audio Downmix mode selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Downmix Mode',
					default: audioDownmixModeChoices[0].id,
					choices: audioDownmixModeChoices,
					tooltip:
						'Available options are AUDIO_DOWNMIX_MODE_LO_RO, AUDIO_DOWNMIX_MODE_LT_RT and AUDIO_DOWNMIX_MODE_MONO',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/audio_downmix_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioSoloMode: {
			name: 'Audio Solo Mode',
			description: `Set solo display mode for the Audio App`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioSoloModeChoices[0].id,
					choices: audioSoloModeChoices,
					tooltip:
						'Options: AUDIO_SOLO_MUTE_MODE_SOLO_ON : Enables solo display, AUDIO_SOLO_MUTE_MODE_OFF : Disables solo display',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/audio_solo_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		dolbyDrcMode: {
			name: 'Dolby DRC Mode',
			description: `Dolby D DRC compression mode selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: dolbyDrcModeChoices[0].id,
					choices: dolbyDrcModeChoices,
					tooltip: 'Available options: AUDIO_DOLBY_DRC_MODE_OFF, AUDIO_DOLBY_DRC_MODE_LINE and AUDIO_DOLBY_DRC_MODE_RF',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/dolby_drc_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		analogAudioOutputMode: {
			name: 'Analog Audio Output Mode',
			description: `Channels selection mode for Analog audio output`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: analogAudioOutputModeChoices[0].id,
					choices: analogAudioOutputModeChoices,
					tooltip: 'Options are ANALOG_AUDIO_OUT_DISCRETE_CHANNELS and ANALOG_AUDIO_OUT_DOWNMIX',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand('/analog_audio_output_mode', {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioAuxDisplayMode: {
			name: 'Analog Aux Display Mode',
			description: `Set audio auxiliary display mode for the Audio App`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioAuxDisplayModeChoices[0].id,
					choices: audioAuxDisplayModeChoices,
					tooltip:
						'Options: AUDIO_AUX_DISPLAY_MODE_NONE : No Aux Display, AUDIO_AUX_DISPLAY_MODE_LISSAJOUS : Phase Display, AUDIO_AUX_DISPLAY_MODE_SURROUND : Surround Display, AUDIO_AUX_DISPLAY_MODE_LOUD : Loudness Display',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_aux_display_mode/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioDisplayLoudnessMeter: {
			name: 'Audio Display Loudness Meter',
			description: `Enable/disable audio Loudness meter`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioDisplayLoudnessMeterChoices[0].id,
					choices: audioDisplayLoudnessMeterChoices,
					tooltip: 'Options: AUDIO_DISPLAY_LOUDNESS_METER_OFF to Disable, AUDIO_DISPLAY_LOUDNESS_METER_ON to Enable',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_display_loudness_meter/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioSessionDisplay: {
			name: 'Audio Session Display',
			description: `Enable/disable audio session display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioSessionDisplayChoices[0].id,
					choices: audioSessionDisplayChoices,
					tooltip: 'Options: AUDIO_SESSION_DISPLAY_OFF to Disable, AUDIO_SESSION_DISPLAY_ON to Enable',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_session_display/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		surroundDominanceIndicator: {
			name: 'Surround Dominance Indicator',
			description: `Enable/disable audio surround dominance indicator`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: surroundDominanceIndicatorChoices[0].id,
					choices: surroundDominanceIndicatorChoices,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_DOMINANCE_OFF to Disable, AUDIO_DISPLAY_SURROUND_DOMINANCE_ON to Enable.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/surround_dominance_indicator/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		surroundImmersiveDominanceIndicator: {
			name: 'Surround Immersive Dominance Indicator',
			description: `Enable/disable audio surround immersive dominance indicator`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: surroundImmersiveDominanceIndicatorChoices[0].id,
					choices: surroundImmersiveDominanceIndicatorChoices,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_OFF to Disable, AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_ON to Enable.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/surround_immersive_dominance_indicator/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		surroundBedSelect: {
			name: 'Surround Bed Select',
			description: `Select required surround sound bed`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: surroundBedSelectChoices[0].id,
					choices: surroundBedSelectChoices,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_BED_SELECT_MAIN to display only main bed, AUDIO_DISPLAY_SURROUND_BED_SELECT_UPPER to display only upper bed, AUDIO_DISPLAY_SURROUND_BED_SELECT_BOTH to display both.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/surround_bed_select/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		surroundImmersivePsiBedSelect: {
			name: 'Surround Immersive PSI Bed Select',
			description: `Select required PSI Bed`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: surroundImmersivePsiBedSelectChoices[0].id,
					choices: surroundImmersivePsiBedSelectChoices,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_MAIN to display only main bed PSI, AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_UPPER to display only upper bed PSI.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/surround_immersive_psi_bed_select/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		avdelayUserOffsetMode: {
			name: 'AV Delay User Offset Mode',
			description: `Apply User Offset to Audio Video Measurement`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: avdelayUserOffsetModeChoices[0].id,
					choices: avdelayUserOffsetModeChoices,
					tooltip: 'Options: AVDELAY_USER_OFFSET_MODE_OFF, AVDELAY_USER_OFFSET_MODE_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/avdelay_user_offset_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		sdiLoopThrough: {
			name: 'SDI Loop Through',
			description: `Enables or Disables SDI loop through functionality`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sdiLoopThroughChoices[0].id,
					choices: sdiLoopThroughChoices,
					tooltip: `Available options: MEDIA_MODE_IP_2_IN for turning loop through 'On' and MEDIA_MODE_IP_4_IN for turning loop through 'Off'`,
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/sdi_loop_through`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ipVideoPhyBitRate: {
			name: 'IP Video PHY Bit Rate',
			description: `Select the Ethernet bit rate of the IP video ports in Gbps. Setting the bit rate for one port affects both ports`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: ipVideoPhyBitRateChoices[0].id,
					choices: ipVideoPhyBitRateChoices,
					tooltip: 'Valid values are 10 or 25 for MPI-25 and MPX-25 systems.',
				},
				actionOptions.ip,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || (mode !== 10 && mode !== 25)) {
					this.log('warn', `IP Video PHY Bite Rate Mode passed out of range value: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/ip_video_phy_bit_rate/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		ipVideoPhyFecMode: {
			name: 'IP Video PHY FEC Mode',
			description: `Enable Ethernet FEC on IP video ports when configured for 25 Gbps. FEC mode is ignored when IP video ports configured for 10 Gbps bit rate. Setting the FEC mode for one port affects both ports`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: ipVideoPhyFecModeChoices[0].id,
					choices: ipVideoPhyFecModeChoices,
					tooltip: 'Options: BD_IFC_IP_VIDEO_PHY_FEC_MODE_BYPASS, BD_IFC_IP_VIDEO_PHY_FEC_MODE_ENABLE.',
				},
				actionOptions.ip,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ip_video_phy_fec_mode/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappDisplayType: {
			name: 'Cam App Display Type',
			description: `Set display type of CAM App traces`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: camappDisplayTypeChoices[0].id,
					choices: camappDisplayTypeChoices,
					tooltip: 'Options: CAMAPP_DISPLAY_TYPE_WAVEFORM and CAMAPP_DISPLAY_TYPE_STOP',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_display_type/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappGain: {
			name: 'Cam App Gain',
			description: `Set the fixed gain for CAM App traces`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Gain',
					default: camappGainChoices[0].id,
					choices: camappGainChoices,
					tooltip: 'Options: CAMAPP_GAIN_X1, CAMAPP_GAIN_X2, CAMAPP_GAIN_X5 and CAMAPP_GAIN_X10.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_gain/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappSweep: {
			name: 'Cam App Sweep',
			description: `Set the sweep for CAM App traces`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Sweep',
					default: camappSweepChoices[0].id,
					choices: camappSweepChoices,
					tooltip: 'Options: CAMAPP_SWEEP_1_LINE and CAMAPP_SWEEP_1_FIELD.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_sweep/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappFilter: {
			name: 'Cam App Filter',
			description: `Select the filter to be applied to the video - Flat or Low Pass`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Filter',
					default: camappFilterChoices[0].id,
					choices: camappFilterChoices,
					tooltip: 'Options: CAMAPP_FILTER_FLAT and CAMAPP_FILTER_LOW_PASS.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_filter/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappThumbnail: {
			name: 'Cam App Thumbnail',
			description: `Control Thumbnail display in CAM App`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Thumbnail',
					default: camappThumbnailChoices[0].id,
					choices: camappThumbnailChoices,
					tooltip: 'Options: CAMAPP_THUMBNAIL_ON, CAMAPP_THUMBNAIL_OFF.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_thumbnail/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		camappGraticuleUnits: {
			name: 'Cam App Graticle Units',
			description: `Set graticule units for CAM App traces. Options depend on the selected display type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Units',
					default: camappGraticuleUnitsChoices[0].id,
					choices: camappGraticuleUnitsChoices,
					tooltip:
						'Options for Waveform display type: CAMAPP_GRAT_UNITS_PERCENT, CAMAPP_GRAT_UNITS_NITS and CAMAPP_GRAT_UNITS_STOP. Options for Stop display type: CAMAPP_GRAT_UNITS_LOG_NITS and CAMAPP_GRAT_UNITS_LOG_STOP.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/camapp_graticule_units/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		diagnosticUrlPreset: {
			name: 'Diagnostic URL Preset',
			description: `Navigate to preset URL`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'URL',
					default: diagnosticUrlPresetChoices[0].id,
					choices: diagnosticUrlPresetChoices,
					tooltip:
						'Options: COMPOSITOR_URL_HOME, COMPOSITOR_URL_TOUCH_TEST, COMPOSITOR_URL_RED, COMPOSITOR_URL_GREEN, COMPOSITOR_URL_BLUE, COMPOSITOR_URL_GRAY20, COMPOSITOR_URL_GRAY45, COMPOSITOR_URL_BLACK, COMPOSITOR_URL_WHITE',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/diagnostic_url_preset`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		extendedDisplayMode: {
			name: 'Extended Display Mode',
			description: `Set the display mode for single or dual display mode. Dual display mode requires the secondary display to be plugged into the DP2 port`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: extendedDisplayModeChoices[0].id,
					choices: extendedDisplayModeChoices,
					tooltip: 'Options: COMPOSITOR_DISPLAY_MODE_SINGLE, COMPOSITOR_DISPLAY_MODE_DOUBLE',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/extended_display_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		diamondMode: {
			name: 'Diamond Mode',
			description: `Diamond display mode - normal or split`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: diamondModeChoices[0].id,
					choices: diamondModeChoices,
					tooltip: 'Options: 0 for normal diamond, 1 for split diamond.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode || mode < 0 || mode > 1)) {
					self.log('warn', `Dimond Mode out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/diamond_mode/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		diamondLut: {
			name: 'Diamond LUT',
			description: `Diamond 3D Lut On or Off`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: diamondLutChoices[0].id,
					choices: diamondLutChoices,
					tooltip: 'Options: DIAMOND_LUT_OFF, DIAMOND_LUT_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/diamond_lut/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		mpiLedBrightness: {
			name: 'MPI LED Brightness',
			description: `Access LED brightness value`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'brightness',
					label: 'Brightness',
					max: 31,
					tooltip: 'Range: 4-31. Default: 0',
				},
				{
					...actionOptions.modeVar,
					id: 'brightnessVar',
					label: 'Brightness',
					tooltip: 'Varible must return an integer between 0 and 31',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				let brightness = parseInt(options.brightness)
				if (options.useVar) {
					brightness = parseInt(await context.parseVariablesInString(options.brightnessVar))
					if (isNaN(brightness) || brightness < 0 || brightness > 31) {
						self.log('warn', `mpi_led_brightness has been passed an out of range variable: ${brightness}`)
						return undefined
					}
				}
				return await self.postCommand(`/mpi_led_brightness`, { ints: [brightness] })
			},
		},
		mpiLedColor: {
			name: 'MPI LED Color',
			description: `Set LED color`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Color',
					default: mpiLedColorChoices[1].id,
					choices: mpiLedColorChoices,
					tooltip:
						'Options: LED_COLOR_OFF, LED_COLOR_GREEN, LED_COLOR_RED, LED_COLOR_YELLOW, LED_COLOR_BLUE, LED_COLOR_CYAN, LED_COLOR_MAGENTA, LED_COLOR_WHITE. Default: LED_COLOR_OFF. Note: LED_COLOR_BLUE, LED_COLOR_CYAN AND LED_COLOR_MAGENTA options are supported on only MPS and MPD devices',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/mpi_led_color`, { ints: await context.parseVariablesInString(options.mode) })
			},
		},
		extrefSweep: {
			name: 'External Reference Sweep',
			description: `Set/Read External Reference Sweep mode`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: extrefSweepChoices[0].id,
					choices: extrefSweepChoices,
					tooltip: '0 for 1 line sweep, 1 for 2 line sweep, 2 for 1 field sweep, 3 for 2 field sweep',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				let mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Sweep Mode out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`//extref_sweep/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		extrefGain: {
			name: 'External Reference Gain',
			description: `Set/Read External Reference Fixed Gain`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Gain',
					default: extrefGainChoices[0].id,
					choices: extrefGainChoices,
					tooltip: 'Options: 1, 2 and 5.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				let mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || (mode !== 1 && mode !== 2 && mode !== 5)) {
					self.log('warn', `ExRef Gain out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/extref_gain/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		extrefHmag: {
			name: 'External Reference Hmag',
			description: `External Reference Hmag & Best View`,
			options: [
				{
					...actionOptions.modeDropdown,
					id: 'hmag',
					label: 'Hmag',
					default: extrefHmagChoices[0].id,
					choices: extrefHmagChoices,
					tooltip: 'Options for Hmag: 0 for Disable, 1 for Enable.',
				},
				{
					...actionOptions.modeDropdown,
					id: 'bestView',
					label: 'Best view',
					default: extrefHmagChoices[0].id,
					choices: extrefHmagChoices,
					tooltip: 'Options for Best View: 0 for Disable, 1 for Enable.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				let hmag = parseInt(await context.parseVariablesInString(options.hmag))
				let bestView = parseInt(await context.parseVariablesInString(options.bestView))
				if (isNaN(hmag) || hmag < 0 || hmag > 1) {
					self.log('warn', `Hmag out of range: ${hmag}`)
					return undefined
				}
				if (isNaN(bestView) || bestView < 0 || bestView > 1) {
					self.log('warn', `Best View out of range: ${bestView}`)
					return undefined
				}
				return await self.postCommand(`/extref_hmag/${await parseTileScope(options, self, context)}`, {
					ints: [hmag, bestView],
				})
			},
		},
		eyeMeterEnable: {
			name: 'Eye Jitter Meter Enable',
			description: `Enable eye jitter meter display.`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: eyeMeterEnableChoices[0].id,
					choices: eyeMeterEnableChoices,
					tooltip: 'Options: 0 for eye display off, 1 for eye display on.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Mode out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/eye_meter_enable/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		eyeSweep: {
			name: 'Eye Sweep Rate',
			description: `Sweep rate for eye pattern display`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Rate',
					default: eyeSweepChoices[0].id,
					choices: eyeSweepChoices,
					tooltip: 'Options: 0 for 3 Eye, 1 for word (10 Eye/20 Eye), 2 for 1 field, 3 for 2 field',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				let mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Rate out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/eye_sweep/${await parseTileScope(options, self, context)}`, { ints: [mode] })
			},
		},
		fpTestMode: {
			name: 'Front Panel Test Mode',
			description: `Used to put the front panel into a diagnostic mode`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: fpTestModeChoices[0].id,
					choices: fpTestModeChoices,
					tooltip: 'Options are: FP_TEST_MODE_NONE, FP_TEST_MODE_BUTTON, FP_TEST_MODE_LED',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/fp_test_mode`, { ints: [await context.parseVariablesInString(options.mode)] })
			},
		},
		stopSweep: {
			name: 'Stop Sweep',
			description: `Set/Read Stop Display Style and Sweep. Setting the sweep to a multi-line or field mode will disable line select`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: stopSweepChoices[0].id,
					choices: stopSweepChoices,
					tooltip:
						'Options: 16 for Parade style 1 line sweep, 18 for Parade style 1 field sweep, 0 for Overlay style 1 line sweep, 1 for Overlay style 2 line sweep, 2 for Overlay style 1 field sweep, 3 for Overlay style 2 field sweep',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 18) {
					self.log('warn', `Rate out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/stop_sweep/${await parseTileScope(options, self, context)}`, { ints: [mode] })
			},
		},
		stopColorTrace: {
			name: 'Stop Color Trace',
			description: `Set the appearance of Stop trace color`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: stopColorTraceChoices[0].id,
					choices: stopColorTraceChoices,
					tooltip: 'Options: FSTOP_COLOR_TRACE_OFF or FSTOP_COLOR_TRACE_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/stop_color_trace/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		stopDisplayGain: {
			name: 'Stop Display Fixed Gain',
			description: `Set the stop display fixed gain`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'gain',
					label: 'Gain',
					min: 0,
					max: 10,
				},
				{
					...actionOptions.modeVar,
					id: 'gainVar',
					label: 'Gain',
					tooltip: 'Varible must return an integer between 0 and 10',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				let gain = parseInt(options.gain)
				if (options.useVar) {
					gain = parseInt(await context.parseVariablesInString(options.gainVar))
					if (isNaN(gain) || gain < 0 || gain > 10) {
						self.log('warn', `stop_display_gain has been passed an out of range variable: ${gain}`)
						return undefined
					}
				}
				return await self.postCommand(`/stop_display_gain/${await parseTileScope(options, self, context)}`, {
					ints: [gain],
				})
			},
		},
		stopEnableBestGain: {
			name: 'Stop Enable Best Gain',
			description: `Enable/Disable best gain for stop display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: stopEnableBestGainChoices[0].id,
					choices: stopEnableBestGainChoices,
					tooltip: 'Options: FSTOP_BEST_ENABLE_OFF to Disable, FSTOP_BEST_ENABLE_ON to Enable.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/stop_enable_best_gain/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		stopHmag: {
			name: 'Stop Display Hmag',
			description: `Stop Display Hmag & Best View`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'hmag',
					label: 'Hmag',
					default: 1,
					min: 1,
					max: 25,
				},
				{
					...actionOptions.modeVar,
					id: 'hmagVar',
					label: 'Hmag',
					tooltip: 'Varible must return an integer between 1 and 25',
				},
				{
					...actionOptions.modeDropdown,
					id: 'bestView',
					label: 'Best view',
					default: 0,
					choices: stopHmagChoices,
					tooltip: 'Options Best View: 0 for Disable, 1 for Enable.',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const hmag = options.useVar
					? parseInt(await context.parseVariablesInString(options.hmagVar))
					: parseInt(options.hmag)
				const bestView = parseInt(await context.parseVariablesInString(options.bestView))
				if (isNaN(hmag) || hmag < 1 || hmag > 25) {
					self.log('warn', `Hmag out of range: ${hmag}`)
					return undefined
				}
				if (isNaN(bestView) || bestView < 0 || bestView > 1) {
					self.log('warn', `Best View out of range: ${bestView}`)
					return undefined
				}
				return await self.postCommand(`/stop_hmag/${await parseTileScope(options, self, context)}`, {
					ints: [hmag, bestView],
				})
			},
		},
		stopActiveArea: {
			name: 'Stop Active Area',
			description: `Enable/Disable display of Active Picture Area only in line sweeps in Stop Display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: stopActiveAreaChoices[0].id,
					choices: stopActiveAreaChoices,
					tooltip: 'Options: FSTOP_ACTIVE_AREA_OFF, FSTOP_ACTIVE_AREA_ON.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/stop_active_area/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		stopGammaReference: {
			name: 'Stop Gamma Reference',
			description: `Select Camera gamma reference as display light referenced or scene light referenced`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Reference',
					default: stopGammaReferenceChoices[0].id,
					choices: stopGammaReferenceChoices,
					tooltip: 'Options: 0 for scene light reference, 1 for display light reference.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Reference out of range: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/stop_gamma_reference/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		stopEnableLowPassFilter: {
			name: 'Stop Enable Low Pass Filter',
			description: `Enable/Disable the Low Pass Filter`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: stopEnableLowPassFilterChoices[0].id,
					choices: stopEnableLowPassFilterChoices,
					tooltip: 'Options: FSTOP_LPF_ENABLE_OFF to Disable, FSTOP_LPF_ENABLE_ON to Enable',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/stop_enable_low_pass_filter/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		gpioPresetRecallEnable: {
			name: 'GPIO Preset Recall Enable',
			description: `Turns the ability to recall presets via GPIO pins On/Off`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: gpioPresetRecallEnableChoices[0].id,
					choices: gpioPresetRecallEnableChoices,
					tooltip: 'Options: GPIO_PRESET_RECALL_ENABLE_ON, GPIO_PRESET_RECALL_ENABLE_OFF.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/gpio_preset_recall_enable`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioPairAuxOutMode: {
			name: 'Audio Pair Aux Out Mode',
			description: `Select audio aux out mode for ST2110`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioPairAuxOutModeChoices[0].id,
					choices: audioPairAuxOutModeChoices,
					tooltip: 'Options are : AUX_OUT_MODE_FIXED_CHANNELS, AUX_OUT_MODE_PAIR_ON_CH1_CH2',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_pair_aux_out_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		sourceConfigVidLinks: {
			name: 'Source Config Video Links',
			description: `Configuration setting for changing the number of links`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sourceConfigVidLinksChoices[0].id,
					choices: sourceConfigVidLinksChoices,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_VID_LINKS_SINGLE, IOSLAVE_SOURCE_CONFIG_VID_LINKS_QUAD',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`//source_config_vid_links/${await context.parseVariablesInString(options.scope)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		sourceConfigColorimetry: {
			name: 'Source Config Colorimetry',
			description: `Configuration Setting for changing the Colorimetry`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sourceConfigColorimetryChoices[0].id,
					choices: sourceConfigColorimetryChoices,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_COLORIMETRY_709, IOSLAVE_SOURCE_CONFIG_COLORIMETRY_BT2020',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/source_config_colorimetry/${await context.parseVariablesInString(options.scope)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		sourceConfigEotf: {
			name: 'Source Config EOTF',
			description: `Configuration Setting for changing the EOTF`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sourceConfigEotfChoices[0].id,
					choices: sourceConfigEotfChoices,
					tooltip:
						'Options: IOSLAVE_SOURCE_CONFIG_EOTF_SDR_NARROW, IOSLAVE_SOURCE_CONFIG_EOTF_SDR_FULL, IOSLAVE_SOURCE_CONFIG_EOTF_PQ_NARROW, IOSLAVE_SOURCE_CONFIG_EOTF_PQ_FULL, IOSLAVE_SOURCE_CONFIG_EOTF_HLG, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG2, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3_LIVE_HDR, IOSLAVE_SOURCE_CONFIG_EOTF_LOGC',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/source_config_eotf/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		audioInputType: {
			name: 'Audio Input Type',
			description: `Audio Input type selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioInputTypeChoices[0].id,
					choices: audioInputTypeChoices,
					tooltip: 'Options: AUDIO_INPUT_TYPE_PCM, AUDIO_INPUT_TYPE_DOLBY',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_input_type/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		dolby_aes_pair: {
			name: 'Dolby AES Pair',
			description: `Select the AES channel pair for Dolby/Dolby-ED2 input`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Input',

					default: 1,
					min: 1,
					max: 8,
					tooltip: 'Options (DOLBY): 1 through 8. Valid Options (DOLBY ED2): 1 through 7',
				},
				{
					...actionOptions.modeVar,
					label: 'Input',
					tooltip:
						'Varible must return an integer. Valid Options (DOLBY): 1 through 8. Valid Options (DOLBY ED2): 1 through 7',
				},
				actionOptions.useVar,
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 1 || mode > 8) {
					self.log('warn', `dolby_aes_pair has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/dolby_aes_pair/${await context.parseVariablesInString(options.scope)}`, {
					ints: [mode],
				})
			},
		},
		audioPcmProgram: {
			name: 'Audio PCM Program',
			description: `Enable/Disable custom program configuration for PCM channels`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: audioPcmProgramChoices[0].id,
					choices: audioPcmProgramChoices,
					tooltip: 'Options: AUDIO_PCM_PROGRAM_OFF, AUDIO_PCM_PROGRAM_ON',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/audio_pcm_program/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		xmitMode2110: {
			name: 'ST 2110.21 Transmit Mode',
			description: `Set S2110.21 transmit mode to Gapped (N), Narrow Linear(NL), Wide Linear(W)`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: xmitMode2110Choices[0].id,
					choices: xmitMode2110Choices,
					tooltip:
						'Options: IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_N, IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_NL, IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_W',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/xmit_mode_2110/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		trOffset2110: {
			name: 'ST 2110.21 TR Offset',
			description: `Set S2110.21 expected TR offset, in microseconds`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Offset (μs)',

					default: -1,
					min: -1,
					max: 50000,
					tooltip: 'Microseconds',
				},
				{
					...actionOptions.modeVar,
					label: 'Offset (μs)',
					tooltip: 'Varible must return an integer between -1 and 50000',
				},
				actionOptions.useVar,
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < -1 || mode > 50000) {
					self.log('warn', `tr_offset_2110 has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/tr_offset_2110/${await context.parseVariablesInString(options.scope)}`, {
					ints: [mode],
				})
			},
		},
		remoteConfigMode: {
			name: 'Remote Config Mode',
			description: `Enables/disables remote management client such as NMOS`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: remoteConfigModeChoices[0].id,
					choices: remoteConfigModeChoices,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_OFF, IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_NMOS',
				},
				actionOptions.config,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/remote_config_mode/${await context.parseVariablesInString(options.scope)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		inputEditMode: {
			name: 'Input Edit Mode',
			description: `Hides the menu options (Recall, Config, Rename) in the UI that appear on pressing a virtual input button and enables recalling the virtual input directly. Note: This selection is only applicable for the user interface's input control menu; Input Selection or Rename will be functional from the API irrespective of this selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: inputEditModeChoices[0].id,
					choices: inputEditModeChoices,
					tooltip: 'Available Options: IOSLAVE_UI_EDIT_MODE_ON, IOSLAVE_UI_EDIT_MODE_OFF.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/input_edit_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		extRefOut: {
			name: 'External Reference Out',
			description: `Set or Get the external reference card output`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: extRefOutChoices[0].id,
					choices: extRefOutChoices,
					tooltip:
						'Options are EXT_REF_OUT_LOOPTHROUGH, EXT_REF_OUT_TERMINATE, and EXT_REF_OUT_PPS. EXT_REF_OUT_PPS is only supported for version 1 external reference boards',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ext_ref_out`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ipFastSwitchEnable: {
			name: 'IP Fast Switch',
			description: `Configuration setting for enabling rapid switching of synchronous sources`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: ipFastSwitchEnableChoices[0].id,
					choices: ipFastSwitchEnableChoices,
					tooltip: 'Options: IP_FAST_SWITCH_ENABLE_ON, IP_FAST_SWITCH_ENABLE_OFF.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ip_fast_switch_enable`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ignoreRtpSequenceError: {
			name: 'Ignore RTP Sequence Error',
			description: `Report/ignore RTP sequence error`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: ignoreRtpSequenceErrorChoices[0].id,
					choices: ignoreRtpSequenceErrorChoices,
					tooltip: 'Options: To report: IP_IGNORE_RTP_SEQUENCE_ERROR_OFF, To ignore: IP_IGNORE_RTP_SEQUENCE_ERROR_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ignore_rtp_sequence_error`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		jitterMeterEnable: {
			name: 'Jitter Meter Enable',
			description: `Enable jitter meter display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: jitterMeterEnableChoices[0].id,
					choices: jitterMeterEnableChoices,
					tooltip: 'Options: 0 for jitter display off, 1 for jitter display on',
				},
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Jitter Meter Mode passed out of range value: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/jitter_meter_enable`, {
					ints: [mode],
				})
			},
		},
		jitterSweep: {
			name: 'Jitter Meter Sweep Rate',
			description: `Sweep rate for jitter waveform display`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Sweep Rate',
					default: jitterSweepChoices[0].id,
					choices: jitterSweepChoices,
					tooltip: 'Options: 0 for 1 line, 1 for 2 line, 2 for 1 field, 3 for 2 field',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Jitter Sweep Rate passed out of range value: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/jitter_sweep/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		lightningVerticalGain: {
			name: 'Lightning Vertical Gain - Fixed',
			description: `Lightning vertical fixed gain`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'gain',
					label: 'Gain',
					default: 1,
					min: 1,
					max: 10,
				},
				{
					...actionOptions.modeVar,
					id: 'gainVar',
					label: 'Gain',
					tooltip: 'Varible must return an integer between 1 and 10.',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.gain)
				if (isNaN(mode) || mode < 1 || mode > 10) {
					self.log('warn', `lightning_vertical_gain has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/lightning_vertical_gain/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		lightningVerticalVarEnable: {
			name: 'Lightning Vertical Gain - Variable Enable',
			description: `Enable/disable lightning vertical variable gain`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: lightningVerticalVarEnableChoices[0].id,
					choices: lightningVerticalVarEnableChoices,
					tooltip: 'Options: LIGHTNING_V_VAR_ENABLE_ON or LIGHTNING_V_VAR_ENABLE_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/lightning_vertical_var_enable/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		lightningHorizontalGain: {
			name: 'Lightning Horizontal Gain - Fixed',
			description: `Lightning horizontal fixed gain`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'gain',
					label: 'Gain',
					default: 1,
					min: 1,
					max: 10,
				},
				{
					...actionOptions.modeVar,
					id: 'gainVar',
					label: 'Gain',
					tooltip: 'Varible must return an integer between 1 and 10.',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.gain)
				if (isNaN(mode) || mode < 1 || mode > 10) {
					self.log('warn', `lightning_horizontal_gain has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/lightning_horizontal_gain/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		lightningHorizontalVarEnable: {
			name: 'Lightning Horizontal Gain - Variable Enable',
			description: `Enable/disable lightning horizontal variable gain`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: lightningHorizontalVarEnableChoices[0].id,
					choices: lightningHorizontalVarEnableChoices,
					tooltip: 'Options: LIGHTNING_H_VAR_ENABLE_ON or LIGHTNING_H_VAR_ENABLE_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/lightning_horizontal_var_enable/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		lightningLut: {
			name: 'Lightning LUT',
			description: `Lightning - Conversion to Rec.709(LUT)`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: lightningLutChoices[0].id,
					choices: lightningLutChoices,
					tooltip: 'Options: LIGHTNING_LUT_OFF to Disable, LIGHTNING_LUT_ON to Enable',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/lightning_lut/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		measureAssign: {
			name: 'Measure Assign',
			description: `Select measurement display within a tile`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Application',
					default: measureAssignChoices[0].id,
					choices: measureAssignChoices,
					tooltip:
						'Options: MEASURE_ASSIGN_WAVEFORM, MEASURE_ASSIGN_VECTOR, MEASURE_ASSIGN_LIGHTNING, MEASURE_ASSIGN_PICTURE, MEASURE_ASSIGN_DIAMOND, MEASURE_ASSIGN_AUDIO, MEASURE_ASSIGN_ERROR_STATUS, MEASURE_ASSIGN_AUDIO, MEASURE_ASSIGN_DATALIST, MEASURE_ASSIGN_EYE, MEASURE_ASSIGN_JITTER, MEASURE_ASSIGN_DOLBY_STATUS, MEASURE_ASSIGN_ANC_DATA, MEASURE_ASSIGN_GEN_STATUS, MEASURE_ASSIGN_IP_STATUS, MEASURE_ASSIGN_IP_SESSION, MEASURE_ASSIGN_VIDEO_SESSION, MEASURE_ASSIGN_IP_GRAPHS, MEASURE_ASSIGN_IP_PIT, MEASURE_ASSIGN_TIMING_DISPLAY, MEASURE_ASSIGN_STREAM_TIMING, MEASURE_ASSIGN_PTP_GRAPHS, MEASURE_ASSIGN_FSTOP, MEASURE_ASSIGN_IP_GEN_STATUS, MEASURE_ASSIGN_SYNC_DISPLAY, MEASURE_ASSIGN_CIE, MEASURE_ASSIGN_CHANNEL_STATUS, MEASURE_ASSIGN_AV_DELAY, MEASURE_ASSIGN_CAMAPP, MEASURE_ASSIGN_EXTREF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/measure_assign/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		lineSelectEnable: {
			name: 'Line Select Enable',
			description: `Enable line select for a tile. Line select is available for the following apps: picture, waveform, vector, diamond, lightning, CIE, and stop display. Line select can only be enabled for waveform and stop if the sweep selection is "1 line". For 3G(Level B), 4K and 8K signals and for CIE Display, enabling/disabling line select applies to all tiles`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: lineSelectEnableChoices[0].id,
					choices: lineSelectEnableChoices,
					tooltip: 'Options: MEASURE_LINE_SELECT_ENABLE_OFF, MEASURE_LINE_SELECT_ENABLE_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/line_select_enable/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		measureBarTarget: {
			name: 'Measure Bar Targets',
			description: `Bar Targets selection between 75% and 100%`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: measureBarTargetChoices[0].id,
					choices: measureBarTargetChoices,
					tooltip: 'Options: MEASURE_BAR_TARGET_75, MEASURE_BAR_TARGET_100. Default: MEASURE_BAR_TARGET_100',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/measure_bar_target/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		measureTileMode: {
			name: 'Measure Tile Mode',
			description: `Select extended tile mode with in a tile. Tile_select API should be used to select a tile to expand to full screen or to know whether a tile is displayed in full screen`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: measureTileModeChoices[0].id,
					choices: measureTileModeChoices,
					tooltip:
						'Options: MEASURE_TILE_MODE_QUARTER_TILE, MEASURE_TILE_MODE_TWO_TILE_VERTICAL. Default: MEASURE_TILE_MODE_QUARTER_TILE',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/measure_tile_mode/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		nmosDiscovery: {
			name: 'NMOS Discovery',
			description: `Enables/disables NMOS IS-04 Discovery. If enabled, an NMOS node and device are advertised for NMOS registration or Peer-to-Peer operation. NMOS Discovery must be enabled to perform IS-05 receiver connections. Enabling IS-05 is done via the input settings`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'NMOS',
					default: nmosDiscoveryChoices[0].id,
					choices: nmosDiscoveryChoices,
					tooltip: 'Options: NMOS_MANAGER_ENABLE_ENABLED, NMOS_MANAGER_ENABLE_DISABLED',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/nmos_discovery`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		nmosDnsType: {
			name: 'NMOS DNS Type',
			description: `Selection of DNS Type for NMOS`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'DNS',
					default: nmosDnsTypeChoices[0].id,
					choices: nmosDnsTypeChoices,
					tooltip: 'Options: NMOS_DNS_TYPE_UNICAST, NMOS_DNS_TYPE_MULTICAST, NMOS_DNS_TYPE_AUTO',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/nmos_dns_type`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		nmosApiVersion: {
			name: 'NMOS API Version',
			description: `Selection of NMOS API Version`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'API',
					default: nmosApiVersion[0].id,
					choices: nmosApiVersion,
					tooltip: 'Options: NMOS_API_VERSION_1P2, NMOS_API_VERSION_1P3',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/nmos_api_version`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		nmosPersistentReceivers: {
			name: 'NMOS Persistent Recievers',
			description: `Enables/disables persistent NMOS receiver mode. In this mode, all receivers will remain active, regardless of if the current input is enabled for NMOS. In this mode, any activations will configure the specified target input (see nmos_target_input)`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: nmosPersistentReceiversChoices[0].id,
					choices: nmosPersistentReceiversChoices,
					tooltip: 'Options: NMOS_MANAGER_PERSISTENT_RECEIVERS_ENABLED, NMOS_MANAGER_PERSISTENT_RECEIVERS_DISABLED',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/nmos_persistent_receivers`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		nmos_target_input: {
			name: 'NMOS Target Input',
			description: `Sets the target input for NMOS activations in persistent NMOS receiver mode (see nmos_persistent_receivers). In this mode, any NMOS receiver activations will configure the specified input. This will also convert the target input to an NMOS-enabled 2110 input. A receiver activation WILL NOT set the target input to be the active input`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Input',
					default: 1,
					min: 1,
					max: 6,
				},
				{
					...actionOptions.modeVar,
					label: 'Input',
					tooltip: 'Varible must return an integer between 1 and 6.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 1 || mode > 6) {
					self.log('warn', `nmos_target_input has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/nmos_target_input`, {
					ints: [mode],
				})
			},
		},
		jitterHpf: {
			name: 'Jitter HPF',
			description: `High-pass filter selection for jitter measurements`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: jitterHpfChoices[0].id,
					choices: jitterHpfChoices,
					tooltip:
						'Options: 0 for timing, 1 for alignment, 2 for 10Hz, 3 for 100Hz, 4 for 1kHz, 5 for 10kHz, 6 for 100kHz',
				},
			],
			callback: async ({ options }, context) => {
				const mode = parseInt(await context.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 6) {
					this.log('warn', `jitter_hpf has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/jitter_hpf/index0`, {
					ints: [mode],
				})
			},
		},
		closedCaptionsDisplay: {
			name: 'Closed Captions Display',
			description: `The format of captions/subtitles displayed for the picture. The first value in the list is the requested value, the second is the effective value`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: closedCaptionsDisplayChoices[0].id,
					choices: closedCaptionsDisplayChoices,
					tooltip:
						'Options: PICTURE_CC_DISPLAY_OFF, PICTURE_CC_DISPLAY_AUTO, PICTURE_CC_DISPLAY_CEA608, PICTURE_CC_DISPLAY_CEA708 PICTURE_CC_DISPLAY_WST, PICTURE_CC_DISPLAY_ARIB',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/closed_captions_display/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureSafeAction1: {
			name: 'Picture Safe Action 1',
			description: `Set the picture safe action 1 graticule type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Graticle',
					default: pictureSafeChoices[0].id,
					choices: pictureSafeChoices,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_safe_action_1/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureSafeAction2: {
			name: 'Picture Safe Action 2',
			description: `Set the picture safe action 2 graticule type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Graticle',
					default: pictureSafeChoices[0].id,
					choices: pictureSafeChoices,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_safe_action_2/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureSafeTitle1: {
			name: 'Picture Safe Title 1',
			description: `Set the picture safe title 1 graticule type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Graticle',
					default: pictureSafeChoices[0].id,
					choices: pictureSafeChoices,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_safe_title_1/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureSafeTitle2: {
			name: 'Picture Safe Title 2',
			description: `Set the picture safe title 2 graticule type`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Graticle',
					default: pictureSafeChoices[0].id,
					choices: pictureSafeChoices,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_safe_title_2/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureCenterGrat: {
			name: 'Picture Centre Graticule',
			description: `Set the picture center graticule`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Graticle',
					default: pictureCenterGratChoices[0].id,
					choices: pictureCenterGratChoices,
					tooltip: 'Options: PICTURE_GRAT_CENTER_OFF, PICTURE_GRAT_CENTER_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_center_grat/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		closedCaptions608Channel: {
			name: 'Closed Captions 608 Channel',
			description: `The requested 608 channel to decode Closed Captions on`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: '608 Channel',
					default: closedCaptions608ChannelChoices[0].id,
					choices: closedCaptions608ChannelChoices,
					tooltip:
						'Options: PICTURE_CC_SERVICE_608_CC1, PICTURE_CC_SERVICE_608_CC2, PICTURE_CC_SERVICE_608_CC3, PICTURE_CC_SERVICE_608_CC4',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/closed_captions_608_channel/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		closedCaptions708Service: {
			name: 'Closed Captions 708 Service',
			description: `The requested 708 service to decode Closed Captions on`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: '708 Service',
					default: closedCaptions708ServiceChoices[0].id,
					choices: closedCaptions708ServiceChoices,
					tooltip:
						'Options: PICTURE_CC_SERVICE_708_SVC1, PICTURE_CC_SERVICE_708_SVC2, PICTURE_CC_SERVICE_708_SVC3, PICTURE_CC_SERVICE_708_SVC4, PICTURE_CC_SERVICE_708_SVC5, PICTURE_CC_SERVICE_708_SVC6',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/closed_captions_708_service/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		closedCaptionsWstPage: {
			name: 'Closed Captions WST Page',
			description: `The requested Teletext page to decode Subtitles on`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Page',

					default: 100,
					min: 100,
					max: 899,
					isVisible: (options) => {
						return !options.useVar && options.legacy
					},
				},
				{
					...actionOptions.modeVar,
					label: 'Page',
					tooltip: 'Varible must return an integer between 100 and 899.',
					isVisible: (options) => {
						return options.useVar && options.legacy
					},
				},
				{
					...actionOptions.modeVar,
					id: 'newPage',
					label: 'Page',
					tooltip: 'Varible must return a hex string ie 0x801.',
					default: '0x801',
					useVariables: { local: true },
					isVisible: (options) => {
						return !options.legacy
					},
				},
				{
					...actionOptions.useVar,
					isVisible: (options) => {
						return options.legacy
					},
				},
				actionOptions.tiles,
				{
					type: 'checkbox',
					id: 'legacy',
					label: 'Legacy Mode',
					default: false,
					tooltip: 'Enable for compatibility with FW versions < 4.21',
				},
			],
			callback: async ({ options }, context) => {
				const args = {}
				if (options.legacy) {
					const mode = options.useVar
						? parseInt(await context.parseVariablesInString(options.modeVar))
						: parseInt(options.mode)
					if (isNaN(mode) || mode < 100 || mode > 899) {
						self.log('warn', `closed_captions_wst_page has been passed an out of range variable: ${mode}`)
						return undefined
					}
					arguments.ints = [mode]
				} else {
					const mode = context.parseVariablesInString(options.newPage).trim().substring(0, 5)
					if (mode.startsWith('0x') && mode.length == 5) {
						args.string = mode
					} else {
						self.log('warn', `closed_captions_wst_page has been passed an out of range variable: ${mode}`)
						return undefined
					}
				}
				return await self.postCommand(`/closed_captions_wst_page/${await parseTileScope(options, self, context)}`, args)
			},
		},
		closedCaptionsAribType: {
			name: 'Closed Captions ARIB Type',
			description: `The requested ARIB type to decode Closed Captions on`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'ARIB Type',
					default: closedCaptionsAribTypeChoices[0].id,
					choices: closedCaptionsAribTypeChoices,
					tooltip: 'Options: PICTURE_CC_ARIB_B37_TYPE_HD, PICTURE_CC_ARIB_B37_TYPE_SD, PICTURE_CC_ARIB_B37_TYPE_MOBILE',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/closed_captions_arib_type/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureAfdGrat: {
			name: 'Picture AFD Graticule',
			description: `Enable/disable AFD Graticule for a picture display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureAfdGratChoices[0].id,
					choices: pictureAfdGratChoices,
					tooltip: 'Options: PICTURE_AFD_GRAT_ON, PICTURE_AFD_GRAT_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_afd_grat/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureAfdGratOverlay: {
			name: 'Picture AFD Graticule Overlay',
			description: `Enable/disable AFD Graticule overlay on a picture display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureAfdGratOverlayChoices[0].id,
					choices: pictureAfdGratOverlayChoices,
					tooltip: 'Options: PICTURE_AFD_GRAT_OVERLAY_ON, PICTURE_AFD_GRAT_OVERLAY_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_afd_grat_overlay/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureLut: {
			name: 'Picture LUT',
			description: `Picture Lut On or Off`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureLutChoices[0].id,
					choices: pictureLutChoices,
					tooltip: 'Options: PICTURE_LUT_OFF, PICTURE_LUT_ON. Default: PICTURE_LUT_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_lut/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureFormatOverlay: {
			name: 'Picture Format Overlay',
			description: `Picture Format Overlay On or Off`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureFormatOverlayChoices[0].id,
					choices: pictureFormatOverlayChoices,
					tooltip:
						'Options: PICTURE_TIMING_INFO_SWITCH_OFF, PICTURE_TIMING_INFO_SWITCH_ON. Default: PICTURE_TIMING_INFO_SWITCH_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_format_overlay/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureFalseColorGamutMode: {
			name: 'Picture False Color Gamut Mode',
			description: `Set Gamut False Color Mode`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureFormatOverlayChoices[0].id,
					choices: pictureFormatOverlayChoices,
					tooltip:
						'Options: PICTURE_OUTSIDE_709_MODE_709_P3 for 709 - P3, PICTURE_OUTSIDE_709_MODE_P3_2020 for P3-2020, PICTURE_OUTSIDE_709_MODE_709_P3_2020 for Both.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_false_color_gamut_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureFalseColor: {
			name: 'Picture False Color',
			description: `Enable or Disable False Color. NOTE: False Color is not applicable if @picture_lut is ON`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureFalseColorChoices[0].id,
					choices: pictureFalseColorChoices,
					tooltip:
						'Options: PICTURE_FALSE_COLOR_OFF to disable false color, PICTURE_FALSE_COLOR_ON to enable false color.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_false_color/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureFalseColorMode: {
			name: 'Picture False Color Mode',
			description: `Set Picture False Coloring Mode`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureFalseColorChoices[0].id,
					choices: pictureFalseColorChoices,
					tooltip:
						'Options: FALSE_COLOR_MODE_LUMA for Luminance false color, FALSE_COLOR_MODE_AREA for Percent Area false color, FALSE_COLOR_MODE_GAMUT for Gamut false color.',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_false_color_mode/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureFalseColorBandMeter: {
			name: 'Picture False Color Band Meter',
			description: `Hide or Show False Color Band Meter on Picture Display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureFalseColorBandMeterChoices[0].id,
					choices: pictureFalseColorBandMeterChoices,
					tooltip: 'Options: PICTURE_FALSE_COLOR_BAND_METER_[HIDE, SHOW]',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/picture_false_color_band_meter/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		closedCaptionsInfoEnable: {
			name: 'Closed Captions Info Enable',
			description: `Enable/disable the Closed Captions/Subtitles information overlay in the picture display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: closedCaptionsInfoEnableChoices[0].id,
					choices: closedCaptionsInfoEnableChoices,
					tooltip: 'Options: PICTURE_CC_INFO_SWITCH_ON, PICTURE_CC_INFO_SWITCH_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/closed_captions_info_enable/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		sourceIdDisplay: {
			name: 'Source ID Display',
			description: `Enable/disable source id overlay in picture display`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sourceIdDisplayChoices[0].id,
					choices: sourceIdDisplayChoices,
					tooltip: 'Options: PICTURE_SOURCE_ID_INFO_ENABLE_OFF, PICTURE_SOURCE_ID_INFO_ENABLE_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/source_id_display/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureAspectRatio: {
			name: 'Picture Aspect Ratio',
			description: `Controls preferred Aspect Ratio for standard definition formats in Picture Display. Option PICTURE_ASPECT_RATIO_AUTO depends on the detected AFD aspect ratio data. If AFD is not detected PICTURE_ASPECT_RATIO_AUTO will be 4X3`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureAspectRatioChoices[0].id,
					choices: pictureAspectRatioChoices,
					tooltip: 'Options: PICTURE_ASPECT_RATIO_AUTO, PICTURE_ASPECT_RATIO_16x9.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_aspect_ratio`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		presetRecallSavedInputs: {
			name: 'Preset Recall Saved Inputs',
			description: `Include/Exclude input settings and configuration from Preset recall`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: presetRecallSavedInputsChoices[0].id,
					choices: presetRecallSavedInputsChoices,
					tooltip: 'Options: PRESET_RECALL_SAVED_INPUTS_ON, PRESET_RECALL_SAVED_INPUTS_OFF',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/preset_recall_saved_inputs`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		presetEditMode: {
			name: 'Preset Edit Mode',
			description: `Hides the menu options (Recall, Save, Rename) in the UI that appear on pressing a preset button and enables recalling the preset directly. Note: This selection is only applicable for the user interface preset control menu; Preset Recall, Save or Rename will be functional from the API irrespective of this selection`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: presetEditModeChoices[0].id,
					choices: presetEditModeChoices,
					tooltip: 'Options: PRESET_EDIT_MODE_ON, PRESET_EDIT_MODE_OFF',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/preset_edit_mode`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ptpProfile: {
			name: 'PTP Profile',
			description: `Set or get the current PTP profile`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Profile',
					default: ptpProfileChoices[0].id,
					choices: ptpProfileChoices,
					tooltip: 'Options are PTP_PROFILE_2059, PTP_PROFILE_AES67, and PTP_PROFILE_GENERIC',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ptp_profile`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ptpDomain2059Profile: {
			name: 'PTP Domain ST 2059 Profile',
			description: `Set or get the PTP domain (0-127) for the ST2059 profile`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Domain',
					max: 127,
				},
				{
					...actionOptions.modeVar,
					label: 'Domain',
					tooltip: 'Varible must return an integer between 0 and 127.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 127) {
					self.log('warn', `ptp_domain_2059_profile has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/ptp_domain_2059_profile`, {
					ints: [mode],
				})
			},
		},
		ptpCommMode2059Profile: {
			name: 'PTP ST 2059 Communication Mode Profile',
			description: `Set or get the selected communication mode for the 2059 profile`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: ptpCommMode2059ProfileChoices[0].id,
					choices: ptpCommMode2059ProfileChoices,
					tooltip: 'Options: PTP_COMM_MODE_MULTICAST and PTP_COMM_MODE_MIXED_SMPTE_NO_NEG',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/ptp_comm_mode_2059_profile`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		ptpDomainAes67Profile: {
			name: 'PTP Domain AES 67 Profile',
			description: `Set or get the PTP domain (0-127) for the AES 67 profile`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Domain',

					max: 127,
				},
				{
					...actionOptions.modeVar,
					id: 'gainVar',
					label: 'Gain',
					tooltip: 'Varible must return an integer between 0 and 127.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 127) {
					self.log('warn', `ptp_domain_aes67_profile has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/ptp_domain_aes67_profile`, {
					ints: [mode],
				})
			},
		},
		ptpDomainGeneralProfile: {
			name: 'PTP Domain Generic Profile',
			description: `Set or get the PTP domain (0-127) for the generic profile`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Domain',

					max: 127,
				},
				{
					...actionOptions.modeVar,
					label: 'Domain',
					tooltip: 'Varible must return an integer between 0 and 127.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 127) {
					self.log('warn', `ptp_domain_general_profile has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/ptp_domain_general_profile`, {
					ints: [mode],
				})
			},
		},
		snmpTrapEnable: {
			name: 'SNMP Trap Enable',
			description: `Enable/disable sending SNMP traps`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: snmpTrapEnableChoices[0].id,
					choices: snmpTrapEnableChoices,
					tooltip: 'Options: SNMP_TRAP_ENABLE_ON : Enable snmp Traps, SNMP_TRAP_ENABLE_OFF : Disable snmp Traps.',
				},
			],
			callback: async ({ options }) => {
				return await self.postCommand(`/snmp_trap_enable`, { ints: [parseInt(options.mode)] })
			},
		},
		timingMeasureMode: {
			name: 'Timing Measurement Mode',
			description: `Select which measurement to display in the timing app`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: timingMeasureModeChoices[0].id,
					choices: timingMeasureModeChoices,
					tooltip: 'Options: STATUS_TIMING_MEASURE_MODE_VIDEO_TO_REF, STATUS_TIMING_MEASURE_MODE_ANALOG_TO_PTP',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/timing_measure_mode/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		tileGratIntensity: {
			name: 'Graticule Brightness Level',
			description: `Set Graticule Brightness Level`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Intensity',
					min: -50,
					max: 50,
				},
				{
					...actionOptions.modeVar,
					label: 'Intensity',
					tooltip: 'Varible must return an integer between -50 and 50.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < -50 || mode > 50) {
					self.log('warn', `tile_grat_intensity has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/tile_grat_intensity`, {
					ints: [mode],
				})
			},
		},
		trace_intensity: {
			name: 'Trace Brightness Level',
			description: `Set Trace Brightness Level`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Intensity',

					min: -50,
					max: 50,
				},
				{
					...actionOptions.modeVar,
					label: 'Intensity',
					tooltip: 'Varible must return an integer between -50 and 50.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				let mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.gainVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < -50 || mode > 50) {
					self.log('warn', `trace_intensity has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/trace_intensity`, {
					ints: [mode],
				})
			},
		},
		extendedStatusBarPinnedMenu: {
			name: 'Extended Status Bar Pinned Menu',
			description: `Pin a menu on extended status bar`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: extendedStatusBarPinnedMenuChoices[0].id,
					choices: extendedStatusBarPinnedMenuChoices,
					tooltip:
						'Options: TILE_EXTENDED_STATUS_BAR_PINNED_MENU_OFF, TILE_EXTENDED_STATUS_BAR_PINNED_MENU_INPUT, TILE_EXTENDED_STATUS_BAR_PINNED_MENU_PRESET.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/extended_status_bar_pinned_menu`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		cieColorSpace: {
			name: 'CIE Color Space',
			description: `Select the CIE color space`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: cieColorSpaceChoices[0].id,
					choices: cieColorSpaceChoices,
					tooltip: 'Options: TILE_CIE_COLOR_SPACE_1931 or TILE_CIE_COLOR_SPACE_1976',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/cie_color_space`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		cieTraceAppearance: {
			name: 'CIE Trace Appearance',
			description: `Set the appearance of CIE trace color`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: cieTraceAppearanceChoices[0].id,
					choices: cieTraceAppearanceChoices,
					tooltip: 'Options: TILE_CIE_COLOR_TRACE_OFF or TILE_CIE_COLOR_TRACE_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/cie_trace_appearance`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		outOfGamutAlarm: {
			name: 'Out of Gamut Alarm',
			description: `Enable or Disable Out-of-Gamut Alarms`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: outOfGamutAlarmChoices[0].id,
					choices: outOfGamutAlarmChoices,
					tooltip: 'Options: GAMUT_ERROR_CHECK_OFF, GAMUT_ERROR_CHECK_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/out_of_gamut_alarm`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		gamutAlarmThresholdsPreset: {
			name: 'Gamut Alarm Thresholds Preset',
			description: `Load a predefined Preset for Out-of-Gamut Alarms`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: gamutAlarmThresholdsPresetChoices[0].id,
					choices: gamutAlarmThresholdsPresetChoices,
					tooltip: 'Options: GAMUT_ERROR_PRESET_R103 (Sets the EBU R103 Preferred Min/Max)',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/gamut_alarm_thresholds_preset`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		hdrAlarms: {
			name: 'HDR Alarms',
			description: `Enable or Disable HDR Alarms`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: hdrAlarmsChoices[0].id,
					choices: hdrAlarmsChoices,
					tooltip: 'Options: HDR_ALARMS_OFF, HDR_ALARMS_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/hdr_alarms`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		hdrTotalAreaThreshold: {
			name: 'HDR Total Area Threshold',
			description: `HDR total area measurement cut off in Nits`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Nits',

					default: 5000,
					max: 10000,
				},
				{
					...actionOptions.modeVar,
					label: 'Nits',
					tooltip: 'Varible must return an integer between 0 and 10000.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 10000) {
					self.log('warn', `hdr_total_area_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/hdr_total_area_threshold`, {
					ints: [mode],
				})
			},
		},
		hdrBrightestAreaThreshold: {
			name: 'HDR Brightest Area Threshold',
			description: `HDR brightest area measurement cut off in %. The measurement will use the brightest X% of the picture. Percentage range is 0 - 100. The set threshold is relative to the max Nits value of the frame`,
			options: [
				{
					...actionOptions.integerInput,
					label: '%',
					default: 50,
					max: 100,
				},
				{
					...actionOptions.modeVar,
					label: '%',
					tooltip: 'Varible must return an integer between 0 and 100.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 100) {
					self.log('warn', `hdr_brightest_area_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/hdr_brightest_area_threshold`, {
					ints: [mode],
				})
			},
		},
		hdrAreaThreshold: {
			name: 'HDR Area Threshold',
			description: `HDR area measurement cut off in %. The measurement will use the brightest X% of the picture. Percentage range is 0 - 100. The set threshold is relative to the max Nits value of the frame`,
			options: [
				{
					...actionOptions.integerInput,
					label: '%',
					default: 50,
					max: 100,
				},
				{
					...actionOptions.modeVar,
					label: '%',
					tooltip: 'Varible must return an integer between 0 and 100.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 100) {
					self.log('warn', `hdr_area_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/hdr_area_threshold`, {
					ints: [mode],
				})
			},
		},
		hdr_darkest_area_threshold: {
			name: 'HDR Darkest Area Threshold',
			description: `HDR darkest area measurement cut off in %. The measurement will use the darkest X% of the picture. Percentage range is 0 - 100. The set threshold is relative to the max Nits value of the frame`,
			options: [
				{
					...actionOptions.integerInput,
					label: '%',
					default: 50,
					max: 100,
				},
				{
					...actionOptions.modeVar,
					label: '%',
					tooltip: 'Varible must return an integer between 0 and 100.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 0 || mode > 100) {
					self.log('warn', `hdr_darkest_area_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/hdr_darkest_area_threshold`, {
					ints: [mode],
				})
			},
		},
		centerGratColor: {
			name: 'Center Graticule Color',
			description: `Set the Picture Center Graticule color`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Color',
					default: gratColourChoices[0].id,
					choices: gratColourChoices,
					tooltip:
						'Options: PICTURE_GRAT_COLOR_GRAY, PICTURE_GRAT_COLOR_BLACK, PICTURE_GRAT_COLOR_LIGHT_BLUE, PICTURE_GRAT_COLOR_MAGENTA, PICTURE_GRAT_COLOR_LIMEGREEN, PICTURE_GRAT_COLOR_ORANGE, PICTURE_GRAT_COLOR_TS_BLUE, PICTURE_GRAT_COLOR_WHITE, PICTURE_GRAT_COLOR_YELLOW',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/center_grat_color`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		afd_grat_color: {
			name: 'AFD Graticule Color',
			description: `Set the AFD Graticule color`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Color',
					default: gratColourChoices[0].id,
					choices: gratColourChoices,
					tooltip:
						'Options: PICTURE_GRAT_COLOR_GRAY, PICTURE_GRAT_COLOR_BLACK, PICTURE_GRAT_COLOR_LIGHT_BLUE, PICTURE_GRAT_COLOR_MAGENTA, PICTURE_GRAT_COLOR_LIMEGREEN, PICTURE_GRAT_COLOR_ORANGE, PICTURE_GRAT_COLOR_TS_BLUE, PICTURE_GRAT_COLOR_WHITE, PICTURE_GRAT_COLOR_YELLOW',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/afd_grat_color`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		safeArea1Color: {
			name: 'Safe Area 1 Graticule Color',
			description: `Set the color for action 1 and title 1`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Color',
					default: gratColourChoices[0].id,
					choices: gratColourChoices,
					tooltip:
						'Options: PICTURE_GRAT_COLOR_GRAY, PICTURE_GRAT_COLOR_BLACK, PICTURE_GRAT_COLOR_LIGHT_BLUE, PICTURE_GRAT_COLOR_MAGENTA, PICTURE_GRAT_COLOR_LIMEGREEN, PICTURE_GRAT_COLOR_ORANGE, PICTURE_GRAT_COLOR_TS_BLUE, PICTURE_GRAT_COLOR_WHITE, PICTURE_GRAT_COLOR_YELLOW',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/safe_area_1_color`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		safeArea2Color: {
			name: 'Safe Area 2 Graticule Color',
			description: `Set the color for action 2 and title 2`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Color',
					default: gratColourChoices[0].id,
					choices: gratColourChoices,
					tooltip:
						'Options: PICTURE_GRAT_COLOR_GRAY, PICTURE_GRAT_COLOR_BLACK, PICTURE_GRAT_COLOR_LIGHT_BLUE, PICTURE_GRAT_COLOR_MAGENTA, PICTURE_GRAT_COLOR_LIMEGREEN, PICTURE_GRAT_COLOR_ORANGE, PICTURE_GRAT_COLOR_TS_BLUE, PICTURE_GRAT_COLOR_WHITE, PICTURE_GRAT_COLOR_YELLOW',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/safe_area_2_color`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		pictureSafeAreaStd: {
			name: 'Picture Safe Area Standard',
			description: `Set the picture safe area standard.`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: pictureSafeAreaStdChoices[0].id,
					choices: pictureSafeAreaStdChoices,
					tooltip:
						'Options: PICTURE_SAFE_AREA_STD_S2046, PICTURE_SAFE_AREA_STD_SMPTE, PICTURE_SAFE_AREA_STD_ITU, PICTURE_SAFE_AREA_STD_ARIB',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/picture_safe_area_std`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		timecodeOverlay: {
			name: 'Timecode Overlay',
			description: `Specify an array to enable the timecode overlay on each display if 'timecode_select' api is set to "LTC" or "VITC"`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: timecodeOverlayChoices[0].id,
					choices: timecodeOverlayChoices,
					tooltip: 'Options: TILE_UI_TIMECODE_OVERLAY_ON, TILE_UI_TIMECODE_OVERLAY_OFF.',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/timecode_overlay`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		tileAvAdvancedThreshold: {
			name: 'AV Advanced Threshold',
			description: `Audio Video Advanced Threshold for AV Graph`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Threshold',

					default: 1,
					min: 1,
					max: 2500,
				},
				{
					...actionOptions.modeVar,
					label: 'Threshold',
					tooltip: 'Varible must return an integer between 1 and 2500.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 1 || mode > 2500) {
					self.log('warn', `tile_av_advanced_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/tile_av_advanced_threshold`, {
					ints: [mode],
				})
			},
		},
		tileAvDelayedThreshold: {
			name: 'AV Delayed Threshold',
			description: `Audio Video Delayed Threshold for AV Graph`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Threshold',

					default: 1,
					min: 1,
					max: 2500,
				},
				{
					...actionOptions.modeVar,
					label: 'Threshold',
					tooltip: 'Varible must return an integer between 1 and 2500.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 1 || mode > 2500) {
					self.log('warn', `tile_av_delayed_threshold has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/tile_av_delayed_threshold`, {
					ints: [mode],
				})
			},
		},
		timecodeSelect: {
			name: 'Timecode Select',
			description: `Used to select the displayed timecode format`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: timecodeSelectChoices[0].id,
					choices: timecodeSelectChoices,
					tooltip: 'Options: "OFF", "LTC", "VITC"',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/timecode_select`, {
					string: await context.parseVariablesInString(options.mode),
				})
			},
		},
		timingRefSource: {
			name: 'Timing Reference Source',
			description: `Reference selection for timing measurements`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Source',
					default: timingRefSourceChoices[0].id,
					choices: timingRefSourceChoices,
					tooltip: 'Options: TIMING_REF_SOURCE_BLACK, TIMING_REF_SOURCE_PTP, TIMING_REF_SOURCE_INTERNAL',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/timing_ref_source`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		vectorGain: {
			name: 'Vector Fixed Gain',
			description: `Set the fixed gain for Vectorscope traces`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Gain',
					default: vectorGainChoices[0].id,
					choices: vectorGainChoices,
					tooltip: 'Options: VECTOR_GAIN_X1, VECTOR_GAIN_X2, VECTOR_GAIN_X5, VECTOR_GAIN_X10',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/vector_gain/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		vectorVarEnable: {
			name: 'Vector Gain - Variable Enable',
			description: `Enable/disable vectorscope variable gain`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: vectorVarEnableChoices[0].id,
					choices: vectorVarEnableChoices,
					tooltip: 'Options are VECTOR_VAR_ENABLE_ON or VECTOR_VAR_ENABLE_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/vector_var_enable/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		vectorLut: {
			name: 'Vector LUT',
			description: `Vector - Conversion to Rec.709(LUT)`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: vectorLutChoices[0].id,
					choices: vectorLutChoices,
					tooltip: 'Options: VECTOR_LUT_OFF, VECTOR_LUT_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/vector_lut/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		vectorIqAxis: {
			name: 'Vector IQ Axis',
			description: `Show/Hide Vectorscope IQ Axis`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: vectorIqAxisChoices[0].id,
					choices: vectorIqAxisChoices,
					tooltip: 'Options: 0 to Hide Axis, 1 to Show Axis',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/vector_iq_axis/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		vectorSdiCompassRose: {
			name: 'Vector SDI Compass Rose',
			description: `Show/Hide Vectorscope SDI Compass Rose`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: vectorSdiCompassRoseChoices[0].id,
					choices: vectorSdiCompassRoseChoices,
					tooltip: 'Options: 0 to Hide Compass Rose, 1 to Show Compass Rose',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/vector_sdi_compass_rose/${await parseTileScope(options, self, context)}`, {
					ints: [parseInt(await context.parseVariablesInString(options.mode))],
				})
			},
		},
		sdiVidOut: {
			name: 'SDI Video Out',
			description: `Configure the output mode for the SDI generator`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sdiVidOutChoices[0].id,
					choices: sdiVidOutChoices,
					tooltip: 'Options are VID_OUT_MODE_LOOPOUT and VID_OUT_MODE_GEN',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/sdi_vid_out`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		sdiGenEnable: {
			name: 'SDI Generator',
			description: `Enable/disable SDI signal generation`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sdiGenEnableChoices[0].id,
					choices: sdiGenEnableChoices,
					tooltip: 'Options: VID_OUT_SDI_GEN_ENABLE_ON, VID_OUT_SDI_GEN_ENABLE_OFF',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/sdi_gen_enable`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		sdiGenVideoMovingPix: {
			name: 'SDI Generator Moving Picture Mode',
			description: `Turn off/on video output moving picture mode for the SDI generator`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: sdiGenVideoMovingPixChoices[0].id,
					choices: sdiGenVideoMovingPixChoices,
					tooltip: 'Options: VID_OUT_SDI_MOVING_PIX_MODE_OFF, VID_OUT_SDI_MOVING_PIX_MODE_ON',
				},
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/sdi_gen_video_moving_pix`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformMode: {
			name: 'Waveform Mode',
			description: `Set/Read Waveform Display Mode`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformModeChoices[0].id,
					choices: waveformModeChoices,
					tooltip: 'Options: WAVEFORM_MODE_YPBPR, WAVEFORM_MODE_RGB, WAVEFORM_MODE_YRGB',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_mode/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformFilterYpbpr: {
			name: 'Waveform Filter YPbRr',
			description: `Waveform Filter for YPbPr mode - Select filter to be applied to the video`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformFilterChoices[0].id,
					choices: waveformFilterChoices,
					tooltip: 'Options are WAVEFORM_FILTER_FLAT : Flat Filter and WAVEFORM_FILTER_LOW_PASS : Low Pass Filter',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_filter_ypbpr/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformFilterRgb: {
			name: 'Waveform Filter RGB',
			description: `Waveform Filter for RGB mode - Select filter to be applied to the video`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformFilterChoices[0].id,
					choices: waveformFilterChoices,
					tooltip: 'Options are WAVEFORM_FILTER_FLAT : Flat Filter and WAVEFORM_FILTER_LOW_PASS : Low Pass Filter',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_filter_rgb/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformFilterYrgb: {
			name: 'Waveform Filter YRGB',
			description: `Waveform Filter for YRGB mode - Select filter to be applied to the video`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformFilterChoices[0].id,
					choices: waveformFilterChoices,
					tooltip: 'Options are WAVEFORM_FILTER_FLAT : Flat Filter and WAVEFORM_FILTER_LOW_PASS : Low Pass Filter',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_filter_yrgb/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformSweep: {
			name: 'Waveform Sweep',
			description: `Set/Read Waveform Display Style and Sweep. Setting the sweep to a multi-line or field mode will disable line select`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformSweepChoices[0].id,
					choices: waveformSweepChoices,
					tooltip:
						'Options: 16 for Parade style 1 line sweep, 18 for Parade style 1 field sweep, 0 for Overlay style 1 line sweep, 1 for Overlay style 2 line sweep, 2 for Overlay style 1 field sweep, 3 for Overlay style 2 field sweep',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_sweep/${await parseTileScope(options, self, context)}`, {
					ints: [parseInt(await context.parseVariablesInString(options.mode))],
				})
			},
		},
		waveformColorTrace: {
			name: 'Waveform Color Trace',
			description: `Set the appearance of Waveform trace`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformColorTraceChoices[0].id,
					choices: waveformColorTraceChoices,
					tooltip: 'Options are WAVEFORM_COLOR_TRACE_OFF or WAVEFORM_COLOR_TRACE_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_color_trace/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformGain: {
			name: 'Waveform Fixed Gain',
			description: `Set/Read Waveform Fixed Gain`,
			options: [
				{
					...actionOptions.integerInput,
					label: 'Gain',

					default: 1,
					min: 1,
					max: 10,
				},
				{
					...actionOptions.modeVar,
					label: 'Gain',
					tooltip: 'Varible must return an integer between 1 and 10.',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const mode = options.useVar
					? parseInt(await context.parseVariablesInString(options.modeVar))
					: parseInt(options.mode)
				if (isNaN(mode) || mode < 1 || mode > 10) {
					self.log('warn', `waveform_gain has been passed an out of range variable: ${mode}`)
					return undefined
				}
				return await self.postCommand(`/waveform_gain/${await parseTileScope(options, self, context)}`, {
					ints: [mode],
				})
			},
		},
		waveformVarEnable: {
			name: 'Waveform Variable Gain Enable',
			description: `Enable/disable waveform variable Gain`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: waveformVarEnableChoices[0].id,
					choices: waveformVarEnableChoices,
					tooltip: 'Options: WAVEFORM_VAR_ENABLE_OFF to Disable, WAVEFORM_VAR_ENABLE_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_var_enable/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformHmag: {
			name: 'Waveform Hmag',
			description: `Waveform Hmag & Best View`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'hmag',
					label: 'Hmag',
					default: 1,
					min: 1,
					max: 25,
				},
				{
					...actionOptions.modeVar,
					id: 'hmagVar',
					label: 'Hmag',
					tooltip: 'Varible must return an integer between 1 and 25.',
				},
				{
					...actionOptions.modeDropdown,
					id: 'bestView',
					label: 'Best view',
					default: 0,
					choices: waveformHmagChoices,
					tooltip: 'Options Best View: 0 for Disable, 1 for Enable.',
				},
				actionOptions.useVar,
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				const hmag = options.useVar
					? parseInt(await context.parseVariablesInString(options.hmagVar))
					: parseInt(options.hmag)
				const bestView = parseInt(await context.parseVariablesInString(options.bestView))
				if (isNaN(hmag) || hmag < 1 || hmag > 25) {
					self.log('warn', `Waveform Hmag: Hmag out of range: ${hmag}`)
					return undefined
				}
				if (isNaN(bestView) || bestView < 0 || bestView > 1) {
					self.log('warn', `Waveform Hmag: Best View out of range: ${bestView}`)
					return undefined
				}
				return await self.postCommand(`/waveform_hmag/${await parseTileScope(options, self, context)}`, {
					ints: [hmag, bestView],
				})
			},
		},
		waveformVerticalCursorEnable: {
			name: 'Waveform Verticle Cursor',
			description: `Enable/disable waveform verticle cursor`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: waveformVerticalCursorEnableChoices[0].id,
					choices: waveformVerticalCursorEnableChoices,
					tooltip: 'Valid options are WAVEFORM_VERTICAL_CURSOR_ENABLE_ON or WAVEFORM_VERTICAL_CURSOR_ENABLE_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/waveform_vertical_cursor_enable/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		waveformHorizontalCursorEnable: {
			name: 'Waveform Horizontal Cursor',
			description: `Enable/disable waveform horizontal cursor`,
			options: [
				{
					...actionOptions.modeDropdown,
					label: 'Enable',
					default: waveformHorizontalCursorEnableChoices[0].id,
					choices: waveformHorizontalCursorEnableChoices,
					tooltip: 'Valid options are WAVEFORM_HORIZONTAL_CURSOR_ENABLE_ON or WAVEFORM_HORIZONTAL_CURSOR_ENABLE_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(
					`/waveform_horizontal_cursor_enable/${await parseTileScope(options, self, context)}`,
					{
						ints: [await context.parseVariablesInString(options.mode)],
					},
				)
			},
		},
		waveformGratSdiUnits: {
			name: 'Waveform SDI Graticle Units',
			description: `SDI graticule units`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformGratSdiUnits[0].id,
					choices: waveformGratSdiUnits,
					tooltip:
						'Options: WAVEFORM_GRAT_SDI_UNITS_MV, WAVEFORM_GRAT_SDI_UNITS_PERCENT, WAVEFORM_GRAT_SDI_UNITS_NITS, WAVEFORM_GRAT_SDI_UNITS_REFLECTANCE, WAVEFORM_GRAT_SDI_UNITS_STOP, WAVEFORM_GRAT_SDI_UNITS_CV',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_grat_sdi_units/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformLut: {
			name: 'Waveform LUT',
			description: `Waveform - Conversion to Rec.709(LUT)`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformLutChoices[0].id,
					choices: waveformLutChoices,
					tooltip: 'Options: WAVEFORM_LUT_OFF, WAVEFORM_LUT_ON. Default: WAVEFORM_LUT_OFF',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_lut/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		waveformActiveArea: {
			name: 'Waveform Active Area',
			description: `Enable/Disable display of Active Picture Area only in line sweeps`,
			options: [
				{
					...actionOptions.modeDropdown,
					default: waveformActiveAreaChoices[0].id,
					choices: waveformActiveAreaChoices,
					tooltip: 'Options : WAVEFORM_ACTIVE_AREA_OFF, WAVEFORM_ACTIVE_AREA_ON',
				},
				actionOptions.tiles,
			],
			callback: async ({ options }, context) => {
				return await self.postCommand(`/waveform_active_area/${await parseTileScope(options, self, context)}`, {
					ints: [await context.parseVariablesInString(options.mode)],
				})
			},
		},
		loudnessLoudLevel: {
			name: 'Loudness Loud Level',
			description: `Set Loudness Loud Level`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'level',
					label: 'Level',
					default: -6,
					min: -31,
					max: 0,
				},
				{
					...actionOptions.modeVar,
					id: 'levelVar',
					label: 'Level',
					tooltip: 'Varible must return a number between -31 and 0.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const level = options.useVar
					? parseInt(await context.parseVariablesInString(options.levelVar))
					: parseInt(options.level)
				if (isNaN(level) || level < -31 || level > 0) {
					self.log('warn', `level out of range: ${level}`)
					return undefined
				}
				return await self.postCommand(`/loudness_loud_level/`, {
					floats: [level],
				})
			},
		},
		loudnessQuietLevel: {
			name: 'Loudness Quiet Level',
			description: `Set Loudness Quiet Level`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'level',
					label: 'Level',
					default: -30,
					min: -60,
					max: 0,
				},
				{
					...actionOptions.modeVar,
					id: 'levelVar',
					label: 'Level',
					tooltip: 'Varible must return a number between -60 and 0.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const level = options.useVar
					? parseInt(await context.parseVariablesInString(options.levelVar))
					: parseInt(options.level)
				if (isNaN(level) || level < -60 || level > 0) {
					self.log('warn', `level out of range: ${level}`)
					return undefined
				}
				return await self.postCommand(`/loudness_quiet_level/`, {
					floats: [level],
				})
			},
		},
		loudnessTargetLevel: {
			name: 'Loudness Target Level',
			description: `Set Loudness Target Level`,
			options: [
				{
					...actionOptions.integerInput,
					id: 'target',
					label: 'Target',
					default: -23,
					min: -31,
					max: 0,
				},
				{
					...actionOptions.modeVar,
					id: 'targetVar',
					label: 'Target',
					tooltip: 'Varible must return a number between -31 and 0.',
				},
				{
					...actionOptions.integerInput,
					id: 'high',
					label: 'High',
					default: 2,
					min: 0,
					max: 10,
					step: 0.1,
				},
				{
					...actionOptions.modeVar,
					id: 'highVar',
					label: 'High',
					tooltip: 'Varible must return a number between 0 and 10.',
				},
				{
					...actionOptions.integerInput,
					id: 'low',
					label: 'Low',
					default: 2,
					min: 0,
					max: 10,
					step: 0.1,
				},
				{
					...actionOptions.modeVar,
					id: 'lowVar',
					label: 'Low',
					tooltip: 'Varible must return a number between 0 and 10.',
				},
				actionOptions.useVar,
			],
			callback: async ({ options }, context) => {
				const target = options.useVar
					? parseInt(await context.parseVariablesInString(options.targetVar))
					: parseInt(options.target)
				const high = options.useVar
					? parseInt(Number(await context.parseVariablesInString(options.highVar)) * 10) / 10
					: options.high
				const low = options.useVar
					? parseInt(Number(await context.parseVariablesInString(options.lowVar)) * 10) / 10
					: options.low
				if (
					isNaN(target) ||
					target < -31 ||
					target > 0 ||
					isNaN(low) ||
					low < 0 ||
					low > 10 ||
					isNaN(high) ||
					high < 0 ||
					high > 10
				) {
					self.log('warn', `loudnessTargetLevel params out of range. Target: ${target}, High: ${high}, Low: ${low}`)
					return undefined
				}
				return await self.postCommand(`/loudness_target_level/`, {
					object: {
						target: target,
						targetLow: low,
						targetHigh: high,
					},
				})
			},
		},
	})
}

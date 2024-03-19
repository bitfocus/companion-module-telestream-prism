const { InstanceStatus, Regex } = require('@companion-module/base')
const {
	tiles,
	ip,
	config,
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
} = require('./choices.js')

module.exports = function (self) {
	self.setActionDefinitions({
		changeInput: {
			name: 'Select Video Input',
			description: `Change the unit's active input`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'set',
					choices: activeInputChoices,
				},
				{
					id: 'input',
					type: 'number',
					label: 'Input',
					default: 0,
					min: 0,
					max: 5,
					range: true,
					step: 1,
					isVisible: (options) => {
						return options.useVar === false && options.action == 'set'
					},
				},
				{
					id: 'inputVar',
					type: 'textinput',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true && options.action == 'set'
					},
					tooltip: 'Varible must return an integer between 0 and 5',
				},
				{
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
					isVisible: (options) => {
						return options.action == 'set'
					},
				},
			],
			callback: async ({ options }) => {
				let prismInput
				switch (options.action) {
					case 'set':
						prismInput = options.useVar
							? parseInt(await self.parseVariablesInString(options.inputVar))
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
				let msg = JSON.stringify({ input: prismInput })
				try {
					const response = await self.axios.post('/activeinput', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
					self.getInput()
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
			subscribe: () => {
				self.getInput()
			},
		},
		getPresets: {
			name: 'Get Presets',
			description: `Get list of presets`,
			options: [],
			callback: () => {
				self.getPresets()
			},
			subscribe: () => {
				self.getPresets()
			},
		},
		loadPreset: {
			name: 'Load Preset',
			description: `Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]". Or recall Factory Preset by sending "factory".`,
			options: [
				{
					id: 'preset',
					type: 'dropdown',
					label: 'Preset',
					default: 'factory',
					choices: self.prism.presets,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]"',
				},
			],
			callback: async ({ options }) => {
				try {
					let preset = JSON.stringify({ string: await self.parseVariablesInString(options.preset) })
					const response = await self.axios.post('/loadpreset', preset)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
			subscribe: () => {
				self.getPresets()
			},
		},
		ancSessionControl: {
			name: 'ANC Session Control',
			description: `Reset anc session.`,
			options: [],
			callback: async () => {
				let msg = JSON.stringify({ ints: ['ANC_ENGINE_SESSION_CONTROL_RESET'] })
				try {
					const response = await self.axios.post('/anc_session_control', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioSessionControl: {
			name: 'Audio Session Control',
			description: `Stop, Run or Reset the audio session.`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'AUDIO_SESSION_CONTROL_STOP',
					choices: audioSessionControlChoices,
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [options.action] })
				try {
					const response = await self.axios.post('/audio_session_control', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessSessionControl: {
			name: 'Loudness Session Control',
			description: `Stop, Run or Reset the loudness session.`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'LOUDNESS_SESSION_CONTROL_STOP',
					choices: loudnessSessionControlChoices,
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [options.action] })
				try {
					const response = await self.axios.post('/loudness_session_control', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		videoSessionControl: {
			name: 'Video Session Control',
			description: `Stop, Run or Reset the video session.`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'IOSLAVE_SESSION_CONTROL_STOP',
					choices: videoSessionControlChoices,
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [options.action] })
				try {
					const response = await self.axios.post('/video_session_control', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		ipSessionControl: {
			name: 'IP Session Control',
			description: `Stop, Run or Reset the IP session.`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'IOSLAVE_SESSION_CONTROL_STOP',
					choices: ipSessionControlChoices,
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [options.action] })
				try {
					const response = await self.axios.post('/ip_session_control', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		tileSelect: {
			name: 'Tile Select',
			description: `Select a tile to expand to full screen.`,
			options: [
				{
					id: 'tile',
					type: 'dropdown',
					label: 'Tile',
					default: 0,
					choices: tileSelectChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Variable must return an integer between 0 and 8.',
				},
			],
			callback: async ({ options }) => {
				let tile = parseInt(await self.parseVariablesInString(options.tile))
				if (isNaN(tile) || tile < 0 || tile > 8) {
					self.log('warn', `An out of range variable has been passed to Tile Select: ${tile}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [tile] })
				try {
					const response = await self.axios.post('/tile_select', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		tileFullscreenMode: {
			name: 'Tile Fullscreen Mode',
			description: `Set the mode of fullscreen for the secondary display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'mode',
					default: 'TILE_FULLSCREEN_MODE_NORMAL',
					choices: tileFullscreenModeChoices,
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [options.mode] })
				try {
					const response = await self.axios.post('/tile_fullscreen_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		tileInFocus: {
			name: 'Tile In Focus',
			description: `Select a tile to set the context of the application menu. If the application menu is open, a colored ring will appear around the selected tile.`,
			options: [
				{
					id: 'tile',
					type: 'dropdown',
					label: 'Tile',
					default: 1,
					choices: tileInFocusChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Variable must return an integer between 1 and 8.',
				},
			],
			callback: async ({ options }) => {
				let tile = parseInt(await self.parseVariablesInString(options.tile))
				if (isNaN(tile) || tile < 1 || tile > 8) {
					self.log('warn', `An out of range variable has been passed to Tile In Focus: ${tile}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [tile] })
				try {
					const response = await self.axios.post('/tile_in_focus', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioBallistic: {
			name: 'Audio Ballistic',
			description: `Ballistic Type for Audio Bars.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Ballistic Mode',
					default: 'AUDIO_BALLISTIC_PPM_1',
					choices: audioBallisticChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available Options: AUDIO_BALLISTIC_PPM_1, AUDIO_BALLISTIC_PPM_2, AUDIO_BALLISTIC_TRUE_PEAK.',
				},
			],
			callback: async ({ options }) => {
				let ballistic = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [ballistic] })
				try {
					const response = await self.axios.post('/audio_ballistic', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessMeteringMode: {
			name: 'Loudness Metering Mode',
			description: `The mode defines which weighting function and gating techniques are used when loudness metering is performed.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Loudness Metering Mode',
					default: 'LOUDNESS_METER_MODE_1770_2_DI',
					choices: loudnessMeteringModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Available options are: LOUDNESS_METER_MODE_1770_2_DI, LOUDNESS_METER_MODE_1770_1_DI, LOUDNESS_METER_MODE_1770_2, LOUDNESS_METER_MODE_LEQA_DI',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_metering_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessFullScaleUnits: {
			name: 'Loudness Full Scale Unit',
			description: `Full scale unit selection for Loudness Auxiliary Display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Full Scale Units',
					default: 'LOUDNESS_FULL_SCALE_UNITS_LUFS',
					choices: loudnessFullScaleUnitsChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available options are: LOUDNESS_FULL_SCALE_UNITS_LUFS, LOUDNESS_FULL_SCALE_UNITS_LKFS',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_full_scale_units', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessTruePeakDcBlock: {
			name: 'Loudness True Peak DC Blocking Filter',
			description: `Boolean indicating whether the DC Blocking filter is used for true‐peak measurements`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'DC Blocking Mode',
					default: 'TRUE_PEAK_DC_BLOCK_OFF',
					choices: loudnessTruePeakDcBlockChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available options are: TRUE_PEAK_DC_BLOCK_OFF, TRUE_PEAK_DC_BLOCK_ON',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_true_peak_dc_block', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessTruePeakEmphasis: {
			name: 'Loudness True Peak Emphasis',
			description: `Boolean indicating whether the emphasis filter is used for true-peak measurements`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Emphasis',
					default: 'TRUE_PEAK_EMPHASIS_OFF',
					choices: loudnessTruePeakEmphasisChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available options are: TRUE_PEAK_EMPHASIS_OFF, TRUE_PEAK_EMPHASIS_ON',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_true_peak_emphasis', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessBallistic: {
			name: 'Loudness Ballistic',
			description: `Selection for Program Loudness Bar Ballistic type.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Emphasis',
					default: 'LOUDNESS_BALLISTIC_SHORT_AVERAGE',
					choices: loudnessBallisticChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Available options are: LOUDNESS_BALLISTIC_SHORT_AVERAGE, LOUDNESS_BALLISTIC_LONG_AVERAGE, LOUDNESS_BALLISTIC_EBU_R128_M',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_ballistic', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessShortGatingWindow: {
			name: 'Loudness Short Gating Window',
			description: `Set the duration of the Short Term Loudness Gating window.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Gating Window',
					default: 'LOUDNESS_SHORT_GATING_WINDOW_EBU_R128_3S',
					choices: loudnessShortGatingWindowChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Available options are: LOUDNESS_SHORT_GATING_WINDOW_EBU_R128_3S, LOUDNESS_SHORT_GATING_WINDOW_LEGACY_10S',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_short_gating_window', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		loudnessLoadPreset: {
			name: 'Loudness Load Preset',
			description: `Load a predefined Loudness Meter Configuration preset.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Preset',
					default: 'LOUDNESS_PRESET_EBU_R128_2014',
					choices: loudnessLoadPresetChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available Option: LOUDNESS_PRESET_EBU_R128_2014, LOUDNESS_PRESET_ATSC_A85_2013',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/loudness_load_preset', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioProgramSurroundOrder: {
			name: 'Audio Program Surround Order',
			description: `Select audio program surround order.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Gating Window',
					default: 'AUDIO_PROGRAM_SURROUND_ORDER_LRC',
					choices: audioProgramSurroundOrderChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available Options: AUDIO_PROGRAM_SURROUND_ORDER_LRC, AUDIO_PROGRAM_SURROUND_ORDER_LCR',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/audio_program_surround_order', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		dolbyMetadataSource: {
			name: 'Dolby Metadata Source',
			description: `Dolby metadata source selection.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Metadata Source',
					default: 'DOLBY_METADATA_SOURCE_AUTO',
					choices: dolbyMetadataSourceChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Available options are DOLBY_METADATA_SOURCE_AUTO, DOLBY_METADATA_SOURCE_AES and DOLBY_METADATA_SOURCE_VANC',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/dolby_metadata_source', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioDownmixMode: {
			name: 'Audio Downmix Mode',
			description: `Audio Downmix mode selection.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Downmix Mode',
					default: 'AUDIO_DOWNMIX_MODE_LO_RO',
					choices: audioDownmixModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Available options are AUDIO_DOWNMIX_MODE_LO_RO, AUDIO_DOWNMIX_MODE_LT_RT and AUDIO_DOWNMIX_MODE_MONO',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/audio_downmix_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioSoloMode: {
			name: 'Audio Solo Mode',
			description: `Set solo display mode for the Audio App.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Downmix Mode',
					default: 'AUDIO_SOLO_MUTE_MODE_SOLO_ON',
					choices: audioSoloModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_SOLO_MUTE_MODE_SOLO_ON : Enables solo display, AUDIO_SOLO_MUTE_MODE_OFF : Disables solo display',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/audio_solo_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		dolbyDrcMode: {
			name: 'Dolby DRC Mode',
			description: `Dolby D DRC compression mode selection.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DOLBY_DRC_MODE_OFF',
					choices: dolbyDrcModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available options: AUDIO_DOLBY_DRC_MODE_OFF, AUDIO_DOLBY_DRC_MODE_LINE and AUDIO_DOLBY_DRC_MODE_RF',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/dolby_drc_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		analogAudioOutputMode: {
			name: 'Analog Audio Output Mode',
			description: `Channels selection mode for Analog audio output.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'ANALOG_AUDIO_OUT_DISCRETE_CHANNELS',
					choices: analogAudioOutputModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options are ANALOG_AUDIO_OUT_DISCRETE_CHANNELS and ANALOG_AUDIO_OUT_DOWNMIX',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/analog_audio_output_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioAuxDisplayMode: {
			name: 'Analog Aux Display Mode',
			description: `Set audio auxiliary display mode for the Audio App.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_AUX_DISPLAY_MODE_NONE',
					choices: audioAuxDisplayModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_AUX_DISPLAY_MODE_NONE : No Aux Display, AUDIO_AUX_DISPLAY_MODE_LISSAJOUS : Phase Display, AUDIO_AUX_DISPLAY_MODE_SURROUND : Surround Display, AUDIO_AUX_DISPLAY_MODE_LOUD : Loudness Display',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/audio_aux_display_mode/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioDisplayLoudnessMeter: {
			name: 'Audio Display Loudness Meter',
			description: `Enable/disable audio Loudness meter.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DISPLAY_LOUDNESS_METER_OFF',
					choices: audioDisplayLoudnessMeterChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AUDIO_DISPLAY_LOUDNESS_METER_OFF to Disable, AUDIO_DISPLAY_LOUDNESS_METER_ON to Enable',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/audio_display_loudness_meter/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioSessionDisplay: {
			name: 'Audio Session Display',
			description: `Enable/disable audio session display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_SESSION_DISPLAY_OFF',
					choices: audioSessionDisplayChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AUDIO_SESSION_DISPLAY_OFF to Disable, AUDIO_SESSION_DISPLAY_ON to Enable',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/audio_session_display/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		surroundDominanceIndicator: {
			name: 'Surrond Dominance Indicator',
			description: `Enable/disable audio surround dominance indicator.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DISPLAY_SURROUND_DOMINANCE_OFF',
					choices: surroundDominanceIndicatorChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_DOMINANCE_OFF to Disable, AUDIO_DISPLAY_SURROUND_DOMINANCE_ON to Enable.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/surround_dominance_indicator/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		surroundImmersiveDominanceIndicator: {
			name: 'Surrond Immersive Dominance Indicator',
			description: `Enable/disable audio surround immersive dominance indicator.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_OFF',
					choices: surroundImmersiveDominanceIndicatorChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_OFF to Disable, AUDIO_DISPLAY_SURROUND_IMMERSIVE_DOMINANCE_ON to Enable.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/surround_immersive_dominance_indicator/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		surroundBedSelect: {
			name: 'Surrond Bed Select',
			description: `Select required surround sound bed.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DISPLAY_SURROUND_BED_SELECT_MAIN',
					choices: surroundBedSelectChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_BED_SELECT_MAIN to display only main bed, AUDIO_DISPLAY_SURROUND_BED_SELECT_UPPER to display only upper bed, AUDIO_DISPLAY_SURROUND_BED_SELECT_BOTH to display both.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/surround_bed_select/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		surroundImmersivePsiBedSelect: {
			name: 'Surrond Immersive PSU Bed Select',
			description: `Select required PSI Bed.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_MAIN',
					choices: surroundImmersivePsiBedSelectChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_MAIN to display only main bed PSI, AUDIO_DISPLAY_SURROUND_PSI_BED_SELECT_UPPER to display only upper bed PSI.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/surround_immersive_psi_bed_select/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		avdelayUserOffsetMode: {
			name: 'A/V Delay User Offset Mode',
			description: `Apply User Offset to Audio Video Measure.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AVDELAY_USER_OFFSET_MODE_OFF',
					choices: avdelayUserOffsetModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AVDELAY_USER_OFFSET_MODE_OFF, AVDELAY_USER_OFFSET_MODE_ON',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/avdelay_user_offset_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		sdiLoopThrough: {
			name: 'SDI Loop Through',
			description: `Enables or Disables SDI loop through functionality.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'MEDIA_MODE_IP_2_IN',
					choices: sdiLoopThroughChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: `Available options: MEDIA_MODE_IP_2_IN for turning loop through 'On' and MEDIA_MODE_IP_4_IN for turning loop through 'Off'`,
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/sdi_loop_through', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		ipVideoPhyBitRate: {
			name: 'IP Video PHY Bit Rate',
			description: `Select the Ethernet bit rate of the IP video ports in Gbps. Setting the bit rate for one port affects both ports.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: [25],
					choices: ipVideoPhyBitRateChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Valid values are 10 or 25 for MPI-25 and MPX-25 systems.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'IP1',
					choices: ip,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires a scope of IP1 or IP2',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/ip_video_phy_bit_rate/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		ipVideoPhyFecMode: {
			name: 'IP Video PHY FEC Mode',
			description: `Enable Ethernet FEC on IP video ports when configured for 25 Gbps. FEC mode is ignored when IP video ports configured for 10 Gbps bit rate. Setting the FEC mode for one port affects both ports.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'FEC Mode',
					default: 'BD_IFC_IP_VIDEO_PHY_FEC_MODE_BYPASS',
					choices: ipVideoPhyFecModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: BD_IFC_IP_VIDEO_PHY_FEC_MODE_BYPASS, BD_IFC_IP_VIDEO_PHY_FEC_MODE_ENABLE.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'IP1',
					choices: ip,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires a scope of IP1 or IP2',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/ip_video_phy_fec_mode/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappDisplayType: {
			name: 'Cam App Display Type',
			description: `Set display type of CAM App traces.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'CAMAPP_DISPLAY_TYPE_WAVEFORM',
					choices: camappDisplayTypeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: CAMAPP_DISPLAY_TYPE_WAVEFORM and CAMAPP_DISPLAY_TYPE_STOP',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_display_type/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappGain: {
			name: 'Cam App Gain',
			description: `Set the fixed gain for CAM App traces.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Gain',
					default: 'CAMAPP_GAIN_X1',
					choices: camappGainChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: CAMAPP_GAIN_X1, CAMAPP_GAIN_X2, CAMAPP_GAIN_X5 and CAMAPP_GAIN_X10.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappSweep: {
			name: 'Cam App Sweep',
			description: `Set the sweep for CAM App traces.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Sweep',
					default: 'CAMAPP_SWEEP_1_LINE',
					choices: camappSweepChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: CAMAPP_SWEEP_1_LINE and CAMAPP_SWEEP_1_FIELD.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_sweep/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappFilter: {
			name: 'Cam App Filer',
			description: `Select the filter to be applied to the video - Flat or Low Pass.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Filter',
					default: 'CAMAPP_FILTER_FLAT',
					choices: camappFilterChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: CAMAPP_FILTER_FLAT and CAMAPP_FILTER_LOW_PASS.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_filter/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappThumbnail: {
			name: 'Cam App Thumbnail',
			description: `Control Thumbnail display in CAM App.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Filter',
					default: 'CAMAPP_THUMBNAIL_ON',
					choices: camappThumbnailChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: CAMAPP_THUMBNAIL_ON, CAMAPP_THUMBNAIL_OFF.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_thumbnail/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		camappGraticuleUnits: {
			name: 'Cam App Graticle Units',
			description: `Set graticule units for CAM App traces. Options depend on the selected display type.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Units',
					default: 'CAMAPP_GRAT_UNITS_PERCENT',
					choices: camappGraticuleUnitsChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options for Waveform display type: CAMAPP_GRAT_UNITS_PERCENT, CAMAPP_GRAT_UNITS_NITS and CAMAPP_GRAT_UNITS_STOP. Options for Stop display type: CAMAPP_GRAT_UNITS_LOG_NITS and CAMAPP_GRAT_UNITS_LOG_STOP.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/camapp_graticule_units/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		diagnosticUrlPreset: {
			name: 'Diagnostic URL Preset',
			description: `Navigate to preset URL.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'URL',
					default: 'COMPOSITOR_URL_HOME',
					choices: diagnosticUrlPresetChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: COMPOSITOR_URL_HOME, COMPOSITOR_URL_TOUCH_TEST, COMPOSITOR_URL_RED, COMPOSITOR_URL_GREEN, COMPOSITOR_URL_BLUE, COMPOSITOR_URL_GRAY20, COMPOSITOR_URL_GRAY45, COMPOSITOR_URL_BLACK, COMPOSITOR_URL_WHITE',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/diagnostic_url_preset', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		extendedDisplayMode: {
			name: 'Extended Display Mode',
			description: `Set the display mode for single or dual display mode. Dual display mode requires the secondary display to be plugged into the DP2 port.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'COMPOSITOR_DISPLAY_MODE_SINGLE',
					choices: extendedDisplayModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: COMPOSITOR_DISPLAY_MODE_SINGLE, COMPOSITOR_DISPLAY_MODE_DOUBLE',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post('/extended_display_mode', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		diamondMode: {
			name: 'Diamond Mode',
			description: `Diamond display mode - normal or split.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 0,
					choices: diamondModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for normal diamond, 1 for split diamond.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode || mode < 0 || mode > 1)) {
					self.log('warn', `Mode out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/diamond_mode/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		diamondLut: {
			name: 'Diamond Lut',
			description: `Diamond 3D Lut On or Off.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'DIAMOND_LUT_OFF',
					choices: diamondLutChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: DIAMOND_LUT_OFF, DIAMOND_LUT_ON',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/diamond_lut/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		mpiLedBrightness: {
			name: 'MPI LED Brightness',
			description: `	Access LED brightness value. `,
			options: [
				{
					id: 'brightness',
					type: 'number',
					label: 'brightness',
					default: 0,
					min: 0,
					max: 31,
					range: true,
					step: 1,
					tooltip: 'Range: 4-31. Default: 0',
				},
			],
			callback: async ({ options }) => {
				let msg = JSON.stringify({ ints: [parseInt(options.brightness)] })
				try {
					const response = await self.axios.post('/mpi_led_brightness', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
					self.getInput()
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		mpiLedColor: {
			name: 'MPI LED Colour',
			description: `Set LED color.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Colour',
					default: 'LED_COLOR_OFF',
					choices: mpiLedColorChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: LED_COLOR_OFF, LED_COLOR_GREEN, LED_COLOR_RED, LED_COLOR_YELLOW, LED_COLOR_BLUE, LED_COLOR_CYAN, LED_COLOR_MAGENTA, LED_COLOR_WHITE. Default: LED_COLOR_OFF. Note: LED_COLOR_BLUE, LED_COLOR_CYAN AND LED_COLOR_MAGENTA options are supported on only MPS and MPD devices',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: mode })
				try {
					const response = await self.axios.post('/mpi_led_color', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		extrefSweep: {
			name: 'External Reference Sweep',
			description: `Set/Read External Reference Sweep mode.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 0,
					choices: extrefSweepChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: '0 for 1 line sweep, 1 for 2 line sweep, 2 for 1 field sweep, 3 for 2 field sweep',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Sweep Mode out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/extref_sweep/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		extrefGain: {
			name: 'External Reference Gain',
			description: `Set/Read External Reference Fixed Gain.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Gain',
					default: 0,
					choices: extrefGainChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 1, 2 and 5.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || (mode !== 1 && mode !== 2 && mode !== 5)) {
					self.log('warn', `Gain out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/extref_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		extrefHmag: {
			name: 'External Reference Hmag',
			description: `External Reference Hmag & Best View`,
			options: [
				{
					id: 'hmag',
					type: 'dropdown',
					label: 'Hmag',
					default: 0,
					choices: extrefHmagChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options for Hmag: 0 for Disable, 1 for Enable.',
				},
				{
					id: 'bestView',
					type: 'dropdown',
					label: 'Best view',
					default: 0,
					choices: extrefHmagChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options Best View: 0 for Disable, 1 for Enable.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let hmag = parseInt(await self.parseVariablesInString(options.hmag))
				let bestView = parseInt(await self.parseVariablesInString(options.bestView))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(hmag) || hmag < 0 || hmag > 1) {
					self.log('warn', `Hmag out of range: ${hmag}`)
					return undefined
				}
				if (isNaN(bestView) || bestView < 0 || bestView > 1) {
					self.log('warn', `Best View out of range: ${bestView}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [hmag, bestView] })
				try {
					const response = await self.axios.post(`/extref_hmag/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		eyeMeterEnable: {
			name: 'Eye Jitter Meter Enable',
			description: `Enable eye jitter meter display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 0,
					choices: eyeMeterEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for eye display off, 1 for eye display on.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Mode out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/eye_meter_enable/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		eyeSweep: {
			name: 'Eye Sweep Rate',
			description: `Sweep rate for eye pattern display. `,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Rate',
					default: 0,
					choices: eyeSweepChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for 3 Eye, 1 for word (10 Eye/20 Eye), 2 for 1 field, 3 for 2 field',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Rate out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/eye_sweep/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		fpTestMode: {
			name: 'Front Panel Test Mode',
			description: `Used to put the front panel into a diagnostic mode. `,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'FP_TEST_MODE_NONE',
					choices: fpTestModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options are: FP_TEST_MODE_NONE, FP_TEST_MODE_BUTTON, FP_TEST_MODE_LED',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/eye_sweep`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopSweep: {
			name: 'Stop Sweep',
			description: `Set/Read Stop Display Style and Sweep. Setting the sweep to a multi-line or field mode will disable line select.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 16,
					choices: stopSweepChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for 3 Eye, 1 for word (10 Eye/20 Eye), 2 for 1 field, 3 for 2 field',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 18) {
					self.log('warn', `Rate out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_sweep/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopColorTrace: {
			name: 'Stop Colour Trace',
			description: `Set the appearance of Stop trace color.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'FSTOP_COLOR_TRACE_OFF',
					choices: stopColorTraceChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: FSTOP_COLOR_TRACE_OFF or FSTOP_COLOR_TRACE_ON',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_color_trace/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopDisplayGain: {
			name: 'Stop Display Fixed Gain',
			description: `Set the stop display fixed gain.`,
			options: [
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 0,
					min: 0,
					max: 10,
					range: true,
					step: 1,
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let gain = parseInt(await self.parseVariablesInString(options.gain))
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [gain] })
				try {
					const response = await self.axios.post(`/stop_display_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopEnableBestGain: {
			name: 'Stop Enable Best Gain',
			description: `Enable/Disable best gain for stop display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'FSTOP_BEST_ENABLE_OFF',
					choices: stopEnableBestGainChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: FSTOP_BEST_ENABLE_OFF to Disable, FSTOP_BEST_ENABLE_ON to Enable.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_enable_best_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopHmag: {
			name: 'Stop Display Hmag',
			description: `Stop Display Hmag & Best View`,
			options: [
				{
					id: 'hmag',
					type: 'number',
					label: 'Hmag',
					default: 1,
					min: 1,
					max: 25,
					range: true,
					step: 1,
				},
				{
					id: 'bestView',
					type: 'dropdown',
					label: 'Best view',
					default: 0,
					choices: stopHmagChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options Best View: 0 for Disable, 1 for Enable.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let hmag = parseInt(options.hmag)
				let bestView = parseInt(await self.parseVariablesInString(options.bestView))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(hmag) || hmag < 1 || hmag > 25) {
					self.log('warn', `Hmag out of range: ${hmag}`)
					return undefined
				}
				if (isNaN(bestView) || bestView < 0 || bestView > 1) {
					self.log('warn', `Best View out of range: ${bestView}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [hmag, bestView] })
				try {
					const response = await self.axios.post(`/stop_hmag/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopActiveArea: {
			name: 'Stop Active Area',
			description: `Enable/Disable display of Active Picture Area only in line sweeps in Stop Display.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'FSTOP_ACTIVE_AREA_OFF',
					choices: stopActiveAreaChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: FSTOP_ACTIVE_AREA_OFF, FSTOP_ACTIVE_AREA_ON.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_active_area/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopGammaReference: {
			name: 'Stop Gamma Reference',
			description: `Select Camera gamma reference as display light referenced or scene light referenced.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Reference',
					default: 0,
					choices: stopGammaReferenceChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for scene light reference, 1 for display light reference.',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Reference out of range: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_gamma_reference/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		stopEnableLowPassFilter: {
			name: 'Stop Enable Low Pass Filter',
			description: `Enable/Disable the Low Pass Filter.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'FSTOP_LPF_ENABLE_OFF',
					choices: stopEnableLowPassFilterChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: FSTOP_LPF_ENABLE_OFF to Disable, FSTOP_LPF_ENABLE_ON to Enable',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/stop_enable_low_pass_filter/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		gpioPresetRecallEnable: {
			name: 'GPIO Preset Recall Enable',
			description: `Turns the ability to recall presets via GPIO pins On/Off.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'GPIO_PRESET_RECALL_ENABLE_OFF',
					choices: gpioPresetRecallEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: GPIO_PRESET_RECALL_ENABLE_ON, GPIO_PRESET_RECALL_ENABLE_OFF.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/gpio_preset_recall_enable`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		/* audioPairAuxOutMode: {
			name: 'Audio Pair Aux Out Mode',
			description: `Select audio aux out mode for ST2110.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUX_OUT_MODE_FIXED_CHANNELS',
					choices: audioPairAuxOutModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options are : AUX_OUT_MODE_FIXED_CHANNELS, AUX_OUT_MODE_PAIR_ON_CH1_CH2',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: mode })
				try {
					const response = await self.axios.post(`/audio_pair_aux_out_mode`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		}, */
		sourceConfigVidLinks: {
			name: 'Source Config Video Links',
			description: `Configuration setting for changing the number of links`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IOSLAVE_SOURCE_CONFIG_VID_LINKS_SINGLE',
					choices: sourceConfigVidLinksChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_VID_LINKS_SINGLE, IOSLAVE_SOURCE_CONFIG_VID_LINKS_QUAD',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/source_config_vid_links/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		sourceConfigColorimetry: {
			name: 'Source Config Colorimetry',
			description: `Configuration Setting for changing the Colorimetry`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IOSLAVE_SOURCE_CONFIG_COLORIMETRY_709',
					choices: sourceConfigColorimetryChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_COLORIMETRY_709, IOSLAVE_SOURCE_CONFIG_COLORIMETRY_BT2020',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/source_config_colorimetry/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		sourceConfigEotf: {
			name: 'Source Config EOTF',
			description: `Configuration Setting for changing the EOTF`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IOSLAVE_SOURCE_CONFIG_EOTF_SDR_NARROW',
					choices: sourceConfigEotfChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: IOSLAVE_SOURCE_CONFIG_EOTF_SDR_NARROW, IOSLAVE_SOURCE_CONFIG_EOTF_SDR_FULL, IOSLAVE_SOURCE_CONFIG_EOTF_PQ_NARROW, IOSLAVE_SOURCE_CONFIG_EOTF_PQ_FULL, IOSLAVE_SOURCE_CONFIG_EOTF_HLG, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG2, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3, IOSLAVE_SOURCE_CONFIG_EOTF_SLOG3_LIVE_HDR, IOSLAVE_SOURCE_CONFIG_EOTF_LOGC',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/source_config_eotf/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		audioInputType: {
			name: 'Audio Input Type',
			description: `Audio Input type selection`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_INPUT_TYPE_PCM',
					choices: audioInputTypeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AUDIO_INPUT_TYPE_PCM, AUDIO_INPUT_TYPE_DOLBY',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/audio_input_type/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		dolby_aes_pair: {
			name: 'Dolby AES Pair',
			description: `Select the AES channel pair for Dolby/Dolby-ED2 input`,
			options: [
				{
					id: 'mode',
					type: 'number',
					label: 'Input',
					default: 1,
					min: 1,
					max: 8,
					step: 1,
					range: true,
					tooltip: 'Options (DOLBY): 1 through 8. Valid Options (DOLBY ED2): 1 through 7',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/dolby_aes_pair/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		/* audioPcmProgram: {
			name: 'Audio PCM Program',
			description: `Enable/Disable custom program configuration for PCM channels`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'AUDIO_PCM_PROGRAM_OFF',
					choices: audioPcmProgramChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: AUDIO_PCM_PROGRAM_OFF, AUDIO_PCM_PROGRAM_ON',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: mode })
				try {
					const response = await self.axios.post(`/audio_pcm_program/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		}, */
		xmitMode2110: {
			name: 'ST 2110.21 Transmit Mode',
			description: `Set S2110.21 transmit mode to Gapped (N), Narrow Linear(NL), Wide Linear(W)`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_N',
					choices: xmitMode2110Choices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_N, IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_NL, IOSLAVE_SOURCE_CONFIG_2110_XMIT_MODE_W',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/xmit_mode_2110/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		trOffset2110: {
			name: 'ST 2110.21 TR Offset',
			description: `Set S2110.21 expected TR offset, in microseconds`,
			options: [
				{
					id: 'mode',
					type: 'number',
					label: 'Offset (μs)',
					default: -1,
					min: -1,
					max: 50000,
					step: 1,
					range: true,
					tooltip: 'Microseconds',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/tr_offset_2110/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		remoteConfigMode: {
			name: 'Remote Config Mode',
			description: `Enables/disables remote management client such as NMOS`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_OFF',
					choices: remoteConfigModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_OFF, IOSLAVE_SOURCE_CONFIG_REMOTE_MODE_NMOS',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'config0',
					choices: config,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Config/Input Scope: config0 to config5.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/remote_config_mode/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		inputEditMode: {
			name: 'Input Edit Mode',
			description: `Hides the menu options (Recall, Config, Rename) in the UI that appear on pressing a virtual input button and enables recalling the virtual input directly. Note: This selection is only applicable for the user interface's input control menu; Input Selection or Rename will be functional from the API irrespective of this selection`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Edit Mode',
					default: 'IOSLAVE_UI_EDIT_MODE_ON',
					choices: inputEditModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Available Options: IOSLAVE_UI_EDIT_MODE_ON, IOSLAVE_UI_EDIT_MODE_OFF.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/input_edit_mode`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		extRefOut: {
			name: 'External Reference Out',
			description: `Set or Get the external reference card output`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'EXT_REF_OUT_LOOPTHROUGH',
					choices: extRefOutChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options are EXT_REF_OUT_LOOPTHROUGH, EXT_REF_OUT_TERMINATE, and EXT_REF_OUT_PPS. EXT_REF_OUT_PPS is only supported for version 1 external reference boards',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/ext_ref_out`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		ipFastSwitchEnable: {
			name: 'IP Fast Switch',
			description: `Configuration setting for enabling rapid switching of synchronous sources`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IP_FAST_SWITCH_ENABLE_ON',
					choices: ipFastSwitchEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: IP_FAST_SWITCH_ENABLE_ON, IP_FAST_SWITCH_ENABLE_OFF.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/ip_fast_switch_enable`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		ignoreRtpSequenceError: {
			name: 'Ignore RTP Sequence Error',
			description: `Report/ignore RTP sequence error`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IP_IGNORE_RTP_SEQUENCE_ERROR_OFF',
					choices: ignoreRtpSequenceErrorChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: To report: IP_IGNORE_RTP_SEQUENCE_ERROR_OFF, To ignore: IP_IGNORE_RTP_SEQUENCE_ERROR_ON',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/ignore_rtp_sequence_error`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		jitterMeterEnable: {
			name: 'Jitter Meter Enable',
			description: `Enable jitter meter display`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 1,
					choices: jitterMeterEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for jitter display off, 1 for jitter display on',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				if (isNaN(mode) || mode < 0 || mode > 1) {
					self.log('warn', `Jitter Meter Mode passed out of range value: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/jitter_meter_enable`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		jitterSweep: {
			name: 'Jitter Meter Sweep Rate',
			description: `Sweep rate for jitter waveform display`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Sweep Rate',
					default: 0,
					choices: jitterSweepChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for 1 line, 1 for 2 line, 2 for 1 field, 3 for 2 field',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Tile Scope: tile1 to tile8',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Jitter Sweep Rate passed out of range value: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/jitter_sweep/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lightningVerticalGain: {
			name: 'Lightning Vertical Gain - Fixed',
			description: `Lightning vertical fixed gain`,
			options: [
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 1,
					min: 1,
					max: 10,
					range: true,
					step: 1,
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Tile Scope: tile1 to tile8',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(options.gain)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/lightning_vertical_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lightningVerticalVarEnable: {
			name: 'Lightning Vertical Gain - Variable Enable',
			description: `Enable/disable lightning vertical variable gain.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Enable',
					default: 'LIGHTNING_V_VAR_ENABLE_ON',
					choices: lightningVerticalVarEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options are LIGHTNING_V_VAR_ENABLE_ON or LIGHTNING_V_VAR_ENABLE_OFF',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Tile Scope: tile1 to tile8',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Jitter Sweep Rate passed out of range value: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/lightning_vertical_var_enable/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lightningHorizontalGain: {
			name: 'Lightning Horizontal Gain - Fixed',
			description: `Lightning Horizontal fixed gain`,
			options: [
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 1,
					min: 1,
					max: 10,
					range: true,
					step: 1,
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Tile Scope: tile1 to tile8',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(options.gain)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/lightning_horizontal_gain/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lightningHorizontalVarEnable: {
			name: 'Lightning Horizontal Gain - Variable Enable',
			description: `Enable/disable lightning horizontal variable gain.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Enable',
					default: 'LIGHTNING_H_VAR_ENABLE_ON',
					choices: lightningHorizontalVarEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options are LIGHTNING_H_VAR_ENABLE_ON or LIGHTNING_H_VAR_ENABLE_OFF',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Tile Scope: tile1 to tile8',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let scope = await self.parseVariablesInString(options.scope)
				if (isNaN(mode) || mode < 0 || mode > 3) {
					self.log('warn', `Jitter Sweep Rate passed out of range value: ${mode}`)
					return undefined
				}
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/lightning_horizontal_var_enable/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lightningLut: {
			name: 'Lightning Lut',
			description: `Lightning - Conversion to Rec.709(LUT)`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'LIGHTNING_LUT_OFF ',
					choices: lightningLutChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: LIGHTNING_LUT_OFF to Disable, LIGHTNING_LUT_ON to Enable',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/lightning_lut/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		measureAssign: {
			name: 'Measure Assign',
			description: `Select measurement display within a tile`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Application',
					default: 'MEASURE_ASSIGN_WAVEFORM',
					choices: measureAssignChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: MEASURE_ASSIGN_WAVEFORM, MEASURE_ASSIGN_VECTOR, MEASURE_ASSIGN_LIGHTNING, MEASURE_ASSIGN_PICTURE, MEASURE_ASSIGN_DIAMOND, MEASURE_ASSIGN_AUDIO, MEASURE_ASSIGN_ERROR_STATUS, MEASURE_ASSIGN_AUDIO, MEASURE_ASSIGN_DATALIST, MEASURE_ASSIGN_EYE, MEASURE_ASSIGN_JITTER, MEASURE_ASSIGN_DOLBY_STATUS, MEASURE_ASSIGN_ANC_DATA, MEASURE_ASSIGN_GEN_STATUS, MEASURE_ASSIGN_IP_STATUS, MEASURE_ASSIGN_IP_SESSION, MEASURE_ASSIGN_VIDEO_SESSION, MEASURE_ASSIGN_IP_GRAPHS, MEASURE_ASSIGN_IP_PIT, MEASURE_ASSIGN_TIMING_DISPLAY, MEASURE_ASSIGN_STREAM_TIMING, MEASURE_ASSIGN_PTP_GRAPHS, MEASURE_ASSIGN_FSTOP, MEASURE_ASSIGN_IP_GEN_STATUS, MEASURE_ASSIGN_SYNC_DISPLAY, MEASURE_ASSIGN_CIE, MEASURE_ASSIGN_CHANNEL_STATUS, MEASURE_ASSIGN_AV_DELAY, MEASURE_ASSIGN_CAMAPP, MEASURE_ASSIGN_EXTREF',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/measure_assign/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		lineSelectEnable: {
			name: 'Line Select Enable',
			description: `Enable line select for a tile. Line select is available for the following apps: picture, waveform, vector, diamond, lightning, CIE, and stop display. Line select can only be enabled for waveform and stop if the sweep selection is "1 line". For 3G(Level B), 4K and 8K signals and for CIE Display, enabling/disabling line select applies to all tiles.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'MEASURE_LINE_SELECT_ENABLE_OFF',
					choices: lineSelectEnableChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: MEASURE_LINE_SELECT_ENABLE_OFF, MEASURE_LINE_SELECT_ENABLE_ON',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/line_select_enable/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		measureBarTarget: {
			name: 'Measure Bar Targets',
			description: `Bar Targets selection between 75% and 100%`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'MEASURE_BAR_TARGET_100',
					choices: measureBarTargetChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: MEASURE_BAR_TARGET_75, MEASURE_BAR_TARGET_100. Default: MEASURE_BAR_TARGET_100',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/measure_bar_target/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		measureTileMode: {
			name: 'Measure Tile Mode',
			description: `Select extended tile mode with in a tile. Tile_select API should be used to select a tile to expand to full screen or to know whether a tile is displayed in full screen.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'MEASURE_TILE_MODE_QUARTER_TILE',
					choices: measureTileModeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: MEASURE_TILE_MODE_QUARTER_TILE, MEASURE_TILE_MODE_TWO_TILE_VERTICAL. Default: MEASURE_TILE_MODE_QUARTER_TILE',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/measure_tile_mode/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		nmosDiscovery: {
			name: 'NMOS Discovery',
			description: `Enables/disables NMOS IS-04 Discovery. If enabled, an NMOS node and device are advertised for NMOS registration or Peer-to-Peer operation. NMOS Discovery must be enabled to perform IS-05 receiver connections. Enabling IS-05 is done via the input settings.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'NMOS',
					default: 'NMOS_MANAGER_ENABLE_ENABLED',
					choices: nmosDiscoveryChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: NMOS_MANAGER_ENABLE_ENABLED, NMOS_MANAGER_ENABLE_DISABLED',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/nmos_discovery`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		nmosDnsType: {
			name: 'NMOS DNS Type',
			description: `Selection of DNS Type for NMOS.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'DNS',
					default: 'NMOS_DNS_TYPE_UNICAST',
					choices: nmosDnsTypeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: NMOS_DNS_TYPE_UNICAST, NMOS_DNS_TYPE_MULTICAST, NMOS_DNS_TYPE_AUTO',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/nmos_dns_type`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		nmosApiVersion: {
			name: 'NMOS API Version',
			description: `Selection of NMOS API Version`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'API',
					default: 'NMOS_API_VERSION_1P3',
					choices: nmosApiVersion,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: NMOS_API_VERSION_1P2, NMOS_API_VERSION_1P3',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/nmos_api_version`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		nmosPersistentReceivers: {
			name: 'NMOS Persistent Recievers',
			description: `Enables/disables persistent NMOS receiver mode. In this mode, all receivers will remain active, regardless of if the current input is enabled for NMOS. In this mode, any activations will configure the specified target input (see nmos_target_input).`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'NMOS_MANAGER_PERSISTENT_RECEIVERS_ENABLED',
					choices: nmosPersistentReceiversChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: NMOS_MANAGER_PERSISTENT_RECEIVERS_ENABLED, NMOS_MANAGER_PERSISTENT_RECEIVERS_DISABLED',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/nmos_persistent_receivers`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		nmos_target_input: {
			name: 'NMOS Target Input',
			description: `Sets the target input for NMOS activations in persistent NMOS receiver mode (see nmos_persistent_receivers). In this mode, any NMOS receiver activations will configure the specified input. This will also convert the target input to an NMOS-enabled 2110 input. A receiver activation WILL NOT set the target input to be the active input.`,
			options: [
				{
					id: 'mode',
					type: 'number',
					label: 'Input',
					default: 1,
					min: 1,
					max: 6,
					range: true,
					step: 1,
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(options.mode)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/nmos_persistent_receivers`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		jitterHpf: {
			name: 'Jitter HPF',
			description: `High-pass filter selection for jitter measurements`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 0,
					choices: jitterHpfChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: 0 for timing, 1 for align, 2 for 10Hz, 3 for 100Hz, 4 for 1kHz, 5 for 10kHz, 6 for 100kHz',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(await self.parseVariablesInString(options.mode))
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/jitter_hpf`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		closedCaptionsDisplay: {
			name: 'Closed Captions Display',
			description: `The format of captions/subtitles displayed for the picture. The first value in the list is the requested value, the second is the effective value.`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'PICTURE_CC_DISPLAY_OFF',
					choices: closedCaptionsDisplayChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_CC_DISPLAY_OFF, PICTURE_CC_DISPLAY_CEA608, PICTURE_CC_DISPLAY_CEA708 PICTURE_CC_DISPLAY_WST, PICTURE_CC_DISPLAY_ARIB',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/closed_captions_display/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureSafeAction1: {
			name: 'Picture Safe Action 1',
			description: `Set the picture safe action 1 graticule type`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Graticle',
					default: 'PICTURE_SAFE_GRAT_OFF',
					choices: pictureSafeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_safe_action_1/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureSafeAction2: {
			name: 'Picture Safe Action 2',
			description: `Set the picture safe action 2 graticule type`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Graticle',
					default: 'PICTURE_SAFE_GRAT_OFF',
					choices: pictureSafeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_safe_action_2/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureSafeTitle1: {
			name: 'Picture Safe Title 1',
			description: `Set the picture safe title 1 graticule type`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Graticle',
					default: 'PICTURE_SAFE_GRAT_OFF',
					choices: pictureSafeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_safe_title_1/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureSafeTitle2: {
			name: 'Picture Safe Title 2',
			description: `Set the picture safe title 2 graticule type`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Graticle',
					default: 'PICTURE_SAFE_GRAT_OFF',
					choices: pictureSafeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_SAFE_GRAT_OFF, PICTURE_SAFE_GRAT_AUTO, PICTURE_SAFE_GRAT_4X3, PICTURE_SAFE_GRAT_14X9, PICTURE_SAFE_GRAT_16X9, PICTURE_SAFE_GRAT_CUSTOM_1, PICTURE_SAFE_GRAT_CUSTOM_2',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_safe_title_2/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureCenterGrat: {
			name: 'Picture Centre Graticule',
			description: `Set the picture center graticule`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Graticle',
					default: 'PICTURE_GRAT_CENTER_OFF',
					choices: pictureCenterGratChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: PICTURE_GRAT_CENTER_OFF, PICTURE_GRAT_CENTER_ON',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_center_grat/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		closedCaptions608Channel: {
			name: 'Closed Captions 608 Channel',
			description: `The requested 608 channel to decode Closed Captions on`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: '608 Channel',
					default: 'PICTURE_CC_SERVICE_608_CC1',
					choices: closedCaptions608ChannelChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_CC_SERVICE_608_CC1, PICTURE_CC_SERVICE_608_CC2, PICTURE_CC_SERVICE_608_CC3, PICTURE_CC_SERVICE_608_CC4',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/closed_captions_608_channel/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		closedCaptions708Service: {
			name: 'Closed Captions 708 Service',
			description: `The requested 708 service to decode Closed Captions on`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: '708 Service',
					default: 'PICTURE_CC_SERVICE_708_SVC1',
					choices: closedCaptions708ServiceChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip:
						'Options: PICTURE_CC_SERVICE_708_SVC1, PICTURE_CC_SERVICE_708_SVC2, PICTURE_CC_SERVICE_708_SVC3, PICTURE_CC_SERVICE_708_SVC4, PICTURE_CC_SERVICE_708_SVC5, PICTURE_CC_SERVICE_708_SVC6',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/closed_captions_708_service/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		closedCaptionsWstPage: {
			name: 'Closed Captions WST PAge',
			description: `The requested Teletext page to decode Subtitles on`,
			options: [
				{
					id: 'mode',
					type: 'number',
					label: 'Page',
					default: 100,
					min: 100,
					max: 899,
					range: true,
					step: 1,
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = parseInt(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/closed_captions_wst_page/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		closedCaptionsAribType: {
			name: 'Closed Captions ARIB Type',
			description: `The requested ARIB type to decode Closed Captions on`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'ARIB Type',
					default: 'PICTURE_CC_ARIB_B37_TYPE_HD',
					choices: closedCaptionsAribTypeChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: PICTURE_CC_ARIB_B37_TYPE_HD, PICTURE_CC_ARIB_B37_TYPE_SD, PICTURE_CC_ARIB_B37_TYPE_MOBILE',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/closed_captions_arib_type/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureAfdGrat: {
			name: 'Picture AFD Graticule',
			description: `Enable/disable AFD Graticule for a picture display`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'PICTURE_AFD_GRAT_ON',
					choices: pictureAfdGratChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: PICTURE_AFD_GRAT_ON, PICTURE_AFD_GRAT_OFF',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_afd_grat/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		pictureAfdGratOverlay: {
			name: 'Picture AFD Graticule Overlay',
			description: `Enable/disable AFD Graticule overlay on a picture display`,
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'PICTURE_AFD_GRAT_OVERLAY_ON',
					choices: pictureAfdGratOverlayChoices,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Options: PICTURE_AFD_GRAT_OVERLAY_ON, PICTURE_AFD_GRAT_OVERLAY_OFF',
				},
				{
					id: 'scope',
					type: 'dropdown',
					label: 'Scope',
					default: 'tile1',
					choices: tiles,
					useVariables: true,
					allowCustom: true,
					regex: Regex.SOMETHING,
					tooltip: 'Requires Tile Scope of tile1 through tile8.',
				},
			],
			callback: async ({ options }) => {
				let mode = await self.parseVariablesInString(options.mode)
				let scope = await self.parseVariablesInString(options.scope)
				let msg = JSON.stringify({ ints: [mode] })
				try {
					const response = await self.axios.post(`/picture_afd_grat_overlay/${scope}`, msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(error)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
	})
}

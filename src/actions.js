const { InstanceStatus, Regex } = require("@companion-module/base")

module.exports = function (self) {
	self.setActionDefinitions({
		changeInput: {
			name: 'Select Video Input',
			description:
				`Change the unit's active input`,
			options: [
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'set',
					choices: [
						{ id: 'set', label: 'Set'},
						{ id: 'get', label: 'Get'},
						{ id: 'inc', label: 'Increment'},
						{ id: 'dec', label: 'Decrement'},
					]
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
						prismInput = options.useVar ? parseInt( await self.parseVariablesInString(options.inputVar)) : parseInt(options.input)
						break
					case 'inc':
						prismInput = self.prism.input >= 5 ? 0 : self.prism.input + 1
						break
					case 'dec':
						prismInput = self.prism.input <=  0 ? 5 : self.prism.input - 1
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
			description:
				`Get list of presets`,
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
			description:
				`Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]". Or recall Factory Preset by sending "factory".`,
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
					tooltip: 'Load preset specified by: "/local/[GroupLetter]_[OptionalGroupName]/[PresetNumber]:[OptionalPresetName]"',
				},
			],
			callback: async ({ options }) => {
				try {
					let preset = JSON.stringify({ string: await self.parseVariablesInString(options.preset) } )
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
			description:
				`Reset anc session.`,
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
			description:
				`Stop, Run or Reset the audio session.`,
			options: [				
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'AUDIO_SESSION_CONTROL_STOP',
					choices: [
						{ id: 'AUDIO_SESSION_CONTROL_STOP', label: 'Stop'},
						{ id: 'AUDIO_SESSION_CONTROL_RUN', label: 'Run'},
						{ id: 'AUDIO_SESSION_CONTROL_RESET', label: 'Reset'},
					]
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
			description:
				`Stop, Run or Reset the loudness session.`,
			options: [				
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'LOUDNESS_SESSION_CONTROL_STOP',
					choices: [
						{ id: 'LOUDNESS_SESSION_CONTROL_STOP', label: 'Stop'},
						{ id: 'LOUDNESS_SESSION_CONTROL_RUN', label: 'Run'},
						{ id: 'LOUDNESS_SESSION_CONTROL_RESET', label: 'Reset'},
					]
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
			description:
				`Stop, Run or Reset the video session.`,
			options: [				
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'IOSLAVE_SESSION_CONTROL_STOP',
					choices: [
						{ id: 'IOSLAVE_SESSION_CONTROL_STOP', label: 'Stop'},
						{ id: 'IOSLAVE_SESSION_CONTROL_RUN', label: 'Run'},
						{ id: 'IOSLAVE_SESSION_CONTROL_RESET', label: 'Reset'},
					]
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
			description:
				`Stop, Run or Reset the IP session.`,
			options: [				
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					default: 'IOSLAVE_SESSION_CONTROL_STOP',
					choices: [
						{ id: 'IOSLAVE_SESSION_CONTROL_STOP', label: 'Stop'},
						{ id: 'IOSLAVE_SESSION_CONTROL_RUN', label: 'Run'},
						{ id: 'IOSLAVE_SESSION_CONTROL_RESET', label: 'Reset'},
					]
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
			description:
				`Select a tile to expand to full screen.`,
			options: [				
				{
					id: 'tile',
					type: 'dropdown',
					label: 'Tile',
					default: 0,
					choices: [
						{ id: 0, label: 'None'},
						{ id: 1, label: 'Tile 1'},
						{ id: 2, label: 'Tile 2'},
						{ id: 3, label: 'Tile 3'},
						{ id: 4, label: 'Tile 4'},
						{ id: 5, label: 'Tile 5'},
						{ id: 6, label: 'Tile 6'},
						{ id: 7, label: 'Tile 7'},
						{ id: 8, label: 'Tile 8'},
					],
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
	})
}

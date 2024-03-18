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
	})
}

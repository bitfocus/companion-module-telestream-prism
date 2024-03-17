const { InstanceStatus, Regex } = require("@companion-module/base")

module.exports = function (self) {
	self.setActionDefinitions({
		changeInput: {
			name: 'Select Video Input',
			options: [
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
						return options.useVar === false
					},
				},
				{
					id: 'inputVar',
					type: 'textinput',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
					tooltip: 'Varible must return an integer between 0 and 5',
				},
				{
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let prismInput = options.useVar ? parseInt( await self.parseVariablesInString(options.inputVar)) : parseInt(options.input)
				if (isNaN(prismInput) || prismInput < 0 || prismInput > 5) {
					self.log('warn', `input out of range ${prismInput}`)
					return undefined
				}
				let msg = JSON.stringify({ input: prismInput })
				try {
					const response = await self.axios.post('/activeinput', msg)
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(response)
					self.updateStatus(InstanceStatus.Error)
				}

			},
			subscribe: async () => {
				try {
					const response = await self.axios.get('/activeinput')
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					console.log(response)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
		getPresets: {
			name: 'Get Presets',
			options: [],
			callback: async () => {
				try {
					const response = await self.axios.get('/getpresets')
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
					let presets = response.data.string
					presets = presets.split(', ')
					self.prism.presets = [{ id: 'factory', label: 'Factory Preset'}]
					presets.forEach((preset) => {
						self.prism.presets.push({ id: preset, label: preset })
						console.log(preset)
					})
					self.updateActions()
				} catch (error) {
					console.log(response)
					self.updateStatus(InstanceStatus.Error)
				}

			},
		},
		loadPreset: {
			name: 'Load Preset',
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
					console.log(response)
					self.updateStatus(InstanceStatus.Error)
				}

			},
			subscribe: async () => {
				try {
					const response = await self.axios.get('/getpresets')
					console.log(response)
					self.updateStatus(InstanceStatus.Ok)
					let presets = response.data.string
					presets = presets.split(', ')
					self.prism.presets = [{ id: 'factory', label: 'Factory Preset'}]
					presets.forEach((preset) => {
						self.prism.presets.push({ id: preset, label: preset })
						console.log(preset)
					})
					self.updateActions()
				} catch (error) {
					console.log(response)
					self.updateStatus(InstanceStatus.Error)
				}
			},
		},
	})
}

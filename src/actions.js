const { InstanceStatus } = require("@companion-module/base")

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
				},
			],
			callback: async ({ options }) => {
				let input = JSON.stringify({ input: parseInt(options.input) })
				try {
					const response = await self.axios.post('/activeinput', input)
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
		},
	})
}

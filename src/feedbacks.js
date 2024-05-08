const { combineRgb } = require('@companion-module/base')
const { actionOptions } = require('./choices.js')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		activeInput: {
			name: 'Active Input',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					...actionOptions.integerInput,
					id: 'input',
					label: 'Input',
					min: 1,
					max: 6,
					isVisible: true,
				},
			],
			callback: (feedback) => {
				return feedback.options.input - 1 == self.prism.input
			},
		},
		tileInFocus: {
			name: 'Tile In Focus',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					...actionOptions.integerInput,
					id: 'tile',
					label: 'Tile',
					min: 1,
					max: 8,
					isVisible: true,
				},
			],
			callback: (feedback) => {
				return feedback.options.tile == self.prism.tileInFocus
			},
		},
	})
}

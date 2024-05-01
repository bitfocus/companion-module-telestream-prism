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
					max: 5,
					isVisible: true,
				},
			],
			callback: (feedback) => {
				return feedback.options.input == self.prism.input
			},
		},
	})
}

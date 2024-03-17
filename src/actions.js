module.exports = function (self) {
	self.setActionDefinitions({
		changeInput: {
			name: 'Select Video Input',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Input',
					default: 0,
					min: 0,
					max: 5,
					range: true,
					step: 1,
					tooltip: 'Input must be an integer between 0 and 5',
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
	})
}

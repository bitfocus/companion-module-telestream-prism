import { combineRgb } from '@companion-module/base'
import { actionOptions, tileInFocusChoices } from './choices.js'

const colours = {
	black: combineRgb(0, 0, 0),
	green: combineRgb(0, 204, 0),
}
const styles = {
	blackOnGreen: {
		bgcolor: colours.green,
		color: colours.black,
	},
}

/** @typedef {InstanceType<typeof import('./main.js').Telestream_PRISM>} Telestream_PRISM */

/**
 * @param {Telestream_PRISM} self
 */

export default async function (self) {
	self.setFeedbackDefinitions({
		activeInput: {
			name: 'Active Input',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [
				{
					...actionOptions.modeDropdown,
					id: 'input',
					label: 'Input',
					choices: self.prism.input_list,
					default: self.prism.input_list[0].id,
					isVisible: true,
					tooltip: 'Varible must return an integer between 0 and 5',
				},
			],
			callback: async (feedback, context) => {
				return (await context.parseVariablesInString(feedback.options.input)) == self.prism.input
			},
			learn: async (feedback) => {
				const newInput = await self.getInput()
				if (newInput === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					input: newInput,
				}
			},
		},
		tileInFocus: {
			name: 'Tile In Focus',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
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
			callback: async (feedback, context) => {
				return (await context.parseVariablesInString(feedback.options.tile)) == self.prism.tileInFocus
			},
			learn: async (feedback) => {
				const newTile = await self.getTileInFocus()
				if (newTile === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					tile: newTile,
				}
			},
		},
	})
}

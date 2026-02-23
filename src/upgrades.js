function closedCaptionsWstPageLegacyMode(_context, props) {
	const result = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	for (const action of props.actions) {
		switch (action.actionId) {
			case 'closedCaptionsWstPage':
				action.options.legacy ??= true
				action.options.newPage ??= '0x801'
				result.updatedActions.push(action)
				break
		}
	}

	return result
}

function tileSelectUpdate(_context, props) {
	const result = {
		updatedActions: [],
		updatedConfig: null,
		updatedFeedbacks: [],
	}

	for (const action of props.actions) {
		switch (action.actionId) {
			case 'tileSelect':
				action.options.dualDisplay ??= false
				action.options.tile2 ??= 0
				if (action.options.tile > 4) {
					action.options.tile2 = action.options.tile
					action.options.tile = 0
					action.options.dualDisplay = true
				}
				result.updatedActions.push(action)
				break
		}
	}

	return result
}

export default [closedCaptionsWstPageLegacyMode, tileSelectUpdate]

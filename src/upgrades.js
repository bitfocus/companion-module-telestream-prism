
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

export default [closedCaptionsWstPageLegacyMode]

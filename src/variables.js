module.exports = async function (self) {
	let varList = [
		{ variableId: 'activeInputNumber', name: 'Active Input Number' },
		{ variableId: 'activeInputName', name: 'Active Input Name' },
	]
	self.setVariableDefinitions(varList)
}

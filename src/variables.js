module.exports = async function (self) {
	let varList = [
		{ variableId: 'activeInputNumber', name: 'Active Input Number' },
		{ variableId: 'activeInputName', name: 'Active Input Name' },
		{ variableId: 'tileInFocus', name: 'Tile In Focus' },
		{ variableId: 'input1Name', name: 'Input 1 Name' },
		{ variableId: 'input2Name', name: 'Input 2 Name' },
		{ variableId: 'input3Name', name: 'Input 3 Name' },
		{ variableId: 'input4Name', name: 'Input 4 Name' },
		{ variableId: 'input5Name', name: 'Input 5 Name' },
		{ variableId: 'input6Name', name: 'Input 6 Name' },
		{ variableId: 'input1Type', name: 'Input 1 Type' },
		{ variableId: 'input2Type', name: 'Input 2 Type' },
		{ variableId: 'input3Type', name: 'Input 3 Type' },
		{ variableId: 'input4Type', name: 'Input 4 Type' },
		{ variableId: 'input5Type', name: 'Input 5 Type' },
		{ variableId: 'input6Type', name: 'Input 6 Type' },
	]
	self.setVariableDefinitions(varList)
}

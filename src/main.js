const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresetsDefinitions = require('./presets')
const axios = require('axios')

const port = 9000
const apiPath = '/api'
const timeOut = 5000
const contentType = 'application/json'

// const pollInterval_fast = 200
const pollInterval_reg = 2000
const pollInterval_slow = 20000

class Telestream_PRISM extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.pollTimer_fast = {}
		this.pollTimer_reg = {}
		this.pollTimer_slow = {}
	}

	killTimers() {
		if (this.pollTimer_fast) {
			clearTimeout(this.pollTimer_fast)
			delete this.pollTimer_fast
		}
		if (this.pollTimer_reg) {
			clearTimeout(this.pollTimer_reg)
			delete this.pollTimer_reg
		}
		if (this.pollTimer_slow) {
			clearTimeout(this.pollTimer_slow)
			delete this.pollTimer_slow
		}
	}

	startTimers() {
		/* 		this.pollTimer_fast = setTimeout(() => {
			this.pollStatus()
		}, pollInterval_fast) */
		this.pollTimer_reg = setTimeout(() => {
			this.pollStatus_reg()
		}, pollInterval_reg)
		this.pollTimer_slow = setTimeout(() => {
			this.pollStatus_slow()
		}, pollInterval_slow)
	}

	/* 	pollStatus_fast() {
		this.pollTimer_fast = setTimeout(() => {
			this.pollStatus()
		}, pollInterval_fast)
	} */

	pollStatus_reg() {
		this.getInput()
		this.getTileInFocus()
		this.pollTimer_reg = setTimeout(() => {
			this.pollStatus_reg()
		}, pollInterval_reg)
	}

	pollStatus_slow() {
		this.getInputConfig()
		this.pollTimer_slow = setTimeout(() => {
			this.pollStatus_slow()
		}, pollInterval_slow)
	}

	logResponse(response) {
		if (this.config.verbose) {
			console.log(response)
		}
		if (response.data !== undefined) {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', `Data Recieved: ${JSON.stringify(response.data)}`)
		} else {
			this.updateStatus(InstanceStatus.UnknownWarning, 'No Data')
			this.log('warn', `Response contains no data`)
		}
	}

	logError(error) {
		if (this.config.verbose) {
			console.log(error)
		}
		if (error.code !== undefined) {
			this.log('error', `Error: ${JSON.stringify(error.code)}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, JSON.stringify(error.code))
		} else {
			this.log('error', `No error code`)
			this.updateStatus(InstanceStatus.UnknownError)
		}
	}

	async getInputConfig() {
		let varList = []
		for (let i = 0; i <= 5; i++) {
			try {
				const response = await this.axios.get(`/inputConfigure?input=${i}`)
				this.logResponse(response)
				if (response.data === undefined || response.data.name === undefined || response.data.inputType === undefined) {
					this.log('warn', `/inputConfigure?input=${i} response contains no data`)
					break
				}
				varList[`input${i + 1}Name`] = response.data.name
				varList[`input${i + 1}Type`] = response.data.inputType
			} catch (error) {
				this.logError(error)
				return undefined
			}
		}
		this.setVariableValues(varList)
	}

	async getTileInFocus() {
		let varList = []
		try {
			const response = await this.axios.get('/tile_in_focus')
			this.logResponse(response)
			if (response.data === undefined || response.data.ints === undefined || !Array.isArray(response.data.ints)) {
				this.log('warn', 'tile_in_focus response contains no data')
				return undefined
			}
			if (response.data.ints.length == 1 && !isNaN(parseInt(response.data.ints[0]))) {
				this.prism.tileInFocus = parseInt(response.data.ints[0])
				varList['tileInFocus'] = this.prism.tileInFocus
				this.setVariableValues(varList)
				this.checkFeedbacks('tileInFocus')
				return this.prism.input
			} else {
				this.log('warn', 'tile_in_focus returned a NaN or unexpected  length')
				return undefined
			}
		} catch (error) {
			this.logError(error)
			return undefined
		}
	}

	async getInput() {
		let varList = []
		try {
			const response = await this.axios.get('/activeinput')
			this.logResponse(response)
			if (response.data === undefined || response.data.input === undefined || response.data.name === undefined) {
				this.log('warn', 'activeinput response contains no data')
				return undefined
			}
			if (!isNaN(parseInt(response.data.input))) {
				this.prism.input = parseInt(response.data.input)
				varList['activeInputNumber'] = this.prism.input
				varList['activeInputName'] = response.data.name
				this.setVariableValues(varList)
				this.checkFeedbacks('activeInput')
				return this.prism.input
			} else {
				this.log('warn', 'activeinput returned a NaN')
				return undefined
			}
		} catch (error) {
			this.logError(error)
			return undefined
		}
	}

	async getPresets() {
		try {
			const response = await this.axios.get('/getpresets')
			this.logResponse(response)
			if (response.data.string === undefined) {
				this.log('warn', 'getpresets response contains no data')
				return undefined
			}
			let presets = response.data.string
			presets = presets.split(', ')
			this.prism.presets = [{ id: 'factory', label: 'Factory Preset', presetlabel: 'Factory\\nPreset' }]
			presets.forEach((preset) => {
				this.prism.presets.push({
					id: preset,
					label: preset,
					presetlabel: `${preset
						.replace('/local/', '')
						.replace('_/', '')
						.replace('_', ' ')
						.replace('/', ' ')
						.replace('Unnamed ', '')
						.replace(':', ':\\n')}`,
				})
			})
			this.updateActions()
			this.updatePresetsDefinitions()
		} catch (error) {
			this.logError(error)
			return undefined
		}
	}

	async queryPrism() {
		if (this.axios) {
			this.getInput()
			this.getPresets()
			this.getTileInFocus()
			this.getInputConfig()
		}
	}

	initPrism() {
		if (this.prism) {
			delete this.prism
		}
		this.prism = {
			presets: [{ id: 'factory', label: 'Factory Preset' }],
			input: 'unknown',
			tileInFocus: 1,
		}
	}

	setupAxios() {
		if (this.axios) {
			delete this.axios
		}
		if (this.config.host !== undefined) {
			this.axios = axios.create({
				baseURL: `http://${this.config.host}:${port}${apiPath}`,
				timeout: timeOut,
				headers: { 'Content-Type': contentType },
			})
			this.startTimers()
		} else {
			this.log('warn', `Host undefined`)
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.config = config
		this.setupAxios()
		this.initPrism()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.queryPrism()
		this.updatePresetsDefinitions()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.killTimers()
		if (this.axios) {
			delete this.axios
		}
		if (this.prism) {
			delete this.prism
		}
	}

	async configUpdated(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.killTimers()
		this.config = config
		this.setupAxios()
		this.initPrism()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.queryPrism()
		this.updatePresetsDefinitions()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Verbose Logging',
				width: 2,
				default: false,
				tooltip: 'Verbose logs written to the console',
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresetsDefinitions() {
		UpdatePresetsDefinitions(this)
	}
}

runEntrypoint(Telestream_PRISM, UpgradeScripts)

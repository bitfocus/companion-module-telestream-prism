const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const axios = require('axios')

const port = 9000
const apiPath = '/api'
const timeOut = 5000
const contentType = 'application/json'

class Telestream_PRISM extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	logResponse(response) {
		if (this.config.verbose) {
			console.log(response)
		}
		if (response.data !== undefined) {
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', `Data Recieved: ${JSON.stringify(response.data)}`)
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
			this.prism.presets = [{ id: 'factory', label: 'Factory Preset' }]
			presets.forEach((preset) => {
				this.prism.presets.push({ id: preset, label: preset })
			})
			this.updateActions()
		} catch (error) {
			this.logError(error)
		}
	}

	async queryPrism() {
		if (this.axios) {
			this.getInput()
			this.getPresets()
		}
	}

	initPrism() {
		if (this.prism) {
			delete this.prism
		}
		this.prism = {
			presets: [{ id: 'factory', label: 'Factory Preset' }],
			input: 'unknown',
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
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		if (this.axios) {
			delete this.axios
		}
		if (this.prism) {
			delete this.prism
		}
	}

	async configUpdated(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.config = config
		this.setupAxios()
		this.initPrism()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.queryPrism()
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
}

runEntrypoint(Telestream_PRISM, UpgradeScripts)

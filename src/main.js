const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const axios = require('axios')

class Telestream_PRISM extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	logResponse(response) {
		if (this.config.verbose) {
			this.log('debug', JSON.stringify(response))
		} else {
			if (response.data !== undefined) {
				this.log('info', `Data Recieved: ${JSON.stringify(response.data)}`)
			} else {
				this.log('warn', `Response contains no data`)
			}
		}
	}

	async getInput() {
		let varList = []
		try {
			const response = await this.axios.get('/activeinput')
			this.logResponse(response)
			this.updateStatus(InstanceStatus.Ok)
			if (response.data === undefined || response.data.input === undefined || response.data.name === undefined) {
				this.log('warn', 'activeinput response contains no data')
				return undefined
			}
			this.prism.input = parseInt(response.data.input)
			varList['activeInputNumber'] = this.prism.input
			varList['activeInputName'] = response.data.name
			this.setVariableValues(varList)
		} catch (error) {
			console.log(error)
			this.updateStatus(InstanceStatus.Error)
		}
	}

	async getPresets() {
		try {
			const response = await this.axios.get('/getpresets')
			this.logResponse(response)
			this.updateStatus(InstanceStatus.Ok)
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
			console.log(error)
			this.updateStatus(InstanceStatus.Error)
		}
	}

	async queryPrism() {
		if (this.axios) {
			this.getInput()
			this.getPresets()
		}
	}

	setupAxios() {
		if (this.axios) {
			delete this.axios
		}
		if (this.config.host !== undefined) {
			this.axios = axios.create({
				baseURL: `http://${this.config.host}:9000/api`,
				timeout: 1000,
				headers: { 'Content-Type': 'application/json' },
			})
		} else {
			this.log('warn', `Host undefined`)
		}
	}

	async init(config) {
		this.config = config
		this.setupAxios()
		this.prism = {
			presets: [{ id: 'factory', label: 'Factory Preset' }],
			input: 'unknown',
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateStatus(InstanceStatus.Ok)
		this.queryPrism()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		if (this.axios) {
			delete this.axios
		}
	}

	async configUpdated(config) {
		this.config = config
		this.setupAxios()
		this.prism = {
			presets: [{ id: 'factory', label: 'Factory Preset' }],
			input: 'unknown',
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateStatus(InstanceStatus.Ok)
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

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

	setupAxios() {
		if (this.axios) {
			delete this.axios
		}
		this.axios = axios.create({
			baseURL: `http://${this.config.host}:9000/api`,
			timeout: 1000,
			headers: {'Content-Type': 'application/json'}
		});
	}

	async init(config) {
		this.config = config
		this.setupAxios()
		this.prism = {
			presets : [{ id: 'factory', label: 'Factory Preset'}]
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateStatus(InstanceStatus.Ok)
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
			presets : [{ id: 'factory', label: 'Factory Preset'}]
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateStatus(InstanceStatus.Ok)
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

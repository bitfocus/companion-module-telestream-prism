import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import UpdatePresetsDefinitions from './presets.js'
import axios from 'axios'
import PQueue from 'p-queue'

const port = 9000
const apiPath = '/api'
const timeOut = 5000
const contentType = 'application/json'

// const pollInterval_fast = 200
const pollInterval_reg = 2000
const pollInterval_slow = 20000

export class Telestream_PRISM extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.pollTimer_fast = {}
		this.pollTimer_reg = {}
		this.pollTimer_slow = {}
		this.currentStatus = { status: InstanceStatus.Disconnected, message: '' }
		this.queue = new PQueue({ concurrency: 1, interval: 100, intervalCap: 1 })
	}

	checkStatus(status = InstanceStatus.Disconnected, message = '') {
		if (status === this.currentStatus.status && message === this.currentStatus.message) return false
		this.updateStatus(status, message.toString())
		this.currentStatus.status = status
		this.currentStatus.message = message
		return true
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
			this.checkStatus(InstanceStatus.Ok)
			this.log('debug', `Data Recieved: ${JSON.stringify(response.data)}`)
		} else {
			this.checkStatus(InstanceStatus.UnknownWarning, 'No Data')
			this.log('warn', `Response contains no data`)
		}
	}

	logError(error) {
		if (this.config.verbose) {
			console.log(error)
		}
		if (error.code !== undefined) {
			try {
				this.log(
					'error',
					`${error.response.status}: ${JSON.stringify(error.code)}\n${JSON.stringify(error.response.data)}`,
				)
				this.checkStatus(InstanceStatus.ConnectionFailure, `${error.response.status}: ${JSON.stringify(error.code)}`)
			} catch {
				this.log('error', `${JSON.stringify(error.code)}\n${JSON.stringify(error)}`)
				this.checkStatus(InstanceStatus.ConnectionFailure, `${JSON.stringify(error.code)}`)
			}
		} else {
			this.log('error', `No error code\n${JSON.stringify(error)}`)
			this.checkStatus(InstanceStatus.UnknownError)
		}
	}

	async postCommand(path, data) {
		return await this.queue.add(
			async () => {
				if (this.axios === undefined) {
					throw new Error('Client not initalized')
				}
				const response = await this.axios.post(path, JSON.stringify(data))
				this.logResponse(response)
				return response
			},
			{ priority: 1 },
		)
	}

	async getInputConfig() {
		if (this.axios === undefined) {
			return undefined
		}
		const varList = {}
		let input_list_changed = false
		let input_entry = {}
		for (let i = 0; i <= 5; i++) {
			try {
				const response = await this.queue.add(async () => {
					return await this.axios.get(`/inputConfigure?input=${i}`)
				})
				this.logResponse(response)
				if (response.data === undefined || response.data.name === undefined || response.data.inputType === undefined) {
					this.log('warn', `/inputConfigure?input=${i} response contains no data`)
					break
				}
				varList[`input${i + 1}Name`] = response.data.name
				varList[`input${i + 1}Type`] = response.data.inputType
				input_entry = { id: i, label: `${i + 1}: ${response.data.name} (${response.data.inputType})` }
				if (this.prism.input_list[i] != input_entry) {
					this.prism.input_list[i] = input_entry
					input_list_changed = true
				}
			} catch (error) {
				this.logError(error)
				return undefined
			}
		}
		this.setVariableValues(varList)
		if (input_list_changed) {
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
		}
		return this.prism.input_list
	}

	async getTileInFocus() {
		return await this.queue.add(async () => {
			if (this.axios === undefined) {
				return undefined
			}
			const varList = {}
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
					return this.prism.tileInFocus
				} else {
					this.log('warn', 'tile_in_focus returned a NaN or unexpected  length')
					return undefined
				}
			} catch (error) {
				this.logError(error)
				return undefined
			}
		})
	}

	async getInput() {
		return await this.queue.add(async () => {
			if (this.axios === undefined) {
				return undefined
			}
			const varList = {}
			try {
				const response = await this.axios.get('/activeinput')
				this.logResponse(response)
				if (response.data === undefined || response.data.input === undefined || response.data.name === undefined) {
					this.log('warn', 'activeinput response contains no data')
					return undefined
				}
				if (!isNaN(parseInt(response.data.input))) {
					this.prism.input = parseInt(response.data.input)
					varList['activeInputNumber'] = this.prism.input + 1
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
		})
	}

	async getPresets() {
		return await this.queue.add(async () => {
			if (this.axios === undefined) {
				return undefined
			}
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
				return this.prism.presets
			} catch (error) {
				this.logError(error)
				return undefined
			}
		})
	}

	async queryPrism() {
		//if (this.queue.size > 10) return
		if (this.axios) {
			await this.getInput()
			await this.getPresets()
			await this.getTileInFocus()
			await this.getInputConfig()
		}
	}

	initPrism() {
		if (this.prism) {
			delete this.prism
		}
		this.prism = {
			presets: [{ id: 'factory', label: 'Factory Preset' }],
			input: 'unknown',
			input_list: [
				{ id: 0, label: `1: Input 1` },
				{ id: 1, label: `2: Input 2` },
				{ id: 2, label: `3: Input 3` },
				{ id: 3, label: `4: Input 4` },
				{ id: 4, label: `5: Input 5` },
				{ id: 5, label: `6: Input 6` },
			],
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
			this.checkStatus(InstanceStatus.BadConfig)
		}
	}

	async init(config) {
		this.checkStatus(InstanceStatus.Connecting)
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
		this.log('debug', `destroy ${this.id}:${this.label}`)
		this.killTimers()
		this.queue.clear()
		if (this.axios) {
			delete this.axios
		}
		if (this.prism) {
			delete this.prism
		}
	}

	async configUpdated(config) {
		this.checkStatus(InstanceStatus.Connecting)
		this.queue.clear()
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

import { combineRgb } from '@companion-module/base'
import { measureAssignChoices, tiles, tileSelectChoices, measureTileModeChoices } from './choices.js'
import { icons } from './icons.js'

const colors = {
	text: combineRgb(218, 218, 218),
	text_black: combineRgb(0, 0, 0),
	bg: combineRgb(72, 72, 72),
	bg_dark: combineRgb(36, 36, 36),
	bg_green: combineRgb(0, 204, 0),
}

const button_defaults = {
	size: '10',
	alignment: 'center:bottom',
	pngalignment: 'center:center',
	color: colors.text,
	bgcolor: colors.bg_dark,
	show_topbar: false,
}

module.exports = async function (self) {
	let presets = {}
	presets['Header-Input-Active'] = {
		category: 'Input',
		type: 'text',
		name: 'Active Input',
		text: 'Display active input, press to cycle through inputs',
	}
	presets[`get_active_input`] = {
		type: 'button',
		category: 'Input',
		name: `Active Input`,
		style: {
			...button_defaults,
			text: `$(generic-module:activeInputName)\\n`,
			png64: icons.input,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`set_active_dec`] = {
		type: 'button',
		category: 'Input',
		name: `Input Increment`,
		style: {
			...button_defaults,
			text: '',
			png64: icons.decrement,
		},
		steps: [
			{
				down: [
					{
						actionId: 'activeInput',
						options: {
							action: 'dec',
							input: 0,
							inputVar: '',
							useVar: false,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`set_active_inc`] = {
		type: 'button',
		category: 'Input',
		name: `Input Increment`,
		style: {
			...button_defaults,
			text: '',
			png64: icons.increment,
		},
		steps: [
			{
				down: [
					{
						actionId: 'activeInput',
						options: {
							action: 'inc',
							input: 0,
							inputVar: '',
							useVar: false,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-Input-Select'] = {
		category: 'Input',
		type: 'text',
		name: 'Select Input',
		text: 'Select and tally the active input',
	}
	for (let i = 1; i <= 6; i++) {
		presets[`set_active_input_${i}`] = {
			type: 'button',
			category: 'Input',
			name: `Input ${i}`,
			style: {
				...button_defaults,
				text: `$(generic-module:input${i}Name)\\n`,
				png64: icons.input,
			},
			steps: [
				{
					down: [
						{
							actionId: 'activeInput',
							options: {
								action: 'set',
								input: i - 1,
								inputVar: '',
								useVar: false,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'activeInput',
					options: {
						input: i - 1,
					},
					style: {
						color: colors.text_black,
						bgcolor: colors.bg_green,
					},
				},
			],
		}
	}
	presets['Header-MeasurementAppsGreen'] = {
		category: 'Measurement Application',
		type: 'text',
		name: '',
		text: '',
	}
	presets[`application_waveform`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Waveform`,
		style: {
			...button_defaults,
			text: `Waveform\\n`,
			png64: icons.waveform,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[27].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_vector`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Vector`,
		style: {
			...button_defaults,
			text: `Vector\\n`,
			png64: icons.vector,
			pngalignment: 'center:center',
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[25].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_lightning`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Lightning`,
		style: {
			...button_defaults,
			text: `Lightning\\n`,
			png64: icons.lightning,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[17].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_diamond`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Diamond`,
		style: {
			...button_defaults,
			text: `Diamond\\n`,
			png64: icons.diamond,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[7].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_cie`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `CIE`,
		style: {
			...button_defaults,
			text: `CIE\\n`,
			png64: icons.cie,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[5].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_stop`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Stop Display`,
		style: {
			...button_defaults,
			text: `Stop\\nDisplay`,
			png64: icons.stop_display,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[22].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_cam`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Cam App`,
		style: {
			...button_defaults,
			text: `Cam\\n`,
			png64: icons.cam,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[4].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-MeasurementAppsBlue'] = {
		category: 'Measurement Application',
		type: 'text',
		name: '',
		text: '',
	}
	presets[`application_picture`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Picture`,
		style: {
			...button_defaults,
			text: `Picture\\n`,
			png64: icons.picture,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[18].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_video_session`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Video Session`,
		style: {
			...button_defaults,
			text: `Video\\nSession`,
			png64: icons.video_session,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[26].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_audio`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Video Session`,
		style: {
			...button_defaults,
			text: `Audio\\n`,
			png64: icons.audio,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[2].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_dolby_status`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Dolby Status`,
		style: {
			...button_defaults,
			text: `Dolby Status\\n`,
			png64: icons.dolby_status,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[8].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_aes_channel_status`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `AES Channel Status`,
		style: {
			...button_defaults,
			text: `AES Channel\\nStatus`,
			png64: icons.aes_channel_status,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[0].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_event_log`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Event Log`,
		style: {
			...button_defaults,
			text: `Event Log\\n`,
			png64: icons.event_log,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[9].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-MeasurementAppsYellow'] = {
		category: 'Measurement Application',
		type: 'text',
		name: '',
		text: '',
	}
	presets[`application_ip_status`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `IP Status`,
		style: {
			...button_defaults,
			text: `IP Status\\n`,
			png64: icons.ip_status,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[15].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_ip_session`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `IP Session`,
		style: {
			...button_defaults,
			text: `IP Session\\n`,
			png64: icons.ip_session,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[14].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_ip_graphs`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `IP Graphs`,
		style: {
			...button_defaults,
			text: `IP Graphs\\n`,
			png64: icons.ip_graphs,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[13].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_pit_histogram`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `PIT Histogram`,
		style: {
			...button_defaults,
			text: `PIT Histogram\\n`,
			png64: icons.pit_histogram,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[19].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_ptp_graphs`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `PTP Graphs`,
		style: {
			...button_defaults,
			text: `PTP Graphs\\n`,
			png64: icons.ptp_graphs,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[20].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_stream_timing`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Stream Timing`,
		style: {
			...button_defaults,
			text: `Stream\\nTiming`,
			png64: icons.stream_timing,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[23].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-MeasurementOrange'] = {
		category: 'Measurement Application',
		type: 'text',
		name: '',
		text: '',
	}
	presets[`application_anc_session`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `ANC Session`,
		style: {
			...button_defaults,
			text: `ANC Session\\n`,
			png64: icons.anc_session,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[1].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_datalist`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Datalist`,
		style: {
			...button_defaults,
			text: `Datalist\\n`,
			png64: icons.datalist,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[6].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_timing`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Timing`,
		style: {
			...button_defaults,
			text: `Timing\\n`,
			png64: icons.timing,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[24].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_eye`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Eye`,
		style: {
			...button_defaults,
			text: `Eye\\n`,
			png64: icons.eye,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[11].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_jitter`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `Jitter`,
		style: {
			...button_defaults,
			text: `Jitter\\n`,
			png64: icons.jitter,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[16].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_ext_ref`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `External Reference`,
		style: {
			...button_defaults,
			text: `External\\nReference`,
			png64: icons.ext_ref,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[10].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_av_delay`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `AV Delay`,
		style: {
			...button_defaults,
			text: `AV Delay\\n`,
			png64: icons.av_delay,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[3].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-MeasurementPurple'] = {
		category: 'Measurement Application',
		type: 'text',
		name: '',
		text: '',
	}
	presets[`application_ip_generator`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `IP Generator`,
		style: {
			...button_defaults,
			text: `IP\\nGenerator`,
			png64: icons.ip_generator,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[12].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`application_sdi_generator`] = {
		type: 'button',
		category: 'Measurement Application',
		name: `SDI Generator`,
		style: {
			...button_defaults,
			text: `SDI\\nGenerator`,
			png64: icons.sdi_generator,
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureAssign',
						options: {
							mode: measureAssignChoices[21].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-get_presets'] = {
		category: 'Preset',
		type: 'text',
		name: 'Get Presets',
		text: 'Get a list of saved presets and update the load preset action and preset list',
	}
	presets[`get_presets`] = {
		type: 'button',
		category: 'Preset',
		name: `Get Presets`,
		style: {
			...button_defaults,
			text: `Get Presets\\n`,
			png64: icons.preset,
		},
		steps: [
			{
				down: [
					{
						actionId: 'getPresets',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['Header-recall_presets'] = {
		category: 'Preset',
		type: 'text',
		name: 'Load Preset',
		text: 'Recall the selected preset',
	}
	self.prism.presets.forEach((preset) => {
		presets[`recall_preset_${preset.label}`] = {
			type: 'button',
			category: 'Preset',
			name: `${preset.label}`,
			style: {
				...button_defaults,
				text: `${preset.presetlabel}`,
				png64: icons.preset,
			},
			steps: [
				{
					down: [
						{
							actionId: 'loadPreset',
							options: {
								preset: preset.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	})
	presets['Header-Tile_in_Focus'] = {
		category: 'Tile',
		type: 'text',
		name: 'Tile In Focus',
		text: '',
	}
	for (let i = 1; i <= 8; i++) {
		presets[`tile_in_focus_${i}`] = {
			type: 'button',
			category: 'Tile',
			name: `Tile ${i + 1}`,
			style: {
				...button_defaults,
				text: `Tile ${i}\\n`,
				png64: icons[`tile${i}`],
			},
			steps: [
				{
					down: [
						{
							actionId: 'tileInFocus',
							options: {
								tile: i,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'tileInFocus',
					options: {
						tile: i,
					},
					style: {
						color: colors.text_black,
						bgcolor: colors.bg_green,
					},
				},
			],
		}
	}
	presets['Header-Tile_fullscreen'] = {
		category: 'Tile',
		type: 'text',
		name: 'Full Screen',
		text: '',
	}
	presets[`tile_fullscreen_off`] = {
		type: 'button',
		category: 'Tile',
		name: tileSelectChoices[0].label,
		style: {
			...button_defaults,
			text: ``,
			png64: icons.fullscreen_reduce,
			pngalignment: 'center:top',
		},
		steps: [
			{
				down: [
					{
						actionId: 'tileSelect',
						options: {
							tile: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	for (let i = 1; i <= 8; i++) {
		presets[`tile_fullscreen_${i}`] = {
			type: 'button',
			category: 'Tile',
			name: tileSelectChoices[i].label,
			style: {
				...button_defaults,
				text: `${tileSelectChoices[i].label}\\n`,
				png64: icons.fullscreen,
				pngalignment: 'center:top',
			},
			steps: [
				{
					down: [
						{
							actionId: 'tileSelect',
							options: {
								tile: i,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}
	presets['Header-Tile_two_tile_vertical'] = {
		category: 'Tile',
		type: 'text',
		name: 'Two Tile Vertical',
		text: '',
	}
	presets[`tile_two_tile_vertical`] = {
		type: 'button',
		category: 'Tile',
		name: 'Two Tile Vertical',
		style: {
			...button_defaults,
			text: `Tile $(generic-module:tileInFocus)\\n`,
			png64: icons.two_tile_vertical,
			pngalignment: 'center:top',
		},
		steps: [
			{
				down: [
					{
						actionId: 'measureTileMode',
						options: {
							mode: measureTileModeChoices[1].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: 'measureTileMode',
						options: {
							mode: measureTileModeChoices[0].id,
							scope: tiles[8].id,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	self.setPresetDefinitions(presets)
}

'use strict';

/**
 * This document uses JSDoc (http://usejsdoc.org) for documentation.
 */

// Units
var m = 1;
var km = 1e3 * m;
var au = 149597870700 * m;
var ly = 9.4607e15 * m;
var cm = 1e-2 * m;
var um = 1e-6 * m;
var nm = 1e-9 * m;

var kg = 1;
var g = 1e-3 * kg;

var W = 1;
var kW = 1e3 * W;
var MW = 1e6 * W;
var GW = 1e9 * W;

var J = 1;
var tons_TNT = 4.2e9 * J;

var K = 1; // Kelvin

var Pa = 1;
var psi = 1.01325e5 * Pa / 14.7;

var s = 1;
var hr = 3600 * s;
var d = 86400 * s;
var yr = 365 * d;

// Constants
var c_speed_light = 299792458 * m / s;
var g_n = 9.80665 * m / Math.pow(s, 2);
var h_planck = 6.626070040e-34 * J / s;
var sigma_stefan_boltzmann = 5.67036713 * Math.pow(10, -8) * W / (Math.pow(s, 2) * Math.pow(K, 4));

/**
 * Input variables
 *
 * @typedef {Object} Input
 * @property {String} label - User friendly name
 * @property {Number} unit - Display different SI units than those calculated
 * @property {Number} val - Default value initially, but becomes user-entered value
 * @property {Number} min_val - Lowest allowed value in the input
 * @property {Number} max_val - Maximum allowed value in the input
 * @property {Number} step_val - Interval to jump when using arrows on the HTML input
 */
var inputs = {
	m0_payload_mass: {
		label: 'Payload',
		unit: {
			kg: kg,
		},
		type: 'number',
		val: 0.001,
	},
	auto_sail: {
		label: 'Use Optimal Sail',
		type: 'checkbox',
		val: true,
	},
	sail_shape: {
		label: 'Sail Shape',
		type: 'radio',
		val: 'square',
		radios: [{
			label: 'Square',
			val: 'square',
		}, {
			label: 'Circular',
			val: 'circular',
		}, {
			label: 'Spherical',
			val: 'spherical',
		}]
	},
	D_sail_size: {
		label: 'Sail Diameter',
		unit: {
			m: m,
		},
		type: 'number',
		val: 1,
		update: function() {
			var element = document.getElementById('D_sail_size');
			if (element) {
				element.disabled = inputs.auto_sail.val;
			}

			// Automatically compute sail diameter when using auto sail
			if (inputs.auto_sail.val) {
				this.displayVal = inputs.D_sail_size.val = Math.sqrt(inputs.m0_payload_mass.val /
					(hiddens.xi_sail_constant.val * inputs.rho_sail_density.val * inputs.h_sail_thickness.val));

				// May be Infinite for initial page load
				if (!isFinite(this.displayVal)) {
					this.displayVal = this.val = 1;
				}
			}
		}
	},
	h_sail_thickness: {
		label: 'Sail Thickness',
		unit: {
			'&mu;m': um,
		},
		type: 'number',
		val: 1,
	},
	rho_sail_density: {
		label: 'Sail Density',
		unit: {
			'g/cm<sup>3</sup>': (g / Math.pow(cm, 3)), // Grams per centimeter cubed
		},
		type: 'number',
		val: 1,
	},
	epsilon_sub_r_reflection_coef: {
		label: 'Sail Reflection Efficiency (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	alpha_reflector_absorption: {
		label: 'Sail Absorption of Light not Reflected (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	epsilon_emissivity_front: {
		label: 'Sail Front Emissivity (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	epsilon_emissivity_back: {
		label: 'Sail Back Emissivity (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	use_circular_array: {
		label: 'Use Circular Laser Array',
		type: 'checkbox',
		val: true,
		update: function() {
			// We want this to run when this input is changed, so trick the algorithm by
			// making it think this function is dependent upon the input
			var trick = inputs.use_circular_array.val;

			// Enable circular and spherical sail shapes when using circular laser array
			var element = document.getElementById('circular');
			if (element) {
				element.disabled = !this.val;
			}

			element = document.getElementById('spherical');
			if (element) {
				element.disabled = !this.val;
			}

			if (this.val) {
				inputs.d_array_size.label = 'Laser Array Diameter';
			} else {
				inputs.d_array_size.label = 'Laser Array Side Length';
				inputs.sail_shape.val = 'square';
			}
		},
	},
	d_array_size: {
		label: 'Laser Array Side Length',
		type: 'number',
		unit: {
			m: m,
		},
		val: 10000,
	},
	P_optical: {
		label: 'Total Optical Power',
		unit: {
			GW: GW,
		},
		type: 'number',
		val: 100,
	},
	epsilon_sub_beam_beam_eff: {
		label: 'Beam Efficiency (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	lambda_wavelength: {
		label: 'Wavelength',
		unit: {
			nm: nm,
		},
		type: 'number',
		val: 1060,
		min: 1,
	},
	epsilon_sub_elec_photon_to_electrical_eff: {
		label: 'Electrical Efficiency (0 - 1)',
		type: 'number',
		val: 1,
		min: 0,
		max: 1,
	},
	energy_cost: {
		label: 'Electrical Energy Cost',
		unit: {
			'$/kW-hr': (1 / (kW * hr)),
		},
		type: 'number',
		val: 0.1,
	},
	energy_storage_cost: {
		label: 'Energy Storage Cost',
		unit: {
			'$/W-hr': (1 / (W * hr)),
		},
		type: 'number',
		val: 0.1,
	},
	Laser_comm_spacecraft_power_peak: {
		label: 'Peak Laser Comm Power',
		unit: {
			W: W,
		},
		type: 'number',
		val: 1,
	},
	Photons_per_bit_for_communication: {
		label: 'Photons Per Bit for Communication',
		unit: {
			'ph/bit': 1,
		},
		type: 'number',
		val: 1,
	},
	lambda_laser_comm_wavelength: {
		label: 'Laser Comm Wavelength',
		unit: {
			nm: nm,
		},
		type: 'number',
		val: 600,
	},
	Laser_comm_beam_efficiency: {
		label: 'Laser Comm Beam Efficiency (0 - 1)',
		type: 'number',
		val: 1,
	},
	use_circular_laser_comm_optics: {
		label: 'Use Circular Comm Optics',
		type: 'checkbox',
		val: true,
	},
	Laser_comm_spacecraft_optics_size: {
		label: 'Spacecraft Laser Comm Optical Size',
		unit: {
			m: m,
		},
		type: 'number',
		val: 1,
	},
	L_target: {
		label: 'Target Distance',
		unit: {
			ly: ly,
		},
		type: 'number',
		val: 4.37,
	},
};
/**
 * Output variables
 *
 * @typedef {Object} Output
 * @property {String} label - User friendly name
 * @property {Number} unit - Display different SI units than those calculated
 * @property {Number} val - Calculated value
 * @property {Function} update() - Updates val
 */
var outputs = {
	m_sail: {
		label: 'Sail Mass',
		unit: {
			g: g,
		},
		update() {
			this.val = (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2) *
				inputs.h_sail_thickness.val * inputs.rho_sail_density.val);
		},
	},
	m_total_mass: {
		label: 'Total Mass',
		unit: {
			g: g,
		},
		update() {
			this.val = inputs.m0_payload_mass.val + outputs.m_sail.val;
		},
	},
	sail_areal: {
		label: 'Areal Density',
		unit: {
			'g/m<sup>2</sup>': (g / Math.pow(m, 2)),
		},
		update() {
			this.val = inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
		},
	},
	P0_laser_power_in_main_beam: {
		label: 'Laser Power in Main Beam',
		unit: {
			GW: GW,
		},
		update() {
			this.val = inputs.epsilon_sub_beam_beam_eff.val * inputs.P_optical.val;
		},
	},
	flux_on_sail: {
		label: 'Flux on Sail',
		unit: {
			'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
		},
		update() {
			this.val = (outputs.P0_laser_power_in_main_beam.val /
				(hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
		},
	},
	Force_on_Sail: {
		label: 'Total Force on Sail',
		unit: {
			'N': 1,
		},
		update() {
			this.val = hiddens.total_light_efficiency.val *
				outputs.P0_laser_power_in_main_beam.val / (c_speed_light);
		},
	},
	Peak_Sail_Pressure: {
		label: 'Peak Sail Pressure',
		unit: {
			'Pa': 1,
			'psi': psi,
		},
		update() {
			this.val = hiddens.total_light_efficiency.val *
				outputs.flux_on_sail.val / (c_speed_light);
		},
	},
	a_acceleration: {
		label: 'Peak Acceleration',
		unit: {
			'm/s<sup>2</sup>': 1,
			'g<sub>n</sub>': g_n,
		},
		update() {
			this.val = hiddens.total_light_efficiency.val *
				outputs.P0_laser_power_in_main_beam.val / (outputs.m_total_mass.val * c_speed_light);
		},
	},
	L0_distance_to_spot_size_equals_sail_size: {
		label: 'L<sub>0</sub>',
		unit: {
			au: au,
			km: km,
		},
		update() {
			this.val = (inputs.d_array_size.val * inputs.D_sail_size.val /
				(2 * inputs.lambda_wavelength.val * hiddens.alpha_array_constant.val));
		},
	},
	t0_time_to_L0: {
		label: 'Time to L<sub>0</sub>',
		unit: {
			d: d,
			s: s,
		},
		update() {
			this.val = (Math.sqrt(c_speed_light * inputs.d_array_size.val *
				inputs.D_sail_size.val * outputs.m_total_mass.val /
				(hiddens.total_light_efficiency.val *
					outputs.P0_laser_power_in_main_beam.val *
					inputs.lambda_wavelength.val * hiddens.alpha_array_constant.val)));
		},
	},
	v_0_speed_to_L0: {
		label: 'Speed at L<sub>0</sub>',
		unit: {
			'km/s': (km / s),
			'% c': (c_speed_light / 100),
		},
		update() {
			this.val = (Math.sqrt(hiddens.total_light_efficiency.val *
				outputs.P0_laser_power_in_main_beam.val * inputs.d_array_size.val *
				inputs.D_sail_size.val /
				(c_speed_light * inputs.lambda_wavelength.val * hiddens.alpha_array_constant.val *
					outputs.m_total_mass.val)));
		},
	},
	l0_ke: {
		label: 'Kinetic Energy at L<sub>0</sub>',
		unit: {
			'GW*hr': (GW * hr),
			J: J,
		},
		update() {
			this.val = 0.5 * outputs.m_total_mass.val * Math.pow(outputs.v_0_speed_to_L0.val, 2);
		},
	},
	E_gamma_photon_energy_in_main_beam_to_time_t0: {
		label: 'Laser Energy in Main Beam at L<sub>0</sub>',
		unit: {
			'GW*hr': (GW * hr),
			J: J,
		},
		update() {
			this.val = outputs.P0_laser_power_in_main_beam.val * outputs.t0_time_to_L0.val;
		},
	},
	E_elec_total_electrical_energy_used_to_t0: {
		label: 'Electrical Energy at L<sub>0</sub>',
		unit: {
			'GW*hr': (GW * hr),
			J: J,
		},
		update() {
			this.val = (inputs.P_optical.val * outputs.t0_time_to_L0.val /
				inputs.epsilon_sub_elec_photon_to_electrical_eff.val);
		},
	},
	launch_efficiency_at_L0: {
		label: 'Launch Efficiency at L<sub>0</sub> (KE / Electrical Energy)',
		unit: {
			'%': 1 / 100,
		},
		update() {
			this.val = outputs.l0_ke.val / outputs.E_elec_total_electrical_energy_used_to_t0.val;
		},
	},
	energy_cost_per_launch: {
		label: 'Electrical Energy Cost at L<sub>0</sub>',
		unit: {
			'$': 1,
		},
		update() {
			this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
		},
	},
	energy_storage_cost_per_launch: {
		label: 'Energy Storage Cost at L<sub>0</sub>',
		unit: {
			'$': 1,
		},
		update() {
			this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val *
				inputs.energy_storage_cost.val;
		},
	},
	v_infinity_speed_with_continued_illumination: {
		label: 'Limiting Speed',
		unit: {
			'km/s': (km / s),
			'% c': (c_speed_light / 100),
		},
		update() {
			this.val = Math.sqrt(2) * outputs.v_0_speed_to_L0.val;
		},
	},
	time_to_target_at_limiting_speed: {
		label: 'Time to Target at Limiting Speed',
		unit: {
			'yr': yr,
		},
		update() {
			this.val = inputs.L_target.val / outputs.v_infinity_speed_with_continued_illumination.val;
		},
	},
	flux_absorbed_by_sail: {
		label: 'Max Flux Absorbed by Sail',
		unit: {
			'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
		},
		update() {
			this.val = (outputs.flux_on_sail.val *
				(1 - inputs.epsilon_sub_r_reflection_coef.val) * inputs.alpha_reflector_absorption.val
			);
		},
	},
	power_absorbed_by_sail: {
		label: 'Max Power Absorbed by Sail',
		unit: {
			'GW': (GW / Math.pow(m, 2)),
		},
		update() {
			this.val = (outputs.flux_absorbed_by_sail.val *
				(hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
		},
	},
	sail_equilibrium_temperature: {
		label: 'Sail Equilibrium Temperature',
		unit: {
			'K': 1,
		},
		update() {
			this.val = Math.pow((outputs.flux_absorbed_by_sail.val) / (sigma_stefan_boltzmann *
					(inputs.epsilon_emissivity_front.val + inputs.epsilon_emissivity_back.val)), 1 /
				4);
		},
	},
	Laser_comm_flux_at_earth: {
		label: 'Laser Comm Flux at Earth',
		unit: {
			'ph s<sup>-1</sup>m<sup>-2</sup>': (1 / (s * Math.pow(m, 2))),
		},
		update() {
			this.val = (inputs.Laser_comm_beam_efficiency.val *
				inputs.Laser_comm_spacecraft_power_peak.val /
				(h_planck * c_speed_light / (inputs.lambda_laser_comm_wavelength.val)) /
				Math.pow(inputs.L_target.val * 2 * inputs.lambda_laser_comm_wavelength.val /
					(inputs.Laser_comm_spacecraft_optics_size.val /
						hiddens.alpha_laser_comm_optics_constant.val), 2));
		},
	},
	Laser_comm_photometric_magnitude: {
		label: 'Equivalent Photometric Magnitude m<sub>v</sub>',
		unit: {
			'': 1, // Unitless
		},
		update() {
			this.val = -2.5 * Math.log(outputs.Laser_comm_flux_at_earth.val / 3e10) / Math.log(10);
		},
	},
	Laser_comm_rate_at_earth: {
		label: 'Laser Comm Rate Received in Array',
		unit: {
			'ph/s': (1 / s),
		},
		update() {
			this.val = outputs.Laser_comm_flux_at_earth.val * hiddens.xi_sail_constant.val *
				Math.pow(inputs.d_array_size.val, 2);
		},
	},
	Laser_comm_bit_rate_received_in_array: {
		label: 'Laser Comm Bit Rate Received in Array',
		unit: {
			'bits/s': 1,
		},
		update() {
			this.val = outputs.Laser_comm_rate_at_earth.val /
				inputs.Photons_per_bit_for_communication.val;
		},
	},
	Laser_comm_received_wavelength_at_L0: {
		label: 'Laser Comm Wavelength at Speed at L0',
		unit: {
			'nm': nm,
		},
		update() {
			var beta_0 = outputs.v_0_speed_to_L0.val / c_speed_light;

			this.val = inputs.lambda_laser_comm_wavelength.val *
				Math.pow((1 + beta_0) / (1 - beta_0), 1 / 2);
		},
	},
	Laser_comm_received_wavelength_at_limiting_speed: {
		label: 'Laser Comm Wavelength at Limiting Speed',
		unit: {
			'nm': nm,
		},
		update() {
			var beta_infinity = outputs.v_infinity_speed_with_continued_illumination.val /
				c_speed_light;

			this.val = inputs.lambda_laser_comm_wavelength.val *
				Math.pow((1 + beta_infinity) / (1 - beta_infinity), 1 / 2);
		},
	},
	michael: {
		label: "michael",
		unit: {
			'awesomeness': 100
		},
		update() {
			
		}
	}
};

/**
 * Hidden variables
 * @typedef {Object} Hidden
 * @property {Number} val - Calculated value
 * @property {Function} update() - Updates val
 */
var hiddens = {
	xi_sail_constant: {
		update: function() {
			if (inputs.sail_shape.val === 'circular') {
				this.val = Math.PI / 4;
			} else if (inputs.sail_shape.val === 'spherical') {
				this.val = Math.PI;
			} else {
				this.val = 1;
			}
		},
	},
	xi_array_constant: {
		update: function() {
			this.val = inputs.sail_shape.val === 'circular' ? Math.PI / 4 : 1;
		},
	},
	alpha_array_constant: {
		update: function() {
			this.val = inputs.use_circular_array.val ? 1.22 : 1;
		},
	},
	alpha_laser_comm_optics_constant: {
		update: function() {
			this.val = inputs.use_circular_laser_comm_optics.val ? 1.22 : 1;
		},
	},
	total_light_efficiency: {
		update: function() {
			this.val = (2 * inputs.epsilon_sub_r_reflection_coef.val +
				(1 - inputs.epsilon_sub_r_reflection_coef.val) * inputs.alpha_reflector_absorption.val
			);
		},
	},
};

/**
 * Initialize watch functions
 */
function initializeWatch() {
	var watch = {};

	// Create functions for each input which convert the input value to standard units when the input changes
	for (var id in inputs) {
		var input = inputs[id];

		// Create a copy of .val because it will be overwritten later
		input.default = input.val;

		if (input.type !== 'number') {
			continue;
		}

		input.displayVal = input.val;

		var dependency = 'inputs.' + id + '.displayVal';

		// Converts input value to standard unit value
		var updateFunc = (function() {

			// For unitless quantities
			if (typeof this.unit === 'undefined') {
				this.val = this.displayVal;
				return;
			}

			for (var unit in this.unit) {
				this.val = this.displayVal * this.unit[unit];

				// There should only be one unit for inputs!
				return;
			}
		}).bind(input);

		// Update the val immediately
		updateFunc();

		if (dependency in watch) {
			watch[dependency].push(updateFunc);
		} else {
			watch[dependency] = [updateFunc];
		}
	}

	initializeUpdateFunctions(inputs);
	initializeUpdateFunctions(hiddens);
	initializeUpdateFunctions(outputs);

	// When a dependency is triggered, run all of its dependent functions
	for (var id in watch) {
		var func = watch[id];

		watch[id] = (function(funcs) {
			for (var i = 0; i < funcs.length; i++) {
				var func = funcs[i];
				func();
			}
		}).bind(this, func);
	}

	return watch;

	/**
	 * watch object is a dictionary where there's a key for each hidden dependency and
	 * a value containing an array for the update functions relying on those dependencies
	 */
	function initializeUpdateFunctions(dict) {
		for (var id in dict) {
			var obj = dict[id];

			if (!('update' in obj)) {
				continue;
			}

			var updateFunc = obj.update.bind(obj);

			// Compute the initial value of the hidden
			updateFunc();

			// Convert update function to a string
			var updateString = '' + obj.update;

			// Search for references to input, output, or hidden variables
			// e.g. inputs.m0_payload_mass.val
			var regex = /(inputs|outputs|hiddens)\.\w+\.val/g;
			var regexArray = [];
			var results = {};
			while ((regexArray = regex.exec(updateString)) !== null) {
				var dependency = regexArray[0];

				// Run when there's multiple references to a single variable in the function
				if (dependency in results) {
					continue;
				}

				results[dependency] = true;

				if (dependency in watch) {
					watch[dependency].push(updateFunc);
				} else {
					watch[dependency] = [updateFunc];
				}
			}
		}
	}
};

/**
 * Reset inputs to their default values
 */
function reset() {
	var inputsArray = Object.getOwnPropertyNames(inputs);
	for (var i = 0; i < inputsArray.length; i++) {
		var id = inputsArray[i];
		var input = inputs[id];
		var val = input.default;

		if (input.type === 'number') {
			input.displayVal = parseFloat(val);
		} else {
			input.val = val;
		}
	}

	saveLocalStorage();
}

/**
 *
 * CSV Import and Export
 *
 */

/** Finds the number of keys an object posesses to inline checking if an input has only one unit
 * @param {Object} obj - An object to return the number of keys an object posesses.
 * @return {Number} - the number of keys obj has.
 */
function getLength(obj) {
	return Object.keys(obj).length;
}

/** Determine if variable is a number
 *
 * @param {*} n - Variable to check
 * @return {Boolean}
 */
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/** Determine if variable has a value
 *
 * @param {*} v - Variable to check
 * @return {Boolean}
 */
function isDefined(v) {

	return typeof v !== 'undefined';
}

/**
 * Download a CSV file 
 */
function saveCSV() {
	var filename = prompt(
		'Saving does not work in all web browsers - Firefox is recommended. \n\nEnter filename for CSV:',
		'laser_propulsion_calculations.csv');
	exportToCSV(filename);
}

/**
 * Download a CSV file to the user with the contents of the calculator
 *
 * @param {String} filename - Name of the file being downloaded
 */
function exportToCSV(filename) {

	// Creates a row in the CSV string
	var processRow = function(row) {
		var finalVal = '';
		for (var j = 0; j < row.length; j++) {
			var innerValue = typeof row[j] === 'undefined' ? '' : row[j].toString();

			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			};

			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > 0)
				finalVal += ',';
			finalVal += result;
		}

		return finalVal + '\n';
	};

	// Create JSON object containing calculator table
	var rows = createCSV();

	// Convert JSON object to string
	var csvFile = '';
	for (var i = 0; i < rows.length; i++) {
		csvFile += processRow(rows[i]);
	}

	// Download the file to the user's computer
	var blob = new Blob([csvFile], {
		type: 'text/csv;charset=utf-8;',
	});
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement('a');
		if (typeof link.download === 'undefined') {
			alert('Save as CSV failed. Try using Firefox.');
			return;
		}

		// Browsers that support HTML5 download attribute
		var url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		document.body.removeChild(link);
	}
}

/**
 * Generate a JSON object, which can easily be converted to a CSV file
 *
 * @return {Array} - JSON object containing calculator input and output values
 */
function createCSV() {
	var lineArray = [
		['Inputs', 'Value', 'Unit', 'Outputs', 'Value', 'Unit'],
	];

	var inputsArray = Object.getOwnPropertyNames(inputs);
	var outputsArray = Object.getOwnPropertyNames(outputs);

	for (var i = 0; i < Math.max(inputsArray.length, outputsArray.length); i++) {
		var input = inputs[inputsArray[i]];
		var output = outputs[outputsArray[i]];

		var line = [];

		if (isDefined(input)) {
			line.push(htmlToText(input.label));

			var j = 0;
			for (var unit in input.unit) {
				// Convert standard unit values
				line.push(input.val / input.unit[unit]);
				line.push(htmlToText(unit));

				j++;
			}

			// For unitless inputs
			if (j != 1) {
				if (isDefined(input.checked)) {
					//Is a checkbox
					line.push(input.checked);
					line.push('checkbox');
				} else {
					//is a unitless number.
					line.push(input.val);
					line.push('');
				}
			}
		} else {
			// More outputs than inputs so add empty input line
			line = line.concat(['', '', '']);
		}

		if (isDefined(output)) {
			line.push(htmlToText(output.label));

			for (var unit in output.unit) {
				var convertedVal = output.val / output.unit[unit];

				line.push(convertedVal);
				line.push(htmlToText(unit));
			}

			lineArray.push(line);
		}
	}

	return lineArray;
}

/**
 * Convert a unit in HTML format to text
 *
 * @param {String} unitHTML - Contains HTML markup
 * @return {String} - Contains the ASCII equivalent of HTML markup elements
 */
function htmlToText(htmlString) {
	if (!isDefined(htmlString)) {
		return htmlString;
	}

	htmlString = String(htmlString).replace(/&mu;/g, 'u');
	htmlString = String(htmlString).replace(/<sup>/g, '^');
	htmlString = String(htmlString).replace(/<sub>/g, '_');

	htmlString = String(htmlString).replace(/<\/sup>/g, '');
	htmlString = String(htmlString).replace(/<\/sub>/g, '');

	return htmlString;
}

/**
 * Import a CSV into the calculator
 *
 * @param {Event} e - Event from a file upload button
 */
function importCSV(e) {
	var files = e.target.files;
	if (files.length !== 1) {
		alert('Select only one CSV file.')
		return;
	}

	var file = files[0];
	if (file.type !== 'text/csv') {
		alert('The file type was not CSV.')
		return;
	}

	var reader = new FileReader();

	// Wait for reader to load data
	reader.onload = function() {
		var rows = reader.result.split('\n');
		var inputsArray = Object.getOwnPropertyNames(inputs);

		// Iterate through each input
		for (var i = 1; i < inputsArray.length; i++) {
			var input = inputs[inputsArray[i]];
			var cells = rows[i].split(',');

			var label = cells[0];
			if (input.label !== label) {
				alert("Failed to import CSV. Check to make sure all input labels match the calculator's.");
				return;
			}

			var val = cells[1];
			var type = input.type;
			if (type === 'number') {
				input.displayVal = parseFloat(val);
			} else {
				input.displayVal = val;
			}
		}
	};

	// Read body text of file
	reader.readAsText(file);
}

/**
 *
 * Local Storage
 *
 */

/**
 * Check if the web browser supports local storage
 *
 * @return {Boolean} - Indicates whether local storage is enabled or not
 */
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. 
 *
 * @param {Function} func - Function to be called
 * @param {Number} wait - Time to wait before calling func
 * @param {Boolean} immediate - If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
function debounce(func, wait, immediate) {

	// This shouldn't be in saveLocalStorageCore, but this is more efficient
	if (!supports_html5_storage()) {
		return;
	}

	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Saves inputs to local storage after waiting some time (known as debouncing)
 */
var saveLocalStorage = debounce(saveLocalStorageCore, 2000);

/**
 * Save the inputs to local storage to persist them across user sessions
 */
function saveLocalStorageCore() {
	var inputsArray = Object.getOwnPropertyNames(inputs);

	for (var i = 0; i < inputsArray.length; i++) {
		var id = inputsArray[i];
		var input = inputs[id];
		var val = input.type === 'number' ? input.displayVal : input.val;

		localStorage.setItem(id, val);
	}
}

/**
 * Import the inputs from local storage to resume a calculation
 */
function importLocalStorage() {
	if (!supports_html5_storage()) {
		return;
	}

	var inputsArray = Object.getOwnPropertyNames(inputs);
	for (var i = 0; i < inputsArray.length; i++) {
		var id = inputsArray[i];
		var input = inputs[id];
		var val = localStorage.getItem(id);

		if (val === null) {
			continue;
		}

		if (input.type === 'number') {
			input.displayVal = parseFloat(val);
		} else {
			input.val = val;
		}
	}
}

/**
 *
 *
 * VueJS Main Application
 *
 */

var app = new Vue({
	el: '#app',
	data: {
		debug_mode: false,
		inputs: inputs,
		outputs: outputs,
		hiddens: hiddens,
	},
	watch: initializeWatch(),
	filters: {
		formatFloat: function(value) {
			return value.toPrecision(3);
		},
	},
	methods: {
		saveCSV: saveCSV,
		importCSV: importCSV,
		saveLocalStorage: saveLocalStorage,
		reset: reset,
	},
});

// Restore inputs from previous session (if any)
importLocalStorage();

// Manually update to disable D_sail_size input
inputs.D_sail_size.update();

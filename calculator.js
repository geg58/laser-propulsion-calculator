/**
 * This document uses JSDoc (http://usejsdoc.org) for documentation.
 */

// Units
var m = 1;
var km = 1e3 * m;
var au = 149597870700 * m;
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

var s = 1;
var hr = 3600 * s;
var d = 86400 * s;

// Constants
var c_speed_light = 299792458 * m / s;
var g_n = 9.80665 * m / Math.pow( s, 2 );

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
	m0_payload_mass:
	{
		label: 'Payload (kg)',
		unit: kg,
		val: 0.1
	},
	auto_sail:
	{
		label: 'Use Optimal Sail Size',
		checked: true
	},
	D_sail_size:
	{
		label: 'Sail Size (m/cm<sup>2</sup>)',
		unit: m
	},
	h_sail_thickness:
	{
		label: 'Sail Thickness (&mu;m)',
		unit: um,
		val: 10
	},
	rho_sail_density:
	{
		label: 'Sail Density (g/cm<sup>3</sup>)',
		unit: ( g / Math.pow( cm, 3 ) ), // Grams per centimeter cubed
		val: 1
	},
	d_array_size:
	{
		label: 'Laser Size (m)',
		unit: m,
		val: 100
	},
	P0_laser_power_in_main_beam:
	{
		label: 'Laser Power (GW)',
		unit: GW,
		val: 10
	},
	epsilon_sub_beam_beam_eff:
	{
		label: 'Beam Efficiency',
		val: 1,
		max_val: 1
	},
	lambda_wavelength:
	{
		label: 'Wavelength (nm)',
		unit: nm,
		val: 1060,
		min_val: 1
	},
	epsilon_sub_elec_photon_to_electrical_eff:
	{
		label: 'Electrical Efficiency',
		val: 1,
		max_val: 1
	},
	energy_cost:
	{
		label: 'Electrical Energy Cost ($/KW-h)',
		unit: ( 1 / ( kW * hr ) ),
		val: 0.1
	}
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
	m_sail:
	{
		label: 'Sail Mass',
		unit:
		{
			g: g
		},
		update()
		{
			this.val = Math.pow( inputs.D_sail_size.val, 2 ) * inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
		}
	},
	m_total_mass:
	{
		label: 'Total Mass',
		unit:
		{
			g: g
		},
		update()
		{
			this.val = inputs.m0_payload_mass.val + outputs.m_sail.val;
		}
	},
	sail_areal:
	{
		label: 'Areal Density',
		unit:
		{
			'g/m<sup>2</sup>': ( g / Math.pow( m, 2 ) )
		},
		update()
		{
			this.val = inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
		}
	},
	a_acceleration:
	{
		label: 'Peak Acceleration',
		unit:
		{
			'm/s<sup>2</sup>': 1,
			'g<sub>n</sub>': g_n
		},
		update()
		{
			this.val = 2 * inputs.P0_laser_power_in_main_beam.val / ( outputs.m_total_mass.val * c_speed_light );
		}
	},
	l0_dist:
	{
		label: 'Accel Dist &equiv; L<sub>0</sub>',
		unit:
		{
			au: au,
			km: km
		},
		update()
		{
			this.val = inputs.d_array_size.val * inputs.D_sail_size.val / ( 2 * inputs.lambda_wavelength.val );
		}
	},
	t0_time_to_L0:
	{
		label: 'Time to &equiv; L<sub>0</sub>',
		unit:
		{
			d: d,
			s: s
		},
		update()
		{
			this.val = Math.sqrt( c_speed_light * inputs.d_array_size.val * inputs.D_sail_size.val * outputs.m_total_mass.val /
				( 2 * inputs.P0_laser_power_in_main_beam.val * inputs.lambda_wavelength.val ) );
		}
	},
	v_0_speed_to_L0:
	{
		label: 'Speed at &equiv; L<sub>0</sub>',
		unit:
		{
			'km/s': ( km / s ),
			'% c': ( c_speed_light / 100 )
		},
		update()
		{
			this.val = Math.sqrt( 2 * inputs.P0_laser_power_in_main_beam.val * inputs.d_array_size.val * inputs.D_sail_size.val /
				( c_speed_light * inputs.lambda_wavelength.val * outputs.m_total_mass.val ) );
		}
	},
	l0_ke:
	{
		label: 'Kinetic Energy at &equiv; L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = 0.5 * outputs.m_total_mass.val * Math.pow( outputs.v_0_speed_to_L0.val, 2 );
		}
	},
	E_gamma_photon_energy_in_main_beam_to_time_t0:
	{
		label: 'Laser Energy at &equiv; L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = inputs.P0_laser_power_in_main_beam.val * outputs.t0_time_to_L0.val;
		}
	},
	E_elec_total_electrical_energy_used_to_t0:
	{
		label: 'Electrical Energy at &equiv; L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = outputs.E_gamma_photon_energy_in_main_beam_to_time_t0.val /
				inputs.epsilon_sub_elec_photon_to_electrical_eff.val /
				inputs.epsilon_sub_beam_beam_eff.val;
		}
	},
	electrical_cost:
	{
		label: 'Electrical Energy Cost',
		unit:
		{
			'$': 1
		},
		update()
		{
			this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
		}
	},
	v_infinity_speed_with_continued_illumination:
	{
		label: 'Limiting Speed',
		unit:
		{
			'km/s': ( km / s ),
			'% c': ( c_speed_light / 100 )
		},
		update()
		{
			this.val = Math.sqrt( 2 ) * outputs.v_0_speed_to_L0.val;
		}
	}
};

/** Return whether the variable is a number
 *
 * @param {*} n - Variable to check
 * @return {Boolean}
 */
function isNumeric( n )
{
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

/** Initializes the HTML input and output tables
 * Note this is an immediately invoked function and will run immediately
 */
( function init()
{
	// Populate the input form/ table with inputs
	var inputs_element = document.getElementById( 'inputs' );
	for ( var id in inputs )
	{
		var input = inputs[ id ];
		var label = document.createElement( 'label' );
		var element = input.element = document.createElement( 'input' );

		label.innerHTML = input.label;
		element.setAttribute( 'id', id );

		// Checkbox input
		if ( typeof input.checked !== 'undefined' )
		{
			element.setAttribute( 'type', 'checkbox' );
			element.setAttribute( 'checked', input.checked );
			element.addEventListener( 'click', update, false );
		}
		else
		{
			// Numerical input
			input.min_val = input.min_val || 0;
			input.max_val = input.max_val || Infinity;
			input.step_val = input.step_val || 'any';

			element.setAttribute( 'type', 'number' );
			element.setAttribute( 'min', input.min_val );
			element.setAttribute( 'max', input.max_val );
			element.setAttribute( 'step', input.step_val );
			element.setAttribute( 'value', input.val );
			element.addEventListener( 'input', update, false );

			// Convert default values to their correct units
			if ( typeof input.unit !== 'undefined' )
			{
				input.val *= input.unit;
			}
		}

		// Create a table row for the input element and its label
		var table_row = createTableRow( [ label, element ] );
		inputs_element.appendChild( table_row );
	}

	// Populate the output form/ table with outputs
	var outputs_element = document.getElementById( 'outputs' );
	for ( var id in outputs )
	{
		var output = outputs[ id ];
		var label = document.createElement( 'label' );
		var rowCells = [ label ];
		var element = output.element = {};

		label.innerHTML = output.label;

		// Create a table cell with the output and its units
		for ( var unit in output.unit )
		{
			var unitVal = document.createElement( 'div' );
			var unitLabel = document.createElement( 'label' );
			unitLabel.innerHTML = ' ' + unit;

			rowCells.push( [ unitVal, unitLabel ] );
			element[ unit ] = unitVal;
		}

		var table_row = createTableRow( rowCells );
		outputs_element.appendChild( table_row );
	}

	// Calculate and display outputs according to the default input values
	optimize();
	calculate();
	render();
} )();

/** Create a two column row
 * 
 * @param {Array} cells - Array of cells/ columns to populate the row
 * @return {DOMElement} Table row/ tr DOM Element
 */
function createTableRow( cells )
{
	var row = document.createElement( 'tr' );

	for ( var i = 0; i < cells.length; i++ )
	{
		var cell = document.createElement( 'td' );

		// Create a cell with multiple children
		if ( Array.isArray( cells[ i ] ) )
		{
			for ( var j = 0; j < cells[ i ].length; j++ )
			{
				cell.appendChild( cells[ i ][ j ] );
			}
		}
		else
		{
			// Create a cell with one child
			cell.appendChild( cells[ i ] );
		}

		row.appendChild( cell );
	}

	return row;
}

/** Record changes to an HTML input
 *
 * @param {DOMElement} input_element - HTML input to retrieve value from
 * @return {Boolean} Whether input is valid or not
 */
function load( input_element )
{
	var input = inputs[ input_element.getAttribute( 'id' ) ];
	input.val = input_element.value;

	if ( isNumeric( input.val ) )
	{
		// Value is below range
		if ( typeof input.min_val !== 'undefined' && input.val <= input.min_val )
		{
			return;
		}

		// Value is above range
		if ( typeof input.max_val !== 'undefined' && input.val > input.max_val )
		{
			return;
		}

		// Convert to SI units
		if ( typeof input.unit !== 'undefined' )
		{
			input.val *= input.unit;
		}

		return true;
	}

	if ( typeof ( input.checked ) !== 'undefined' )
	{
		input.checked = input_element.checked;

		return true;
	}
}

/** Optimize the size of the sail
 */
function optimize()
{
	inputs.D_sail_size.element.disabled = inputs.auto_sail.checked;

	if ( !inputs.auto_sail.checked )
	{
		return;
	}

	// Calculate sail size for sail mass = m0_payload_mass mass
	inputs.D_sail_size.element.value = inputs.D_sail_size.val =
		Math.sqrt( inputs.m0_payload_mass.val / ( inputs.rho_sail_density.val * inputs.h_sail_thickness.val ) );
}

/** Calculate the outputs
 */
function calculate()
{
	/** Adjust laser power according to its efficiency
	 * TODO: Remove these lines and the last line in this func. for cleanliness
	 */
	var P0_laser_power_in_main_beam = inputs.P0_laser_power_in_main_beam.val;
	inputs.P0_laser_power_in_main_beam.val *= inputs.epsilon_sub_beam_beam_eff.val * inputs.epsilon_sub_elec_photon_to_electrical_eff.val;

	for ( var id in outputs )
	{
		outputs[ id ].update();
	}

	// Restore the perfect efficiency laser
	inputs.P0_laser_power_in_main_beam.val = P0_laser_power_in_main_beam;
}

/** Render the outputs
 */
function render()
{
	for ( var id in outputs )
	{
		var output = outputs[ id ];
		var value = output.val;

		for ( var unit in output.unit )
		{
			output.element[ unit ].innerHTML = parseFloat( value / output.unit[ unit ] ).toPrecision( 3 ) + ' ';
		}
	}
}

/** Event handler when inputs are changed
 * Re-calculate the outputs based on the new inputs
 *
 * @param {Event} e
 */
function update( e )
{
	if ( !load( e.target ) )
	{
		return;
	}

	optimize();
	calculate();
	render();
}
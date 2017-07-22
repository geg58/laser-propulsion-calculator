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

// Look Up Tables
var relativistic_beta_to_ratio = {
    0: 1,
    0.01: 1.0067,
    0.02: 1.0136,
    0.03: 1.0206,
    0.04: 1.0277,
    0.05: 1.03,
    0.06: 1.0425,
    0.07: 1.0501,
    0.08: 1.0578,
    0.09: 1.0657,
    0.1: 1.07,
    0.15:1.12,
    0.2: 1.17,
    0.25: 1.21,
    0.3: 1.28,
    0.35: 1.35,
    0.4: 1.43,
    0.45: 1.52,
    0.5: 1.63,
    0.55: 1.76,
    0.6: 1.92,
    0.65: 2.12,
    0.7: 2.38,
    0.75: 2.73,
    0.78: 3,
    0.8: 3.23,
    0.82: 3.49,
    0.85: 4,
    0.87: 4.46,
    0.89: 5,
    0.9: 5.43,
    0.91: 5.88,
    0.92: 6.43,
    0.93: 7.11,
    0.94: 7.98,
    0.95: 9.15,
    0.96: 10.83,
    0.97: 13.44,
    0.98: 18.23,
    0.99: 30.67,
    0.995: 51.6133,
    0.999: 172.6483,
    0.9995: 290.3748,
    0.9999: 970.9717,
    0.99995: 1632.9832,
    0.99999: 5460.235,
    0.999995: 9182.9897,
};

var beta_non_relativistic_to_ratio = {
  0.0000: 1.0000,
  0.0101: 1.0067,
  0.0203: 1.0136,
  0.0306: 1.0206,
  0.0411: 1.0277,
  0.0515: 1.0300,
  0.0625: 1.0425,
  0.0735: 1.0501,
  0.0846: 1.0578,
  0.0959: 1.0657,
  0.1070: 1.0700,
  0.1680: 1.1200,
  0.2340: 1.1700,
  0.3025: 1.2100,
  0.3840: 1.2800,
  0.4725: 1.3500,
  0.5720: 1.4300,
  0.6840: 1.5200,
  0.8150: 1.6300,
  0.9680: 1.7600,
  1.1520: 1.9200,
  1.3780: 2.1200,
  1.6660: 2.3800,
  2.0475: 2.7300,
  2.3400: 3.0000,
  2.5840: 3.2300,
  2.8618: 3.4900,
  3.4000: 4.0000,
  3.8802: 4.4600,
  4.4500: 5.0000,
  4.8870: 5.4300,
  5.3508: 5.8800,
  5.9156: 6.4300,
  6.6123: 7.1100,
  7.5012: 7.9800,
  8.6925: 9.1500,
  10.3968: 10.8300,
  13.0368: 13.4400,
  17.8654: 18.2300,
  30.3633: 30.6700,
  51.3552: 51.6133,
  172.4757: 172.6483,
  290.2296: 290.3748,
  970.8746: 970.9717,
  1632.9016: 1632.9832,
  5460.1804: 5460.2350,
  9182.9438: 9182.9897,
};
// for (var b in relativistic_beta_to_ratio) {
//   beta_non_relativistic_to_ratio[b * relativistic_beta_to_ratio[b]] = relativistic_beta_to_ratio[b];
// }

var fn_calculated_to_beta_inf_final_speed = {
  "-42163227.794": 1.0000,
  "-14906784.4406": 1.0000,
  "-1333183.3349": 1.0000,
  "-471298.457": 0.9999,
  "-42116.2729": 0.9995,
  "-14873.5858": 0.9990,
  "-1318.349": 0.9950,
  "-460.82": 0.9900,
  "-159.198": 0.9800,
  "-84.6365": 0.9700,
  "-53.6667": 0.9600,
  "-37.47": 0.9500,
  "-27.7994": 0.9400,
  "-21.5035": 0.9300,
  "-17.1464": 0.9200,
  "-13.9909": 0.9100,
  "-11.6237": 0.9000,
  "-9.7975": 0.8900,
  "-7.1964": 0.8700,
  "-5.4629": 0.8500,
  "-3.7686": 0.8200,
  "-3": 0.8000,
  "-2.4135": 0.7800,
  "-1.7638": 0.7500,
  "-1.058": 0.7000,
  "-0.6204": 0.6500,
  "-0.3333": 0.6000,
  "-0.1375": 0.5500,
  "-0.0239": 0.5100,
  0.0984: 0.4500,
  0.1697: 0.4000,
  0.2217: 0.3500,
  0.2596: 0.3000,
  0.2869: 0.2500,
  0.3062: 0.2000,
  0.3193: 0.1500,
  0.3276: 0.1000,
  0.3287: 0.0900,
  0.3298: 0.0800,
  0.3306: 0.0700,
  0.3314: 0.0600,
  0.332: 0.0500,
  0.3325: 0.0400,
  0.3329: 0.0300,
  0.3331: 0.0200,
  0.33328: 0.0100,
  0.33333: 0.0000,
};


function get_value_from_sorted_table_with_newton_approx_for_missing (table, target, default_value) {
  var last = parseFloat(Object.keys(table)[0]);
  if (last == 0) {
    last = parseFloat(Object.keys(table)[1]);
  }
  for (var key in table) {
      key = parseFloat(key);
      if (key == target) {
        return table[target];
      } else if (key < target) {
        last = key;
      } else {
        var slope = (table[key] - table[last]) / (key - last);
        return (target - last) * slope + table[last];
      }
  }
  return default_value;
}

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
    val: 0.001,
  },
  auto_sail: {
    label: 'Use Optimal Sail',
    type: 'checkbox',
    val: true,
  },
  use_square_sail: {
    label: 'Use Square Sail',
    type: 'radio',
    val: true,
    attributes: {
      name: 0
    },
  },
  use_circular_sail: {
    label: 'Use Circular Sail',
    type: 'radio',
    val: false,
    attributes: {
      name: 0
    },
  },
  use_spherical_sail: {
    label: 'Use Spherical Sail',
    type: 'radio',
    val: false,
    attributes: {
      name: 0
    },
  },
  D_sail_size: {
    label: 'Sail Diameter',
    unit: {
      m: m,
    },
    val: 1,
  },
  h_sail_thickness: {
    label: 'Sail Thickness',
    unit: {
      '&mu;m': um,
    },
    val: 1,
  },
  rho_sail_density: {
    label: 'Sail Density',
    unit: {
      'g/cm<sup>3</sup>': (g / Math.pow(cm, 3)), // Grams per centimeter cubed
    },
    val: 1,
  },
  epsilon_sub_r_reflection_coef: {
    label: 'Sail Reflection Efficiency (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  alpha_reflector_absorption: {
    label: 'Sail Absorption of Light not Reflected (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  epsilon_emissivity_front: {
    label: 'Sail Front Emissivity (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  epsilon_emissivity_back: {
    label: 'Sail Back Emissivity (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  use_circular_array: {
    label: 'Use Circular Laser Array',
    type: 'checkbox',
    val: true,
    update: function() {
      if (this.val) {
        enableInput(inputs.use_circular_sail);
        enableInput(inputs.use_spherical_sail);
      } else {
        disableInput(inputs.use_circular_sail);
        disableInput(inputs.use_spherical_sail);
        inputs.use_square_sail.val = true;
        inputs.use_square_sail.element.checked = true;
      }
    },
  },
  d_array_size: {
    label: 'Laser Array Side Length',
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
    val: 100,
  },
  epsilon_sub_beam_beam_eff: {
    label: 'Beam Efficiency (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  lambda_wavelength: {
    label: 'Wavelength',
    unit: {
      nm: nm,
    },
    val: 1060,
    attributes: {
      min: 1,
    },
  },
  epsilon_sub_elec_photon_to_electrical_eff: {
    label: 'Electrical Efficiency (0 - 1)',
    val: 1,
    attributes: {
      min: 0,
      max: 1,
    },
  },
  energy_cost: {
    label: 'Electrical Energy Cost',
    unit: {
      '$/kW-hr': (1 / (kW * hr)),
    },
    val: 0.1,
  },
  energy_storage_cost: {
    label: 'Energy Storage Cost',
    unit: {
      '$/W-hr': (1 / (W * hr)),
    },
    val: 0.1,
  },
  Laser_comm_spacecraft_power_peak: {
    label: 'Peak Laser Comm Power',
    unit: {
      W: W,
    },
    val: 1,
  },
  Photons_per_bit_for_communication: {
    label: 'Photons Per Bit for Communication',
    unit: {
      'ph/bit': 1,
    },
    val: 1,
  },
  lambda_laser_comm_wavelength: {
    label: 'Laser Comm Wavelength',
    unit: {
      nm: nm,
    },
    val: 600,
  },
  Laser_comm_beam_efficiency: {
    label: 'Laser Comm Beam Efficiency (0 - 1)',
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
    val: 1,
  },
  L_target: {
    label: 'Target Distance',
    unit: {
      ly: ly,
    },
    val: 4.37,
  },
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
      if (inputs.use_circular_sail.val) {
        this.val = Math.PI / 4;
      } else if (inputs.use_spherical_sail.val) {
        this.val = Math.PI;
      } else {
        this.val = 1;
      }
    },
  },
  xi_array_constant: {
    update: function() {
      this.val = inputs.use_circular_sail.val ? Math.PI / 4 : 1;
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

var hiddens_relativistic = {
  beta_non_relativistic: {
    update: function() {
      this.val = outputs.v_0_speed_to_L0.val / c_speed_light;
    }
  },
  beta_relativistic: { // to change
    update: function() {
      // to change
      var x = hiddens_relativistic.beta_non_relativistic.val;
      var ratio = get_value_from_sorted_table_with_newton_approx_for_missing(beta_non_relativistic_to_ratio, x, 9182.9897);
      this.val = x / ratio;
      if (this.val >= 1) {
        this.val = 1;
      }
    }
  },
  gamma: {
    update: function () {
      var beta = hiddens_relativistic.beta_relativistic.val;
      if (beta >= 1) {
        this.val = 1 / Math.sqrt(0.00000000000000000001);// manual to prevent NaN
      } else{
        this.val = 1 / Math.sqrt(1 - beta * beta);
      }
    }
  }
}

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
    update: function() {
      this.val = (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2) *
        inputs.h_sail_thickness.val * inputs.rho_sail_density.val);
    },
  },
  m_total_mass: {
    label: 'Total Mass',
    unit: {
      g: g,
    },
    update: function() {
      this.val = inputs.m0_payload_mass.val + outputs.m_sail.val;
    },
  },
  sail_areal: {
    label: 'Areal Density',
    unit: {
      'g/m<sup>2</sup>': (g / Math.pow(m, 2)),
    },
    update: function() {
      this.val = inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
    },
  },
  P0_laser_power_in_main_beam: {
    label: 'Laser Power in Main Beam',
    unit: {
      GW: GW,
    },
    update: function() {
      this.val = inputs.epsilon_sub_beam_beam_eff.val * inputs.P_optical.val;
    },
  },
  flux_on_sail: {
    label: 'Flux on Sail',
    unit: {
      'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
    },
    update: function() {
      this.val = (outputs.P0_laser_power_in_main_beam.val /
        (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
    },
  },
  Force_on_Sail: {
    label: 'Total Force on Sail',
    unit: {
      'N': 1,
    },
    update: function() {
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
    update: function() {
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
    update: function() {
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
    update: function() {
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
    update: function() {
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
    update: function() {
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
    update: function() {
      this.val = 0.5 * outputs.m_total_mass.val * Math.pow(outputs.v_0_speed_to_L0.val, 2);
    },
  },
  E_gamma_photon_energy_in_main_beam_to_time_t0: {
    label: 'Laser Energy in Main Beam at L<sub>0</sub>',
    unit: {
      'GW*hr': (GW * hr),
      J: J,
    },
    update: function() {
      this.val = outputs.P0_laser_power_in_main_beam.val * outputs.t0_time_to_L0.val;
    },
  },
  E_elec_total_electrical_energy_used_to_t0: {
    label: 'Electrical Energy at L<sub>0</sub>',
    unit: {
      'GW*hr': (GW * hr),
      J: J,
    },
    update: function() {
      this.val = (inputs.P_optical.val * outputs.t0_time_to_L0.val /
        inputs.epsilon_sub_elec_photon_to_electrical_eff.val);
    },
  },
  launch_efficiency_at_L0: {
    label: 'Launch Efficiency at L<sub>0</sub> (KE / Electrical Energy)',
    unit: {
      '%': 1 / 100,
    },
    update: function() {
      this.val = outputs.l0_ke.val / outputs.E_elec_total_electrical_energy_used_to_t0.val;
    },
  },
  energy_cost_per_launch: {
    label: 'Electrical Energy Cost at L<sub>0</sub>',
    unit: {
      '$': 1,
    },
    update: function() {
      this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
    },
  },
  energy_storage_cost_per_launch: {
    label: 'Energy Storage Cost at L<sub>0</sub>',
    unit: {
      '$': 1,
    },
    update: function() {
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
    update: function() {
      this.val = Math.sqrt(2) * outputs.v_0_speed_to_L0.val;
    },
  },
  time_to_target_at_limiting_speed: {
    label: 'Time to Target at Limiting Speed',
    unit: {
      'yr': yr,
    },
    update: function() {
      this.val = inputs.L_target.val / outputs.v_infinity_speed_with_continued_illumination.val;
    },
  },
  flux_absorbed_by_sail: {
    label: 'Max Flux Absorbed by Sail',
    unit: {
      'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
    },
    update: function() {
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
    update: function() {
      this.val = (outputs.flux_absorbed_by_sail.val *
        (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
    },
  },
  sail_equilibrium_temperature: {
    label: 'Sail Equilibrium Temperature',
    unit: {
      'K': 1,
    },
    update: function() {
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
    update: function() {
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
    update: function() {
      this.val = -2.5 * Math.log(outputs.Laser_comm_flux_at_earth.val / 3e10) / Math.log(10);
    },
  },
  Laser_comm_rate_at_earth: {
    label: 'Laser Comm Rate Received in Array',
    unit: {
      'ph/s': (1 / s),
    },
    update: function() {
      this.val = outputs.Laser_comm_flux_at_earth.val * hiddens.xi_sail_constant.val *
        Math.pow(inputs.d_array_size.val, 2);
    },
  },
  Laser_comm_bit_rate_received_in_array: {
    label: 'Laser Comm Bit Rate Received in Array',
    unit: {
      'bits/s': 1,
    },
    update: function() {
      this.val = outputs.Laser_comm_rate_at_earth.val /
        inputs.Photons_per_bit_for_communication.val;
    },
  },
  Laser_comm_received_wavelength_at_L0: {
    label: 'Laser Comm Wavelength at Speed at L0',
    unit: {
      'nm': nm,
    },
    update: function() {
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
    update: function() {
      var beta_infinity = outputs.v_infinity_speed_with_continued_illumination.val /
        c_speed_light;

      this.val = inputs.lambda_laser_comm_wavelength.val *
        Math.pow((1 + beta_infinity) / (1 - beta_infinity), 1 / 2);
    },
  },
};


/**
 * Output variables with relativistic correction
 *
 * @typedef {Object} Output
 * @property {String} label - User friendly name
 * @property {Number} unit - Display different SI units than those calculated
 * @property {Number} val - Calculated value
 * @property {Function} update() - Updates val
 */
var outputs_relativistic = {
    m_sail: {
        label: 'Sail Mass',
        unit: {
            g: g,
        },
        update: function() {
            this.val = (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2) *
                inputs.h_sail_thickness.val * inputs.rho_sail_density.val);
        },
    },
    m_total_mass: {
        label: 'Total Mass',
        unit: {
            g: g,
        },
        update: function() {
            this.val = inputs.m0_payload_mass.val + outputs_relativistic.m_sail.val;
        },
    },
    sail_areal: {
        label: 'Areal Density',
        unit: {
            'g/m<sup>2</sup>': (g / Math.pow(m, 2)),
        },
        update: function() {
            this.val = inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
        },
    },
    P0_laser_power_in_main_beam: {
        label: 'Laser Power in Main Beam',
        unit: {
            GW: GW,
        },
        update: function() {
            this.val = inputs.epsilon_sub_beam_beam_eff.val * inputs.P_optical.val;
        },
    },
    flux_on_sail: {
        label: 'Flux on Sail',
        unit: {
            'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
        },
        update: function() {
            this.val = (outputs_relativistic.P0_laser_power_in_main_beam.val /
                (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
        },
    },
    Force_on_Sail: {
        label: 'Total Force on Sail',
        unit: {
            'N': 1,
        },
        update: function() {
            this.val = hiddens.total_light_efficiency.val *
                outputs_relativistic.P0_laser_power_in_main_beam.val / (c_speed_light);
        },
    },
    Peak_Sail_Pressure: {
        label: 'Peak Sail Pressure',
        unit: {
            'Pa': 1,
            'psi': psi,
        },
        update: function() {
            this.val = hiddens.total_light_efficiency.val *
                outputs_relativistic.flux_on_sail.val / (c_speed_light);
        },
    },
    a_acceleration: {
        label: 'Peak Acceleration',
        unit: {
            'm/s<sup>2</sup>': 1,
            'g<sub>n</sub>': g_n,
        },
        update: function() {
            this.val = hiddens.total_light_efficiency.val *
                outputs_relativistic.P0_laser_power_in_main_beam.val / (outputs_relativistic.m_total_mass.val * c_speed_light);
        },
    },
    L0_distance_to_spot_size_equals_sail_size: {
        label: 'L<sub>0</sub>',
        unit: {
            au: au,
            km: km,
        },
        update: function() {
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
        update: function() {
            var beta = hiddens_relativistic.beta_relativistic.val;
            this.val = outputs.t0_time_to_L0.val / (3 * beta) * (
                          (1 + beta) * (2 - beta) * hiddens_relativistic.gamma.val / (1 - beta) - 2);
        },
    },
    v_0_speed_to_L0: {
        label: 'Speed at L<sub>0</sub>',
        unit: {
            'km/s': (km / s),
            '% c': (c_speed_light / 100),
        },
        update: function() {
          this.val = hiddens_relativistic.beta_relativistic.val * c_speed_light;
        },
    },
    l0_ke: {
        label: 'Kinetic Energy at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update: function() {
            this.val = outputs_relativistic.m_total_mass.val * Math.pow(c_speed_light, 2) * (hiddens_relativistic.gamma.val - 1);
        },
    },
    E_gamma_photon_energy_in_main_beam_to_time_t0: {
        label: 'Laser Energy in Main Beam at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update: function() {
            this.val = outputs_relativistic.P0_laser_power_in_main_beam.val * outputs_relativistic.t0_time_to_L0.val;
        },
    },
    E_elec_total_electrical_energy_used_to_t0: {
        label: 'Electrical Energy at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update: function() {
            this.val = (inputs.P_optical.val * outputs_relativistic.t0_time_to_L0.val /
                inputs.epsilon_sub_elec_photon_to_electrical_eff.val);
        },
    },
    launch_efficiency_at_L0: {
        label: 'Launch Efficiency at L<sub>0</sub> (KE / Electrical Energy)',
        unit: {
            '%': 1 / 100,
        },
        update: function() {
            this.val = outputs_relativistic.l0_ke.val / outputs_relativistic.E_elec_total_electrical_energy_used_to_t0.val;
        },
    },
    energy_cost_per_launch: {
        label: 'Electrical Energy Cost at L<sub>0</sub>',
        unit: {
            '$': 1,
        },
        update: function() {
            this.val = outputs_relativistic.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
        },
    },
    energy_storage_cost_per_launch: {
        label: 'Energy Storage Cost at L<sub>0</sub>',
        unit: {
            '$': 1,
        },
        update: function() {
            this.val = outputs_relativistic.E_elec_total_electrical_energy_used_to_t0.val *
                inputs.energy_storage_cost.val;
        },
    },
    v_infinity_speed_with_continued_illumination: {
        label: 'Limiting Speed',
        unit: {
            'km/s': (km / s),
            '% c': (c_speed_light / 100),
        },
        update: function() {
            // this.val = Math.sqrt(2) * outputs_relativistic.v_0_speed_to_L0.val;
            var beta_0 = hiddens_relativistic.beta_relativistic.val;
            var value  = (2 - 4 * beta_0) * Math.sqrt(1 - beta_0 * beta_0) / 3 / (Math.pow(1 - beta_0, 2)) - 1 / 3;
            var attempt1 = get_value_from_sorted_table_with_newton_approx_for_missing(fn_calculated_to_beta_inf_final_speed, value, 0.00000000001) * c_speed_light;
            var v_0_speed_to_L0 = hiddens_relativistic.beta_relativistic.val * c_speed_light

            if (attempt1 <= v_0_speed_to_L0) {
              this.val = Math.pow(2, 0.5) * v_0_speed_to_L0;
            } else {
              this.val = attempt1;
            }
        },
    },
    time_to_target_at_limiting_speed: {
        label: 'Time to Target at Limiting Speed',
        unit: {
            'yr': yr,
        },
        update: function() {
            this.val = inputs.L_target.val / outputs_relativistic.v_infinity_speed_with_continued_illumination.val;
        },
    },
    flux_absorbed_by_sail: {
        label: 'Max Flux Absorbed by Sail',
        unit: {
            'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
        },
        update: function() {
            this.val = (outputs_relativistic.flux_on_sail.val *
                (1 - inputs.epsilon_sub_r_reflection_coef.val) * inputs.alpha_reflector_absorption.val
            );
        },
    },
    power_absorbed_by_sail: {
        label: 'Max Power Absorbed by Sail',
        unit: {
            'GW': (GW / Math.pow(m, 2)),
        },
        update: function() {
            this.val = (outputs_relativistic.flux_absorbed_by_sail.val *
                (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
        },
    },
    sail_equilibrium_temperature: {
        label: 'Sail Equilibrium Temperature',
        unit: {
            'K': 1,
        },
        update: function() {
            this.val = Math.pow((outputs_relativistic.flux_absorbed_by_sail.val) / (sigma_stefan_boltzmann *
                    (inputs.epsilon_emissivity_front.val + inputs.epsilon_emissivity_back.val)), 1 /
                4);
        },
    },
    Laser_comm_flux_at_earth: {
        label: 'Laser Comm Flux at Earth',
        unit: {
            'ph s<sup>-1</sup>m<sup>-2</sup>': (1 / (s * Math.pow(m, 2))),
        },
        update: function() {
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
        update: function() {
            this.val = -2.5 * Math.log(outputs_relativistic.Laser_comm_flux_at_earth.val / 3e10) / Math.log(10);
        },
    },
    Laser_comm_rate_at_earth: {
        label: 'Laser Comm Rate Received in Array',
        unit: {
            'ph/s': (1 / s),
        },
        update: function() {
            this.val = outputs_relativistic.Laser_comm_flux_at_earth.val * hiddens.xi_sail_constant.val *
                Math.pow(inputs.d_array_size.val, 2);
        },
    },
    Laser_comm_bit_rate_received_in_array: {
        label: 'Laser Comm Bit Rate Received in Array',
        unit: {
            'bits/s': 1,
        },
        update: function() {
            this.val = outputs_relativistic.Laser_comm_rate_at_earth.val /
                inputs.Photons_per_bit_for_communication.val;
        },
    },
    Laser_comm_received_wavelength_at_L0: {
        label: 'Laser Comm Wavelength at Speed at L0',
        unit: {
            'nm': nm,
        },
        update: function() {
            var beta_0 = outputs_relativistic.v_0_speed_to_L0.val / c_speed_light;

            this.val = inputs.lambda_laser_comm_wavelength.val *
                Math.pow((1 + beta_0) / (1 - beta_0), 1 / 2);
        },
    },
    Laser_comm_received_wavelength_at_limiting_speed: {
        label: 'Laser Comm Wavelength at Limiting Speed',
        unit: {
            'nm': nm,
        },
        update: function() {
            var beta_infinity = outputs_relativistic.v_infinity_speed_with_continued_illumination.val /
                c_speed_light;

            this.val = inputs.lambda_laser_comm_wavelength.val *
                Math.pow((1 + beta_infinity) / (1 - beta_infinity), 1 / 2);
        },
    },
};

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
 * Enable a disabled input
 * Remove "(Disabled)" from its label
 */
function enableInput(input) {
  input.element.disabled = false;

  var label = input.label;
  var i = label.search(/\s\(Disabled\)/g);
  if (i > -1) {
    input.label = label.substring(0, i);
  }

  input.htmlLabel.innerHTML = input.label;
}

/**
 * Disable an enabled input
 * Append "(Disabled)" to its label
 */
function disableInput(input) {
  input.element.disabled = true;

  if (isDefined(input.element.checked)) {
    input.element.checked = false;
  }

  var label = input.label;
  var i = label.search(/\s\(Disabled\)/g);
  if (i === -1) {
    input.label += ' (Disabled)';
  }

  input.htmlLabel.innerHTML = input.label;

  if (input.type === 'radio' || input.type === 'checked') {
    input.val = false;
  }
}

/** Initializes the HTML input and output tables
 * Note this is an immediately invoked function and will run immediately
 */
(function init() {
  /** Create a two column row
   *
   * @param {Array} cells - Array of cells/ columns to populate the row
   * @return {DOMElement} Table row/ tr DOM Element
   */
  function createTableRow(cells) {
    var row = document.createElement('tr');

    for (var i = 0; i < cells.length; i++) {
      var cell = document.createElement('td');

      // Create a cell with multiple children
      if (Array.isArray(cells[i])) {
        for (var j = 0; j < cells[i].length; j++) {
          cell.appendChild(cells[i][j]);
        }
      } else {
        // Create a cell with one child
        cell.appendChild(cells[i]);
      }

      row.appendChild(cell);
    }

    return row;
  }

  // Populate the input form/ table with inputs
  var inputs_element = document.getElementById('inputs');
  for (var id in inputs) {
    var input = inputs[id];
    input.default = input.val;

    var label = input.htmlLabel = document.createElement('label');
    label.innerHTML = input.label;
    label.setAttribute('for', id);

    var element = input.element = document.createElement('input');
    element.setAttribute('type', (input.type || 'number'));
    element.setAttribute('id', id);

    switch (input.type) {
      case 'checkbox':
        if (input.val) {
          element.setAttribute('checked', true);
        }
        element.addEventListener('click', updateInput, false);

        break;
      case 'radio':
        if (input.val) {
          element.setAttribute('checked', true);
        }
        element.addEventListener('click', updateInput, false);

        break;
      default: // Number
        element.setAttribute('value', input.val);
        element.addEventListener('input', updateInput, false);

        // Convert default values to their correct units
        var i = 0;
        for (var unit in input.unit) {
          if (i > 0) {
            throw 'Only one input unit allowed';
          }

          label.innerHTML += ' <label class="unit">(' + unit + ')</label>';
          input.val *= input.unit[unit];

          // Only allow one unit for inputs
          i++;
        }
    }

    // Add attributes to the DOMElement (such as max, min, and step for inputs)
    for (var attribute in input.attributes) {
      element.setAttribute(attribute, input.attributes[attribute]);
    }

    // Create a table row for the input element and its label
    var table_row = createTableRow([label, element]);
    inputs_element.appendChild(table_row);
  }

  // Populate the output form/ table with outputs
  var outputs_element = document.getElementById('outputs');
  for (var id in outputs) {
    var output = outputs[id];
    var label = document.createElement('label');
    var rowCells = [label];
    var element = output.element = {};

    label.innerHTML = output.label;

    // Create object to store values for each unit
    outputs[id].unitVal = {};

    var count = 0;
    // Create a table cell with the output and its units
    for (var unit in output.unit) {
      var unitVal = document.createElement('div');
      var unitLabel = document.createElement('label');
      unitLabel.className = 'unit';
      unitLabel.innerHTML = ' ' + unit;
      count = count + 1;

      rowCells.push([unitVal, unitLabel]);
      element[unit] = unitVal;
    }

    if (count == 1) {
      var unitVal = document.createElement('div');
      var unitLabel = document.createElement('label');
      unitLabel.className = 'unit';
      unitLabel.innerHTML = ' ';
      count = count + 1;

      rowCells.push([unitVal, unitLabel]);
    }
 
    var table_row = createTableRow(rowCells);
    outputs_element.appendChild(table_row);
  }

  // Populate the output form/ table with outputs
  var outputs_element_relativistic = document.getElementById('outputs_relativistic');
  for (var id in outputs_relativistic) {
    var output = outputs_relativistic[id];
    var label = document.createElement('label');
    var rowCells = [label];
    var element = output.element = {};

    label.innerHTML = output.label;

    // Create object to store values for each unit
    outputs_relativistic[id].unitVal = {};

    var count = 0;
    // Create a table cell with the output and its units
    for (var unit in output.unit) {
      var unitVal = document.createElement('div');
      var unitLabel = document.createElement('label');
      unitLabel.className = 'unit';
      unitLabel.innerHTML = ' ' + unit;
      count = count + 1;
      rowCells.push([unitVal, unitLabel]);
      element[unit] = unitVal;
    }

    if (count == 1) {
      var unitVal = document.createElement('div');
      var unitLabel = document.createElement('label');
      unitLabel.className = 'unit';
      unitLabel.innerHTML = ' ';
      count = count + 1;

      rowCells.push([unitVal, unitLabel]);
    }

    var table_row = createTableRow(rowCells);
    outputs_element_relativistic.appendChild(table_row);
  }

  document.getElementById('download_csv').addEventListener('click', downloadCSV, false);
  document.getElementById('import_csv').addEventListener('change', importCSV, false);
  document.getElementById('reset').addEventListener('click', reset, false);

  update();
})();

/** Record changes to an HTML input
 *
 * @param {Event} e - Event
 */
function updateInput(e) {
  var input_element = e.target;
  var input = inputs[input_element.getAttribute('id')];
  var type = input.type;
  input.val = input.rawVal = parseFloat(input_element.value);

  if (type === 'checkbox') {
    input.val = input_element.checked;

    if (isDefined(input.update) && input.update() === false) {
      return;
    }

  } else if (type === 'radio') {
    if (isDefined(input.update) && input.update() === false) {
      return;
    }

    for (var id in inputs) {
      var i = inputs[id];
      if (isDefined(i.type) && i.type === 'radio') {
        i.val = i.element.checked;
      }
    }
  } else {
    if (isDefined(input.attributes)) {
      // Value is below allowed range
      if (isDefined(input.attributes.min) && input.val < input.attributes.min) {
        input.val = input.rawVal = input.attributes.min;
      }

      // Value is above allowed range
      if (isDefined(input.attributes.max) && input.val > input.attributes.max) {
        input.val = input.rawVal = input.attributes.max;
      }
    }

    // Update function to modify the entered value
    if (isDefined(input.update) && input.update() === false) {
      return;
    }

    // Convert to standard units
    for (var unit in input.unit) {
      input.val *= input.unit[unit];
    }
  }

  update();
}

/** Event handler when inputs are changed
 * Re-calculate the outputs based on the new inputs
 */
function update() {
  // Update hidden variables
  for (var id in hiddens) {
    hiddens[id].update();
  }

  optimizeSailSize();

  // Update output variables
  for (var id in outputs) {
    // Calculate standard output value
    outputs[id].update();

    // Convert output's value to non-standard units
    for (var unit in outputs[id].unit) {
      outputs[id].unitVal[unit] = (outputs[id].val / outputs[id].unit[unit]).toPrecision(3);
    }
  }

  // Update output view
  for (var id in outputs) {
    for (var unit in outputs[id].unitVal) {
      outputs[id].element[unit].innerHTML = outputs[id].unitVal[unit] + ' ';
    }
  }

  // Update hiddens_relativistic variables
  for (var id in hiddens_relativistic) {
    hiddens_relativistic[id].update();
  }


  // Update output relativistic variables
  for (var id in outputs_relativistic) {
    // Calculate standard output value
    outputs_relativistic[id].update();

    // Convert output's value to non-standard units
    for (var unit in outputs_relativistic[id].unit) {
      outputs_relativistic[id].unitVal[unit] = (outputs_relativistic[id].val / outputs_relativistic[id].unit[unit]).toPrecision(3);
    }
  }

    // Update output relativistic view
  for (var id in outputs_relativistic) {
    for (var unit in outputs_relativistic[id].unitVal) {
      outputs_relativistic[id].element[unit].innerHTML = outputs_relativistic[id].unitVal[unit] + ' ';
    }
  }
}

/** 
 * Optimize the size of the sail
 */
function optimizeSailSize() {
  inputs.D_sail_size.element.disabled = inputs.auto_sail.val;
  if (!inputs.auto_sail.val) {
    return;
  }

  // Calculate sail size for sail mass = m0_payload_mass mass
  inputs.D_sail_size.element.value = inputs.D_sail_size.val =
    Math.sqrt(inputs.m0_payload_mass.val / (hiddens.xi_sail_constant.val *
      inputs.rho_sail_density.val * inputs.h_sail_thickness.val));
}

/**
 * Download a CSV file 
 */
function downloadCSV() {
  var filename = prompt('Enter filename for CSV', 
    'laser_propulsion_calculations.csv');
  if (filename != null) {
    exportToCsv(filename);
  }
}

/**
 * Download a CSV file to the user with the contents of the calculator
 *
 * @param {String} filename - Name of the file being downloaded
 */
function exportToCsv(filename) {

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
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

/**
 * Generate a JSON object, which can easily be converted to a CSV file
 */
function createCSV() {
  var lineArray = [
    ['Inputs', 'Value', 'Unit', '',
      'Non Relativistic Outputs', 'Value 1', 'Unit', 'Value 2', 'Unit', '',
      'Relativistic Outputs', 'Value 1', 'Unit', 'Value 2', 'Unit'],
  ];

  var inputsArray = Object.getOwnPropertyNames(inputs);
  var outputsArray = Object.getOwnPropertyNames(outputs);
  var relativisticsArray = Object.getOwnPropertyNames(outputs_relativistic);

  var endCondition = Math.max(relativisticsArray.length, 
                              Math.max(inputsArray.length, outputsArray.length));
  for (var i = 0; i < endCondition; i++) {
    var input = inputs[inputsArray[i]];
    var output = outputs[outputsArray[i]];
    var relativistic = outputs_relativistic[relativisticsArray[i]]

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

      line.push('');
    } else {
      // More outputs than inputs so add empty input line
      line = line.concat(['', '', '', '']);
    }

    if (isDefined(output)) {
      line.push(htmlToText(output.label));
      var count = 0;
      for (var unit in output.unitVal) {
        line.push(output.unitVal[unit]);
        line.push(htmlToText(unit));
        count = count + 1;
      }
      if (count != 2) {
        line.push('');
        line.push('');
      }

      line.push('');
    } else {
      // More outputs than inputs so add empty input line
      line = line.concat(['', '', '', '', '', '']);
    }

    if (isDefined(relativistic)) {
      line.push(htmlToText(relativistic.label));
      var count = 0;
      for (var unit in relativistic.unitVal) {
        line.push(relativistic.unitVal[unit]);
        line.push(htmlToText(unit));
        count = count + 1;
      }
      if (count != 2) {
        line.push('');
        line.push('');
      }
    } else {
      // More outputs than inputs so add empty input line
      line = line.concat(['', '', '', '', '']);
  }

    lineArray.push(line);
  }

  return lineArray;
}

/**
 * Convert a unit in HTML format to text
 */
function htmlToText(unitHTML) {
  if (!isDefined(unitHTML)) {
    return unitHTML;
  }

  unitHTML = String(unitHTML).replace(/&mu;/g, 'u');
  unitHTML = String(unitHTML).replace(/<sup>/g, '^');
  unitHTML = String(unitHTML).replace(/<sub>/g, '_');

  unitHTML = String(unitHTML).replace(/<\/sup>/g, '');
  unitHTML = String(unitHTML).replace(/<\/sub>/g, '');

  return unitHTML;
}

/**
 * Reset inputs to their default values
 */
function reset() {
  location.reload();
}

/**
 * Import a CSV into the calculator
 *
 * @param {Event} e - Event from a file upload button
 */
function importCSV(e) {
  var files = e.target.files;
  if (files.length !== 1) {
    return;
  }

  var file = files[0];
  if (file.type !== 'text/csv') {
    return;
  }

  var reader = new FileReader();

  // Wait for reader to load data
  reader.onload = function() {
    var rows = reader.result.split('\n');
    var inputsArray = Object.getOwnPropertyNames(inputs);

    // Iterate through each input
    for (var i = 0; i < Math.max(inputsArray.length); i++) {
      var input = inputs[inputsArray[i]];
      var cells = rows[i + 1].split(',');

      // Set the input's value
      var event;
      var type = input.type;
      if (type === 'checkbox' || type === 'radio') {
        input.element.checked = (cells[1] === 'true');
        event = new CustomEvent('click', {
          target: input.element
        });
      } else {
        input.element.value = parseFloat(cells[1]);
        event = new CustomEvent('input', {
          target: input.element
        });
      }

      // Trigger an input event to recompute outputs
      input.element.dispatchEvent(event);
    }
  };

  // Read body text of file
  reader.readAsText(file);
}



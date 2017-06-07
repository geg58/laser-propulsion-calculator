var outputs_relativistic = {
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
            this.val = inputs.m0_payload_mass.val + outputs_relativistic.m_sail.val;
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
            this.val = (outputs_relativistic.P0_laser_power_in_main_beam.val /
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
                outputs_relativistic.P0_laser_power_in_main_beam.val / (c_speed_light);
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
                outputs_relativistic.flux_on_sail.val / (c_speed_light);
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
                outputs_relativistic.P0_laser_power_in_main_beam.val / (outputs_relativistic.m_total_mass.val * c_speed_light);
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
                inputs.D_sail_size.val * outputs_relativistic.m_total_mass.val /
                (hiddens.total_light_efficiency.val *
                    outputs_relativistic.P0_laser_power_in_main_beam.val *
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
                outputs_relativistic.P0_laser_power_in_main_beam.val * inputs.d_array_size.val *
                inputs.D_sail_size.val /
                (c_speed_light * inputs.lambda_wavelength.val * hiddens.alpha_array_constant.val *
                    outputs_relativistic.m_total_mass.val)));
        },
    },
    l0_ke: {
        label: 'Kinetic Energy at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update() {
            this.val = 0.5 * outputs_relativistic.m_total_mass.val * Math.pow(outputs_relativistic.v_0_speed_to_L0.val, 2);
        },
    },
    E_gamma_photon_energy_in_main_beam_to_time_t0: {
        label: 'Laser Energy in Main Beam at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update() {
            this.val = outputs_relativistic.P0_laser_power_in_main_beam.val * outputs_relativistic.t0_time_to_L0.val;
        },
    },
    E_elec_total_electrical_energy_used_to_t0: {
        label: 'Electrical Energy at L<sub>0</sub>',
        unit: {
            'GW*hr': (GW * hr),
            J: J,
        },
        update() {
            this.val = (inputs.P_optical.val * outputs_relativistic.t0_time_to_L0.val /
                inputs.epsilon_sub_elec_photon_to_electrical_eff.val);
        },
    },
    launch_efficiency_at_L0: {
        label: 'Launch Efficiency at L<sub>0</sub> (KE / Electrical Energy)',
        unit: {
            '%': 1 / 100,
        },
        update() {
            this.val = outputs_relativistic.l0_ke.val / outputs_relativistic.E_elec_total_electrical_energy_used_to_t0.val;
        },
    },
    energy_cost_per_launch: {
        label: 'Electrical Energy Cost at L<sub>0</sub>',
        unit: {
            '$': 1,
        },
        update() {
            this.val = outputs_relativistic.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
        },
    },
    energy_storage_cost_per_launch: {
        label: 'Energy Storage Cost at L<sub>0</sub>',
        unit: {
            '$': 1,
        },
        update() {
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
        update() {
            this.val = Math.sqrt(2) * outputs_relativistic.v_0_speed_to_L0.val;
        },
    },
    time_to_target_at_limiting_speed: {
        label: 'Time to Target at Limiting Speed',
        unit: {
            'yr': yr,
        },
        update() {
            this.val = inputs.L_target.val / outputs_relativistic.v_infinity_speed_with_continued_illumination.val;
        },
    },
    flux_absorbed_by_sail: {
        label: 'Max Flux Absorbed by Sail',
        unit: {
            'GW/m<sup>2</sup>': (GW / Math.pow(m, 2)),
        },
        update() {
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
        update() {
            this.val = (outputs_relativistic.flux_absorbed_by_sail.val *
                (hiddens.xi_sail_constant.val * Math.pow(inputs.D_sail_size.val, 2)));
        },
    },
    sail_equilibrium_temperature: {
        label: 'Sail Equilibrium Temperature',
        unit: {
            'K': 1,
        },
        update() {
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
            this.val = -2.5 * Math.log(outputs_relativistic.Laser_comm_flux_at_earth.val / 3e10) / Math.log(10);
        },
    },
    Laser_comm_rate_at_earth: {
        label: 'Laser Comm Rate Received in Array',
        unit: {
            'ph/s': (1 / s),
        },
        update() {
            this.val = outputs_relativistic.Laser_comm_flux_at_earth.val * hiddens.xi_sail_constant.val *
                Math.pow(inputs.d_array_size.val, 2);
        },
    },
    Laser_comm_bit_rate_received_in_array: {
        label: 'Laser Comm Bit Rate Received in Array',
        unit: {
            'bits/s': 1,
        },
        update() {
            this.val = outputs_relativistic.Laser_comm_rate_at_earth.val /
                inputs.Photons_per_bit_for_communication.val;
        },
    },
    Laser_comm_received_wavelength_at_L0: {
        label: 'Laser Comm Wavelength at Speed at L0',
        unit: {
            'nm': nm,
        },
        update() {
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
        update() {
            var beta_infinity = outputs_relativistic.v_infinity_speed_with_continued_illumination.val /
                c_speed_light;

            this.val = inputs.lambda_laser_comm_wavelength.val *
                Math.pow((1 + beta_infinity) / (1 - beta_infinity), 1 / 2);
        },
    },
};


/* Class to generate waveform from Oscillators
 * returning:
 * */

class Wave {
  'use strict'

  constructor(_p, _sample_count, _wave_length) {
    this.p = _p;
    this.sample_count = _sample_count;
    this.wave_length = _sample_count;

    this.wave_arr = [this.wave_length];
    
    // Create Oscillators
    this.osc1 = new Oscillator(this.p, synth_input.osc1_freq, synth_input.osc1_amp, synth_input.OSC_SHAPE_SINE, synth_input.osc1_mod_rate, synth_input.osc1_mod_amnt);
    this.osc2 = new Oscillator(this.p, synth_input.osc1_freq, synth_input.osc1_amp, synth_input.OSC_SHAPE_SINE, synth_input.osc1_mod_rate, synth_input.osc1_mod_amnt);

  }

  update() {
    this.sample_count = app_settings.sample_size;
    this.wave_length = app_settings.sample_size;
    this.wave_length = 10 * synth_input.osc_scale;
    
    this.wave_arr.length = this.wave_length; //cap and refresh wave array

    for (let n = 0; n < this.wave_length; n++) {
      let wavepos_x = (n*10) / synth_input.osc_scale;
      let osc1_mix = this.p.map(synth_input.osc_mix, 0.0, 1.0, 1.0, 0.0) * this.osc1.calc(n);
      let osc2_mix = synth_input.osc_mix * this.osc2.calc(n);

      let wavepos_y  = (osc1_mix) + (osc2_mix);
      let tempVec = this.p.createVector(wavepos_x, wavepos_y); 
      this.wave_arr[n] = tempVec;
    }

  }

  update_oscillators_reverse() {
    this.osc1.update_reverse();
    this.osc2.update_reverse();
  }
  
  update_oscillators() {
    this.osc1.update();
    this.osc2.update();
  this.osc1.update_param(synth_input.osc1_freq, synth_input.osc1_amp, synth_input.osc1_mod_rate, synth_input.osc1_mod_amnt, synth_input.osc1_shape);
  this.osc2.update_param(synth_input.osc2_freq, synth_input.osc2_amp, synth_input.osc2_mod_rate, synth_input.osc2_mod_amnt, synth_input.osc2_shape);
  }

  get_wave() {
    return(this.wave_arr);
  }

  get_sample(_sample_type, _sample_size) {
    let temp_sample_arr = [_sample_size];

    switch(_sample_type) {
      case "THREADING": 
        for(let n = 0; n < _sample_size; n++) {
          let wave_idx = this.p.floor((this.wave_arr.length / _sample_size) * n);
          let  cross_section = this.wave_arr[wave_idx].y;

          temp_sample_arr[n] = Math.round(this.p.map(cross_section, 0, 1, 0, app_settings.shaft_count-1));
        }
        break;
      case "TREADLING": 
        for(let n = 0; n < _sample_size; n++) {
          let wave_idx = this.p.floor((this.wave_arr.length / _sample_size) * n);
          let  cross_section = this.wave_arr[wave_idx].y;

          temp_sample_arr[n] = Math.round(this.p.map(cross_section, 0, 1, 0, app_settings.treadle_count-1));
        }
        break;
    }
    return(temp_sample_arr);
  }

}


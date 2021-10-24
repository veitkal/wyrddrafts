
/* Warp Variations
 A placeholder test sketch for parts of  an application for generating warp color setups ridgid heddle/narrow band weaving drafts.
 */

/* Global Variables */
// let canvas;
let warp_num = 31;
let weft_num; 

let colors_arr = [];
let wave_arr = [warp_num];
let wave_multY = 40;

let warp_arr = [];
let drawdown_arr = [];
let playing = true;

let synth_input = {
  osc1_freq: 10,
  osc1_amp: 1,
  osc1_mod_rate: 0.001,
  osc1_mod_amnt: 0,
  osc2_mod_rate: 0.001,
  osc2_mod_amnt: 0,
  osc2_freq: 10,
  osc2_amp: 1,
  osc_scale: 1,
  osc_mix: 0.5,
  osc1_shape: OSC_SHAPE_SINE,
  osc2_shape: OSC_SHAPE_SINE,
}


let weave_synth_draft = new p5(function (p) {
'use strict'
  let weave_width, 
    origin_x, origin_y, 
    drawdown_org_x, drawdown_org_y,
    cell_size, cell_padding; 


  let color_bg, color_fg;

  let osc1_freq = 10;
  let osc1_amp = 1;
  let osc1_mod_rate = 0.001;
  let osc1_mod_amnt = 0;
  let osc2_mod_rate = 0.001;
  let osc2_mod_amnt = 0;
  let osc2_freq = 10;
  let osc2_amp = 1;
  let osc_scale = 1;
  let osc_mix = 0.5;
  let osc1_shape = OSC_SHAPE_SINE;
  let osc2_shape = OSC_SHAPE_TRIANGLE;


  // Oscillator
  let osc1;
  let osc2;



  p.setup = () => {
    // Setup canvas
    let canvas_div = document.getElementById("draft_canvas");
    let canvas_width = canvas_div.offsetWidth;
    let canvas_height = canvas_div.offsetHeight;
    p.createCanvas(canvas_width, canvas_height);

    // Setup Variables
    warp_num = 31;
    weft_num = 18;

    weave_width = 500;
    cell_size = weave_width / (warp_num);

    origin_x = 0;
    origin_y = 0;
    drawdown_org_x = weave_width / 5;
    drawdown_org_y = origin_y + (cell_size * 2);

    cell_padding = 15;


    //Class init
    osc1 = new Oscillator(p, osc1_freq, osc1_amp, OSC_SHAPE_SINE, osc1_mod_rate, osc1_mod_amnt);
    osc2 = new Oscillator(p, osc1_freq, osc1_amp, OSC_SHAPE_SINE, osc1_mod_rate, osc1_mod_amnt);

    colors_arr[0] = p.color(255, 255, 0);

    for(let n = 0; n < warp_num; n++) {
      warp_arr.push(n);
    }

    console.log(warp_arr);

    color_bg = p.color(255);
    color_fg = p.color(0);

    calc_drawdown();
    console.log(drawdown_arr);


  };

  p.draw = () =>  {
    wave_arr.length = warp_num; //cap and refresh wave array
    p.background(color_bg);
    update_colors();


    if (playing) {
      osc1.update();
      osc2.update();
    }

    display_warp();
    display_drawdown();

    waveform();

    update_drawdown();
  };

  function calc_drawdown() {
    let shed_up = warp_arr.filter((element, index) => {
      return index % 2 === 0;
    })

    let shed_down = warp_arr.filter((element, index) => {
      return index % 2 === 1;
    })



    for(let i = 0; i < weft_num; i++) {
      if (i % 2 === 0) {
        drawdown_arr.push(shed_up);
      } else {
        drawdown_arr.push(shed_down);
      }
    }

  }

  function display_drawdown() {

    for (let y = 0; y < drawdown_arr.length; y++) {
      for (let x = 0; x < drawdown_arr[y].length; x++) {
        let temp_x = drawdown_org_x + (x * cell_size); 
        let temp_y = drawdown_org_y * 2.5 + (y * cell_size);
        if (warp_num % 2 === 1) {
          temp_x = y % 2 === 1 ? temp_x + (cell_size / 2) : temp_x;
        }
        p.fill(drawdown_arr[y][x]);
        p.stroke(drawdown_arr[y][x]);
        p.rect(temp_x, temp_y, cell_size, cell_size);
      }
    }

  }

  function update_drawdown() {
    drawdown_arr.length = weft_num;
    let shed_up = warp_arr.filter((element, index) => {
      return index % 2 === 0;
    })

    let shed_down = warp_arr.filter((element, index) => {
      return index % 2 === 1;
    })


    for(let i = 0; i < weft_num; i++) {
      if (i % 2 === 0) {
        drawdown_arr[i] = shed_up;
      } else {
        drawdown_arr[i] = shed_down;
      }
    }

  }

  function display_warp() {
    let warpcell_size =  10;

    p.fill(255);
    p.stroke(0);

    for(let x = 0; x < warp_num; x++) {
      // let temp_x = origin_x + (x * cell_size / 2);
      let temp_x = x % 2 === 0 ? origin_x : origin_x + (warpcell_size);
      let temp_y = origin_y + (x * (warpcell_size));
      p.noStroke();
      if(warp_arr[x] !== undefined) {
        p.fill(warp_arr[x]);
      }
      p.rect(temp_x + 25, temp_y + (cell_padding / 2) + 50, warpcell_size, warpcell_size);

    }

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < drawdown_arr[y].length; x++) {
        p.stroke(0);
        let temp_x = drawdown_org_x + (x * cell_size); 
        let temp_y = drawdown_org_y + (y * cell_size);
        if (warp_num % 2 === 1) {
          temp_x = y % 2 === 1 ? temp_x + (cell_size / 2) : temp_x;
        }
        // stroke(drawdown_arr[y][x]);
        p.fill(drawdown_arr[y][x]);
        p.rect(temp_x, temp_y, cell_size, cell_size);
      }
    }

  }


  function update_colors() {
  }

  function waveform() {

    for (let n = 0; n < warp_num * osc_scale; n++) {
      let wavepos_x = (n*10) / osc_scale;
      let osc1_mix = p.map(osc_mix, 0.0, 1.0, 1.0, 0.0) * osc1.calc(p, n);
      let osc2_mix = osc_mix * osc2.calc(p, n);

      let wavepos_y  = osc1.calc(p, n) + osc2.calc(p, n);

      let tempVec = p.createVector(wavepos_x, wavepos_y); 
      wave_arr[n] = tempVec;

    }


    warp_arr.forEach((el, index) => {

      let wave_idx = (wave_arr.length / warp_num) * index;
      let  cross_section = wave_arr[wave_idx].y;

      for (let i = 0; i < colors_arr.length; i++) {
        let comp_val = i / colors_arr.length;
        if (cross_section < 1 / colors_arr.length) {
          warp_arr[index] = colors_arr[0]; 
        }
        if (cross_section > comp_val && cross_section < (comp_val * 2)) {
          warp_arr[index] = colors_arr[i]; 
        } 
      }


    });
  }

  //UI callbacks
  p.set_warp = (n) => {
    warp_num = n;
    warp_arr.length = 0;
    for(let n = 0; n < warp_num; n++) {
      warp_arr.push(n);
    }
  }

  p.set_weft = (n) => {
    weft_num = n;
  }

  p.step_fwd = () => {
    if(!playing) {
      osc1.update();
      osc2.update();
    } else {
      playing = false;
    }
  };

  p.step_bck = () => {
    if(!playing) {
      osc1.update_reverse();
      osc2.update_reverse();
    } else {
      playing = false;
    }
  };


  p.update_input = () => {
    osc1_freq = synth_input.osc1_freq;
    osc1_amp = synth_input.osc1_amp;
    osc1_mod_rate = synth_input.osc1_mod_rate;
    osc1_mod_amnt = synth_input.osc1_mod_amnt;
    osc2_freq = synth_input.osc2_freq;
    osc2_amp = synth_input.osc2_amp;
    osc2_mod_rate = synth_input.osc2_mod_rate;
    osc2_mod_amnt = synth_input.osc2_mod_amnt;
    osc_scale = synth_input.osc_scale;
    osc_mix = synth_input.osc_mix;
    osc1_shape = synth_input.osc1_shape;
    osc2_shape = synth_input.osc2_shape;

    osc1.update_param(osc1_freq, osc1_amp, osc1_mod_rate, osc1_mod_amnt, osc1_shape);
    osc2.update_param(osc2_freq, osc2_amp, osc2_mod_rate, osc2_mod_amnt, osc2_shape);
  }

  p.add_color = ( clr) => {
    colors_arr.push(p.color(clr));
  }
  p.delete_color = () => {
    colors_arr.pop();
  }

  p.set_color = (idx, clr) => {
    colors_arr[idx] = p.color(clr);
  }


  //helpers
  function init2dArray(cols, rows) {
    let tempArr = new Array(cols);
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i] = new Array(rows);
    }
    return tempArr;
  }

},

"draft_canvas");

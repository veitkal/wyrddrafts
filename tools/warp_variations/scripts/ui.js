/* UI Interacions */
const ui_page = document.querySelector('.ui_page');
const ui_page_items = document.querySelectorAll('.ui_page div.ui_page__item');
const ui_nav_buttons = document.querySelectorAll('.ui_nav button');
const ui_controls_playpause = document.querySelector('#ui_animation__playpause');

const ui_synth_sliders = document.querySelectorAll('.ui_control__container .control_slider');

const ui_shape_osc1 = document.getElementsByName('osc1_shape__radio');
const ui_shape_osc2 = document.getElementsByName('osc2_shape__radio');

//step buttons
const ui_step_fwd = document.querySelector('#ui_animation__stepfwd');
const ui_step_bck = document.querySelector('#ui_animation__stepbck');



// Touch Variables
let touch_start_x;
let touch_move_x;

const ui_warp_count = document.querySelector('#warp_count_number');
const ui_weft_count = document.querySelector('#weft_count_number');

// colors
const color_select = document.querySelector('.ui_color__select');
const ui_color_add = document.querySelector('#color_button__add');
const ui_color_delete = document.querySelector("#color_button__delete");
let color_select_arr = document.querySelectorAll(".ui_color__select input");

let ui_color_num = color_select_arr.length;



window.addEventListener('load', () => {
color_select_arr.forEach( (el, index) => {
    weave_synth_draft.set_color(index, el.value);

});
}, false);


/* SYNTH */
//play pause button
  ui_controls_playpause.addEventListener('click', () => {
    if(ui_controls_playpause.classList.contains('is_playing')) {
     ui_controls_playpause.classList.remove("is_playing");
     ui_controls_playpause.innerHTML = "Play";
      playing = false;
    } else {
     ui_controls_playpause.classList.add("is_playing");
     ui_controls_playpause.innerHTML = "Pause";
     playing = true;
    }
  
});

// Step buttons
  ui_step_bck.addEventListener('click', () => {
    weave_synth_draft.step_bck();
     ui_controls_playpause.classList.remove("is_playing");
     ui_controls_playpause.innerHTML = "Play";
  });

  ui_step_fwd.addEventListener('click', () => {
    weave_synth_draft.step_fwd();
     ui_controls_playpause.classList.remove("is_playing");
     ui_controls_playpause.innerHTML = "Play";
  });

// Shape Radio buttons 
ui_shape_osc1.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "SIN":
          synth_input.osc1_shape = OSC_SHAPE_SINE;
          break;
        case "SQR":
          synth_input.osc1_shape = OSC_SHAPE_SQUARE;
          break;
        case "TRI":
          synth_input.osc1_shape = OSC_SHAPE_TRIANGLE;
          break;
        case "NOISE":
          synth_input.osc1_shape = OSC_SHAPE_NOISE;
          break;
        default:
          break;
          
      }
      weave_synth_draft.update_input();
    }
  });
});

ui_shape_osc2.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "SIN":
          synth_input.osc2_shape = OSC_SHAPE_SINE;
          break;
        case "SQR":
          synth_input.osc2_shape = OSC_SHAPE_SQUARE;
          break;
        case "TRI":
          synth_input.osc2_shape = OSC_SHAPE_TRIANGLE;
          break;
        case "NOISE":
          synth_input.osc2_shape = OSC_SHAPE_NOISE;
          break;
        default:
          break;
          
      }
      weave_synth_draft.update_input();
    }
  });
});

// Synth Sliders
ui_synth_sliders.forEach((el) => {
  el.addEventListener('change', () => {
    switch(el.id) {
      case 'synth_mixer_slider':
        synth_input.osc_mix = parseFloat(el.value);
        break;
      case 'synth_scale_slider':
        synth_input.osc_scale = parseInt(el.value);
        break;
      case 'synth_freq1_slider':
        synth_input.osc1_freq = parseFloat(el.value);
        break;
      case 'synth_amp1_slider':
        synth_input.osc1_amp = parseFloat(el.value);
        break;
      case 'synth_modrate1_slider':
        synth_input.osc1_mod_rate = parseFloat(el.value);
        break;
      case 'synth_modamnt1_slider':
        synth_input.osc1_mod_amnt = parseFloat(el.value);
        break;
      case 'synth_freq2_slider':
        synth_input.osc2_freq = parseFloat(el.value);
        break;
      case 'synth_amp2_slider':
        synth_input.osc2_amp = parseFloat(el.value);
        break;
      case 'synth_modrate2_slider':
        synth_input.osc2_mod_rate = parseFloat(el.value);
        break;
      case 'synth_modamnt2_slider':
        synth_input.osc2_mod_amnt = parseFloat(el.value);
        break;
      default:
        break;
    }
    weave_synth_draft.update_input();
  });
});


/* SETUP */
ui_warp_count.addEventListener('click', () => {
  weave_synth_draft.set_warp(ui_warp_count.value);
});

ui_weft_count.addEventListener('click', () => {
  weave_synth_draft.set_weft(ui_weft_count.value);
});

ui_warp_count.addEventListener('change', () => {
  weave_synth_draft.set_warp(ui_warp_count.value);
});

ui_weft_count.addEventListener('change', () => {
  weave_synth_draft.set_weft(ui_weft_count.value);
});

/* COLOR */

// Add new colours
ui_color_add.addEventListener('click', () => {
  let clr = document.createElement("INPUT");
  ui_color_num++;
  clr.type = "color";
  clr.id = "clr_" + ui_color_num;
  clr.name = "clr_" + ui_color_num;
  clr.classList.add("ui_color__button");
  color_select.appendChild(clr);

  color_select_arr = document.querySelectorAll(".ui_color__select input");
  ui_color_num = color_select_arr.length;
  console.log(clr.value);
  
  color_select_arr.forEach( (el, index) => {
    el.addEventListener('change', () => {
      weave_synth_draft.set_color(index, el.value);
      console.log(el.value);

    });
  });
  weave_synth_draft.add_color(clr.value);
});

ui_color_delete.addEventListener('click', () => {
  if(color_select.childElementCount > 1) {
    console.log("delete")
    ui_color_num--;
    color_select.removeChild(color_select.lastChild);
    weave_synth_draft.delete_color();
  }
  // color_apply();
}); 

color_select_arr.forEach( (el, index) => {
  el.addEventListener('change', () => {
    weave_synth_draft.set_color(index, el.value);
    console.log(el.value);

  });
});

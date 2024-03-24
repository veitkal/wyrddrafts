/*
 * UI interactions 
 */


/* Variables */

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Fix mobile window height
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
var viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);

//exclude touch keyboard from viewport height on mobile
const canvas_container = document.querySelector('#canvas_container');
const ui_container =  document.getElementById('draft_canvas'); 

// Navigation 
const ui_page_container = document.querySelector('.ui_page__container');
const ui_page = document.querySelector('.ui_page');
const ui_page_items = document.querySelectorAll('.ui_page div.ui_page__item');
const ui_nav_buttons = document.querySelectorAll('.ui_nav button');
const ui_nav_size = ui_page_container.clientWidth;
const ui_todraft = document.querySelector('.ui_todraft__button');
const ui_togenerator = document.querySelector('.ui_togenerator__button');
let ui_page_counter = 1;


ui_todraft.addEventListener('click', () => {
  document.getElementById('draft_canvas').scrollIntoView();
});
ui_togenerator.addEventListener('click', () => {
  document.getElementById('ui_container').scrollIntoView();
});

// Generator
const ui_synth_sliders = document.querySelectorAll('.ui_control__container .control_slider');
const ui_play = document.querySelector('#ui_animation__play');
const ui_pause = document.querySelector('#ui_animation__pause');
const ui_step_fwd = document.querySelector('#ui_animation__stepfwd');
const ui_step_bck = document.querySelector('#ui_animation__stepbck');

const ui_shape_osc1 = document.getElementsByName('osc1_shape__radio');
const ui_shape_osc2 = document.getElementsByName('osc2_shape__radio');

// Pattern
const ui_pattern_target = document.getElementsByName('pattern_target__toggles');
const ui_threading_repeat = document.getElementsByName('threading_repeat__radio');
const ui_threading_expr = document.querySelector('#threading_expr__input');
const ui_threading_expr_button = document.querySelector('#threading_expr__button');
const ui_threading_offset = document.querySelector('#threading_offset__input');
const ui_threading_offset_button = document.querySelector('#threading_offset__button');
const ui_treadling_repeat = document.getElementsByName('treadling_repeat__radio');
const ui_treadling_expr = document.querySelector('#treadling_expr__input');
const ui_treadling_expr_button = document.querySelector('#treadling_expr__button');
const ui_treadling_offset = document.querySelector('#treadling_offset__input');
const ui_treadling_offset_button = document.querySelector('#treadling_offset__button');


const ui_threading_unit_size = document.querySelector('#threading_unit__size');
const ui_threading_unit = document.getElementsByName('threading_unit__radio');
const ui_treadling_unit_size = document.querySelector('#treadling_unit__size');
const ui_treadling_unit = document.getElementsByName('treadling_unit__radio');

// Setup
const ui_warp_count = document.querySelector('#warp_count_number');
const ui_weft_count = document.querySelector('#weft_count_number');
const ui_shaft_count = document.querySelector('#shaft_count_number');
const ui_treadle_count = document.querySelector('#treadle_count_number');
const ui_shed_type = document.getElementsByName('shed_type__radio');

const ui_tieup_generate = document.getElementsByName('tieup_generate__button');
const ui_tieup_expr = document.querySelector('#tieup_expr__input');
const ui_tieup_expr_button = document.querySelector('#tieup_expr__button');
const ui_drawdown_style = document.getElementsByName('drawdown_style__radio');
const ui_draft_scale = document.querySelector('#draft_scale_slider');

// Export
const ui_draft_name = document.getElementById("draft_name__input");
const ui_co_creator = document.getElementById("co_creator__input");
const ui_draft_notes = document.getElementById("draft_notes__input");
const ui_export_target = document.getElementsByName('export_target__radio');
const ui_export_draft_button = document.getElementById("export_draft__button");


// Touch
let touch_start_x;
let touch_move_x;

// Colors
const colors_add = document.querySelector("#colors__add");
const colors_delete = document.querySelector("#colors__delete");
const colors_select = document.querySelector('#colors__select');
let colors_select_arr = document.querySelectorAll("#colors__select input");
let colors_label_arr = document.querySelectorAll("#colors__select label");
let colors_count = colors_select_arr.length;

const warp_color_pattern = document.querySelector('#warp_color_pattern__input');
const warp_color_pattern_button = document.querySelector('#warp_color_pattern__button');

const weft_color_pattern = document.querySelector('#weft_color_pattern__input');
const weft_color_pattern_button = document.querySelector('#weft_color_pattern__button');


// Warp colors
const warp_color_add = document.querySelector("#warp_color__add");
const warp_color_delete = document.querySelector("#warp_color__delete");
const warp_color_select = document.querySelector('#warp_color__select');
let warp_color_select_arr = document.querySelectorAll("#warp_color__select input");
let warp_color_num = warp_color_select_arr.length;

// weft colors
const weft_color_select = document.querySelector('#weft_color__select');
const weft_color_add = document.querySelector('#weft_color__add');
const weft_color_delete = document.querySelector('#weft_color__delete');
let weft_color_select_arr = document.querySelectorAll("#weft_color__select input");
let weft_color_num = weft_color_select_arr.length;

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


window.addEventListener('load', () => {
  weft_color_select_arr.forEach( (el, index) => {
    p5_draft.set_weft_color(index, el.value);
  });
  colors_select_arr.forEach( (el, index) => {
    p5_draft.set_weave_color(index, el.value);
  });
  warp_color_select_arr.forEach( (el, index) => {
    p5_draft.set_warp_color(index, el.value);
  });
  p5_wave_viz.set_canvas_size(document.querySelector(".ui_control__container").offsetWidth / 2 - 20, 100);
  color_apply();

}, false);


// UI Menu Navigation 
// Init nav page position
ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';

// button_next.addEventListener('click', () => {
//   ui_page.style.transition = "transform 0.4s ease-in-out";
//   ui_page_counter = ui_page_counter >= ui_page_items.length - 1 ? ui_page_counter : ui_page_counter+=1;
//   ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
// });

// button_prev.addEventListener('click', () => {
//   ui_page.style.transition = "transform 0.4s ease-in-out";
//   ui_page_counter = ui_page_counter <= 0 ? ui_page_counter : ui_page_counter-=1;
//   ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
// });

// Wrap Around
ui_page.addEventListener('transitionend', () => {

  if (ui_page_items[ui_page_counter].id === 'ui_page__last')  {
    ui_page.style.transition = "none";
    ui_page_counter = ui_page_items.length - 2;
    ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
  }
  if (ui_page_items[ui_page_counter].id === 'ui_page__first')  {
    ui_page.style.transition = "none";
    // ui_page_counter = ui_page_items.length - ui_page_counter;
    ui_page_counter = ui_page_items.length - ui_page_counter;
    ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
  }
  ui_nav_buttons.forEach( (btn) => { 
    btn.classList.remove("active");
  });
  ui_nav_buttons[ui_page_counter - 1].classList.add("active");
});

// Touch Control
// ui_page.addEventListener('touchstart', (e) => {
//   touch_start_x = e.touches[0].clientX;
//   console.log(touch_start_x);
// });

// ui_page.addEventListener('touchmove', (e) => {
//   touch_move_x = e.touches[0].clientX;
//   console.log(touch_move_x);
// });

// ui_page.addEventListener('touchend', () => {
//   if (touch_start_x +100 < touch_move_x) {
//     ui_page.style.transition = "transform 0.4s ease-in-out";
//     ui_page_counter = ui_page_counter <= 0 ? ui_page_counter : ui_page_counter-=1;
//     ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
//     console.log('right');
//   }
//   if (touch_start_x -100 > touch_move_x) {
//     ui_page.style.transition = "transform 0.4s ease-in-out";
//     ui_page_counter = ui_page_counter >= ui_page_items.length - 1 ? ui_page_counter : ui_page_counter+=1;
//     ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter) + 'px)';
//     console.log('left');
//   }
// });

// Nav Button Control
ui_nav_buttons.forEach( (el, idx) => { 
  el.addEventListener('click', () => {
    ui_page_counter = idx+1; 

    //slide navigation page
    ui_page.style.transition = "transform 0.4s ease-in-out";
    ui_page.style.transform = 'translateX(' + (-ui_nav_size * ui_page_counter )  + 'px)';

    //make selected active
    ui_nav_buttons.forEach( (btn) => { 
      btn.classList.remove("active");
    });
    el.classList.add("active");
  });
});

/* SYNTH */

canvas_container.addEventListener('click', () => {
  if(!playing) {
    ui_play.classList.add("is_playing");
    ui_pause.classList.remove("is_playing");
    playing = true;
  } else {
    ui_pause.classList.add("is_playing");
    ui_play.classList.remove("is_playing");
    playing = false;
  }
});

ui_play.addEventListener('click', () => {
  ui_play.classList.add("is_playing");
  ui_pause.classList.remove("is_playing");
  playing = true;
});

ui_pause.addEventListener('click', () => {
  ui_pause.classList.add("is_playing");
  ui_play.classList.remove("is_playing");
  playing = false;
});

// Step buttons
ui_step_bck.addEventListener('click', () => {
  p5_draft.step_bck();
  ui_pause.classList.add("is_playing");
  ui_play.classList.remove("is_playing");
});

ui_step_fwd.addEventListener('click', () => {
  p5_draft.step_fwd();
  ui_pause.classList.add("is_playing");
  ui_play.classList.remove("is_playing");
});

// Shape Radio butto
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
      p5_draft.update_input();
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
      p5_draft.update_input();
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
    p5_draft.update_input();
  });
});

/* PATTERN */


// Threading unit size
ui_threading_unit_size.addEventListener('change', () => {
  let temp_val = ui_threading_unit_size.value;
  let is_num = temp_val.match(/\d/g); // Only read digits
  if(is_num) {
    app_settings.pattern_unit.threading_size = ui_threading_unit_size.value;
  } else {
    return;
  }
  pattern_grid_resize(threading_pattern_grid, "THREADING");
});

// Trewadling unit size
ui_treadling_unit_size.addEventListener('change', () => {
  let temp_val = ui_treadling_unit_size.value;
  let is_num = temp_val.match(/\d/g); // Only read digits
  if(is_num) {
    app_settings.pattern_unit.treadling_size = ui_treadling_unit_size.value;
  } else {
    return;
  }
  pattern_grid_resize(treadling_pattern_grid, "TREADLING");
});

// Threading Unit Radio buttons 
ui_threading_unit.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "GENERATOR":
          app_settings.pattern_unit.threading_type = "GENERATOR";
          break;
        case "STRAIGHT":
          app_settings.pattern_unit.threading_type = "STRAIGHT";
          break;
        case "DRAW":
          app_settings.pattern_unit.threading_type = "DRAW";
          break;
        default:
          break;

      }
      p5_draft.update_input();
    }
  });
});

// Threading Unit Radio buttons 
ui_treadling_unit.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "GENERATOR":
          app_settings.pattern_unit.treadling_type = "GENERATOR";
          break;
        case "STRAIGHT":
          app_settings.pattern_unit.treadling_type = "STRAIGHT";
          break;
        case "DRAW":
          app_settings.pattern_unit.treadling_type = "DRAW";
          break;
        default:
          break;

      }
      p5_draft.update_input();
    }
  });
});


// Pattern Grid
pattern_grid_create = function(_target) {
  let grid = document.createElement("div");
  let sz = 13;
  let x_count;
  let y_count;
  let grid_width;
  let grid_height;
  let cell_num;

  switch(_target) {
    case "THREADING":
      x_count = app_settings.pattern_unit.threading_size;
      y_count = app_settings.shaft_count;
      grid_width = x_count * sz;
      grid_height = y_count * sz;

      grid.classList.add("pattern_grid");
      grid.style.width = grid_width+"px";
      grid.style.height = grid_height+"px";

      cell_num = 0;
      for(let x = 0; x < x_count; x++) {
        for(let y = 0; y < y_count; y++) {
          let cell = document.createElement("div");
          cell.classList.add("pattern_grid__cell");
          cell.setAttribute('id', 'pattern_cell'+cell_num);
          cell.style.gridRowStart = (y_count - y); //Reverse order inside columns
          cell.style.gridColumnStart = (x_count - x); //Reverse order inside rows
          cell.style.width = sz+"px";
          cell.style.height = sz+"px";
          grid.appendChild(cell);
          cell_num++;

        }
      }
      break;
    case "TREADLING":
      x_count = app_settings.pattern_unit.treadling_size;
      y_count = app_settings.treadle_count;
      grid_width = x_count * sz;
      grid_height = y_count * sz;

      grid.classList.add("pattern_grid");
      grid.style.width = grid_width+"px";
      grid.style.height = grid_height+"px";

      cell_num = 0;
      for(let x = 0; x < x_count; x++) {
        for(let y = 0; y < y_count; y++) {
          let cell = document.createElement("div");
          cell.classList.add("pattern_grid__cell");
          cell.setAttribute('id', 'pattern_cell'+cell_num);
          //TODO Decide how to render ie up/down/left/right
          cell.style.width = sz+"px";
          cell.style.height = sz+"px";
          grid.appendChild(cell);
          cell_num++;

        }
      }
      break;
    default:
      break;

  }

  return grid;
}

pattern_grid_resize = function(grid, _target) {
  let x_count;
  let y_count;
  let sz;
  let grid_width;
  let grid_height;


  grid.querySelectorAll(".pattern_grid__cell").forEach((e) => {
    e.remove();
  });

  let cell_num = 0;

  switch (_target){
    case "THREADING":
      x_count = app_settings.pattern_unit.threading_size;
      y_count = app_settings.shaft_count;
      sz = 13;
      grid_width = x_count * sz;
      grid_height = y_count * sz;
      grid.style.width = grid_width+"px";
      grid.style.height = grid_height+"px";

      for(let x = 0; x < x_count; x++) {
        for(let y = 0; y < y_count; y++) {
          let cell = document.createElement("div");
          cell.classList.add("pattern_grid__cell");
          cell.setAttribute('id', 'pattern_cell'+cell_num);
          cell.style.gridRowStart = (y_count - y); //Reverse order inside columns
          cell.style.gridColumnStart = (x_count - x); //Reverse order inside rows
          cell.style.width = sz+"px";
          cell.style.height = sz+"px";
          grid.appendChild(cell);
          cell_num++;
        }
      }

      threading_pattern_cells = grid.querySelectorAll(".pattern_grid__cell");
      threading_pattern_cells.forEach((el, idx) => {
        el.addEventListener('click', () => {
          app_settings.pattern_unit.threading_type = "DRAW";
          document.getElementById('threading_unit__draw').checked = true
          p5_draft.pattern_draw(idx, "THREADING");
        });
      });

      break;
    case "TREADLING":
      x_count = app_settings.pattern_unit.treadling_size;
      y_count = app_settings.treadle_count;
      sz = 13;
      grid_width = x_count * sz;
      grid_height = y_count * sz;
      grid.style.width = grid_width+"px";
      grid.style.height = grid_height+"px";
      for(let x = 0; x < x_count; x++) {
        for(let y = 0; y < y_count; y++) {
          let cell = document.createElement("div");
          cell.classList.add("pattern_grid__cell");
          cell.setAttribute('id', 'pattern_cell'+cell_num);
          cell.style.gridRowStart = (y_count - y); //Reverse order inside columns
          cell.style.gridColumnStart = (x_count - x); //Reverse order inside rows
          cell.style.width = sz+"px";
          cell.style.height = sz+"px";
          grid.appendChild(cell);
          cell_num++;
        }
      }

      treadling_pattern_cells = grid.querySelectorAll(".pattern_grid__cell");
      treadling_pattern_cells.forEach((el, idx) => {
        el.addEventListener('click', () => {
          app_settings.pattern_unit.treadling_type = "DRAW";
          document.getElementById('treadling_unit__draw').checked = true
          p5_draft.pattern_draw(idx, "TREADLING");
        });
      });

      break;
    default:
      break;
  }
}

// Update the cells in grid from app.js
pattern_grid_update = function(_target) {
  let x;
  let y;

  switch(_target) {
    case "THREADING":
      threading_pattern_cells.forEach((el,idx) => {
        el.classList.remove("selected");
        x = Math.floor(idx / app_settings.shaft_count)
        y = idx % app_settings.shaft_count;
        if (app_settings.pattern_unit.threading[x] === y) {
          el.classList.add("selected");
        }
      });
      break;
    case "TREADLING":
      treadling_pattern_cells.forEach((el,idx) => {
        el.classList.remove("selected");
        x = Math.floor(idx / app_settings.treadle_count)
        y = idx % app_settings.treadle_count;

        if (app_settings.pattern_unit.treadling[x] === y) {
          el.classList.add("selected");
        }
      });
      break;
    default:
      break;
  }

}

const threading_pattern_container = document.getElementById("threading_pattern__grid");
const threading_pattern_grid = pattern_grid_create("THREADING");
threading_pattern_container.appendChild(threading_pattern_grid);
let threading_pattern_cells = threading_pattern_grid.querySelectorAll(".pattern_grid__cell");

const treadling_pattern_container = document.getElementById("treadling_pattern__grid");
const treadling_pattern_grid = pattern_grid_create("TREADLING");
treadling_pattern_container.appendChild(treadling_pattern_grid);
let treadling_pattern_cells = treadling_pattern_grid.querySelectorAll(".pattern_grid__cell");

threading_pattern_cells.forEach((el, idx) => {
  el.addEventListener('click', () => {
    app_settings.pattern_unit.threading_type = "DRAW";
    document.getElementById('threading_unit__draw').checked = true
    p5_draft.pattern_draw(idx, "THREADING");

  });
});

treadling_pattern_cells.forEach((el, idx) => {
  el.addEventListener('click', () => {
    app_settings.pattern_unit.treadling_type = "DRAW";
    document.getElementById('treadling_unit__draw').checked = true
    p5_draft.pattern_draw(idx, "TREADLING");

  });
});


// Threading Repeat Radio buttons 
ui_threading_repeat.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "STRAIGHT":
          app_settings.pattern_repeat.threading = "////";
          break;
        case "POINT":
          app_settings.pattern_repeat.threading = "/\\/\\";
          break;
        case "ALTERNATE":
          app_settings.pattern_repeat.threading = "//\\\\"
          break;
        case "EXPR":
          app_settings.pattern_repeat.threading = ui_threading_expr.value;
          break;
        default:
          break;

      }
      p5_draft.update_input();
    }
  });
});

ui_threading_expr_button.addEventListener('click', () => {
  app_settings.pattern_repeat.threading = ui_threading_expr.value;
  document.querySelector('#threading_repeat__expr').checked = true;
});

ui_threading_expr.addEventListener('change', () => {
  app_settings.pattern_repeat.threading = ui_threading_expr.value;
});

ui_threading_expr.addEventListener('click', () => {
  document.querySelector('#threading_repeat__expr').checked = true;
});

// Threading Offset
ui_threading_offset_button.addEventListener('click', () => {
  app_settings.pattern_unit.threading_offset = ui_threading_offset.value;
  // console.log(app_settings.pattern_repeat.threading_offset)
});

ui_threading_offset.addEventListener('change', () => {
  app_settings.pattern_unit.threading_offset = ui_threading_offset.value;
});

// Treadlling Repeat Radio buttons 
ui_treadling_repeat.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "STRAIGHT":
          app_settings.pattern_repeat.treadling = "////";
          break;
        case "POINT":
          app_settings.pattern_repeat.treadling = "/\\/\\";
          break;
        case "ALTERNATE":
          app_settings.pattern_repeat.treadling = "//\\\\"
          break;
        case "EXPR":
          app_settings.pattern_repeat.treadling = ui_treadling_expr.value;
          break;
        default:
          break;

      }
      p5_draft.update_input();
    }
  });
});

ui_treadling_expr_button.addEventListener('click', () => {
  app_settings.pattern_repeat.treadling = ui_treadling_expr.value;
  document.querySelector('#treadling_repeat__expr').checked = true;
});

ui_treadling_expr.addEventListener('change', () => {
  app_settings.pattern_repeat.treadling = ui_treadling_expr.value;
});

ui_treadling_expr.addEventListener('click', () => {
  document.querySelector('#treadling_repeat__expr').checked = true;
});

// Threading Offset
ui_treadling_offset_button.addEventListener('click', () => {
  app_settings.pattern_unit.treadling_offset = ui_treadling_offset.value;
  // console.log(app_settings.pattern_repeat.threading_offset)
});

ui_treadling_offset.addEventListener('change', () => {
  app_settings.pattern_unit.treadling_offset = ui_treadling_offset.value;
});

/* SETUP */
ui_warp_count.addEventListener('change', () => {
  let temp_val = ui_warp_count.value;
  let is_num = temp_val.match(/\d/g);
  if(is_num) {
    app_settings.warp_count = parseInt(temp_val);
  } else {
    return;
  }

  p5_draft.update_input();
  p5_draft.scaletofit_cell_size();
});

ui_weft_count.addEventListener('change', () => {
  let temp_val = ui_weft_count.value;
  let is_num = temp_val.match(/\d/g);
  if(is_num) {
    app_settings.weft_count = parseInt(temp_val);
  } else {
    return;
  }
  p5_draft.update_input();
  p5_draft.scaletofit_cell_size();
});

ui_shaft_count.addEventListener('change', () => {
  let temp_val = ui_shaft_count.value;
  let is_num = temp_val.match(/\d/g);
  if(is_num) {
    app_settings.shaft_count = parseInt(temp_val);
  } else {
    return;
  }
  pattern_grid_resize(threading_pattern_grid, "THREADING");
  pattern_grid_resize(treadling_pattern_grid, "TREADLING");
  p5_draft.update_input();
  tieup_grid_update();
  p5_draft.scaletofit_cell_size();
});

ui_treadle_count.addEventListener('change', () => {
  let temp_val = ui_treadle_count.value;
  let is_num = temp_val.match(/\d/g);
  if(is_num) {
    app_settings.treadle_count = parseInt(temp_val);
  } else {
    return;
  }
  pattern_grid_resize(threading_pattern_grid, "THREADING");
  pattern_grid_resize(treadling_pattern_grid, "TREADLING");
  p5_draft.update_input();
  tieup_grid_update();
  p5_draft.scaletofit_cell_size();
});

ui_shed_type.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "SINKING":
          app_settings.isRising = false;
          break;
        case "RISING":
          app_settings.isRising = true;
          break;
        default:
          break;
      }
    }
  });
});

draft_scale_slider.addEventListener('change', () => {
  app_settings.cell_size = parseInt(draft_scale_slider.value, 10);
  p5_draft.update_input();
  console.log(draft_scale_slider.value)
});

ui_drawdown_style.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "SIMPLE":
          app_settings.drawdown_style = "SIMPLE"
          break;
        case "GRID":
          app_settings.drawdown_style = "GRID"
          break;
        case "STRUCTURE":
          app_settings.drawdown_style = "STRUCTURE"
          break;
        default:
          break;
      }
    }
  });
});

// Tie-Up  generate buttons 
ui_tieup_generate.forEach( (el) => {
  el.addEventListener('click', () => {
    switch(el.value) {
      case "TABBY":
        p5_draft.tieup_generate_tabby();
        break;
      case "STRAIGHT":
        p5_draft.tieup_generate_straight();
        break;
      case "BATAVIA":
        p5_draft.tieup_generate_batavia();
        break;
      case "EXPR":
        let tieup_expression =  ui_tieup_expr.value.replace(/\D/g,'');
        p5_draft.tieup_generate_expr(tieup_expression);
        break;
      default:
        break;

    }
    let cell_num = 0;
    for(let x = 0; x < app_settings.treadle_count; x++) {
      for(let y = 0; y < app_settings.shaft_count; y++) {
        if(p5_draft.get_tieup()[x][y] === 1) {
          tieup_grid_cells[cell_num].classList.add("selected");
        } else {
          tieup_grid_cells[cell_num].classList.remove("selected");
        }
        cell_num++;
      }
    }
    p5_draft.update_input();
  });
});


ui_tieup_expr_button.addEventListener('click', () => {
  let tieup_expression =  ui_tieup_expr.value.replace(/\D/g,'');
  p5_draft.tieup_generate_expr(tieup_expression);

  let cell_num = 0;
  for(let x = 0; x < app_settings.treadle_count; x++) {
    for(let y = 0; y < app_settings.shaft_count; y++) {
      if(p5_draft.get_tieup()[x][y] === 1) {
        tieup_grid_cells[cell_num].classList.add("selected");
      } else {
        tieup_grid_cells[cell_num].classList.remove("selected");
      }
      cell_num++;
    }
  }

});

ui_tieup_expr.addEventListener('change', () => {
  let tieup_expression =  ui_tieup_expr.value.replace(/\D/g,'');
  p5_draft.tieup_generate_expr(tieup_expression);

  let cell_num = 0;
  for(let x = 0; x < app_settings.treadle_count; x++) {
    for(let y = 0; y < app_settings.shaft_count; y++) {
      if(p5_draft.get_tieup()[x][y] === 1) {
        tieup_grid_cells[cell_num].classList.add("selected");
      } else {
        tieup_grid_cells[cell_num].classList.remove("selected");
      }
      cell_num++;
    }
  }

});


// Tie-Up grid functions
tieup_grid_create = function() {
  let grid = document.createElement("div");
  let x_count = app_settings.treadle_count;
  let y_count = app_settings.shaft_count;
  let sz = 30;
  let grid_width = x_count * sz;
  let grid_height = y_count * sz;

  grid.classList.add("tieup_grid");
  grid.style.width = grid_width+"px";
  grid.style.height = grid_height+"px";
  grid.style.setProperty('grid-template-rows', `repeat(${y_count}, 1fr)`);
  // grid.style.background = "white";

  let cell_num = 0;
  for(let x = 0; x < x_count; x++) {
    for(let y = 0; y < y_count; y++) {
      let cell = document.createElement("div");
      cell.classList.add("tieup_grid__cell");
      cell.setAttribute('id', 'tieup_cell'+cell_num);
      cell.style.gridRowStart = (y_count - y); //Reverse order inside columns
      cell.innerHTML = cell_num;
      grid.appendChild(cell);
      cell_num++;

    }
  }

  return grid;
}

tieup_grid_update = function() {
  let x_count = p5_draft.get_tieup().length;
  let y_count = p5_draft.get_tieup()[0].length;
  let sz = 20;
  let grid_width = x_count * sz;
  let grid_height = y_count * sz;

  ui_tieup_grid.style.width = grid_width+"px";
  ui_tieup_grid .style.height = grid_height+"px";
  ui_tieup_grid.style.setProperty('grid-template-rows', `repeat(${y_count}, 1fr)`);
  document.querySelectorAll(".tieup_grid__cell").forEach((e) => {
    e.remove();
  });

  let cell_num = 0;

  for(let x = 0; x < x_count; x++) {
    for(let y = 0; y < y_count; y++) {
      let cell = document.createElement("div");
      cell.classList.add("tieup_grid__cell");
      cell.setAttribute('id', 'tieup_cell'+cell_num);
      cell.style.gridRowStart = (y_count - y); //Reverse order inside columns
      ui_tieup_grid.appendChild(cell);
      // check the tieup array add class to cells
      if(p5_draft.get_tieup()[x][y] === 1) {
        tieup_grid_cells[cell_num].classList.add("selected");
      }
      cell_num++;
    }
  }

  tieup_grid_cells = document.getElementsByClassName("tieup_grid__cell");
  tieup_grid_cells.forEach((el, idx) => {
    el.addEventListener('click', () => {
      if(el.classList.contains("selected")) {
        p5_draft.set_tieup(idx,0);
        el.classList.remove("selected");
      } else {
        p5_draft.set_tieup(idx,1);
        el.classList.add("selected");
      }

    });
  });

}

const tieup_container = document.getElementById("ui_tieup__grid");
const ui_tieup_grid = tieup_grid_create();
tieup_container.appendChild(ui_tieup_grid);
let tieup_grid_cells = document.getElementsByClassName("tieup_grid__cell");

tieup_grid_cells.forEach((el, idx) => {
  el.addEventListener('click', () => {

    if(el.classList.contains("selected")) {
      p5_draft.set_tieup(idx,0);
      el.classList.remove("selected");
    } else {
      p5_draft.set_tieup(idx,1);
      el.classList.add("selected");
    }

  });
});

/* COLOR */

// Add new colours
colors_add.addEventListener('click', () => {
  let container_div = document.createElement("DIV");
  container_div.classList.add("ui_color__input");
  colors_select.appendChild(container_div);
  let color_label = document.createElement("LABEL");
  color_label.classList.add("ui_color__label");
  container_div.appendChild(color_label);

  let clr = document.createElement("INPUT");
  colors_count++;
  clr.type = "color";
  clr.id = "clr_" + colors_count;
  clr.name = "clr_" + colors_count;
  clr.classList.add("ui_color__button");
  container_div.appendChild(clr);

  color_label.htmlFor = clr.id;
  color_label.innerHTML = alphabet[colors_count-1];

  colors_select_arr = document.querySelectorAll("#colors__select input");
  colors_count = colors_select_arr.length;
  console.log(clr.value);

  colors_select_arr = document.querySelectorAll("#colors__select input");
  colors_select_arr.forEach( (el, index) => {
    el.addEventListener('change', () => {
      p5_draft.set_weave_color(index, el.value); 
      color_apply();
      console.log(el.value);
    });
  });
  p5_draft.add_weave_color(clr.value);
  color_apply();
});

// Delete colours 
colors_delete.addEventListener('click', () => {
  if(colors_select.childElementCount > 1) {
    colors_count--;
    colors_select.removeChild(colors_select.lastChild);
    colors_select;
    p5_draft.delete_weave_color();
  }
  color_apply();
}); 


// Change colours
colors_select_arr.forEach( (el, index) => {
  el.addEventListener('change', () => {
    p5_draft.set_weave_color(index, el.value);
    color_apply();
    console.log(el.value);
  });
});

//warp color pattern expression
warp_color_pattern_button.addEventListener('click', () => {
  color_apply();
});

warp_color_pattern.addEventListener('change', () => {
  color_apply();
});

//weft color pattern expression
weft_color_pattern_button.addEventListener('click', () => {
  color_apply();
});

weft_color_pattern.addEventListener('change', () => {
  color_apply();
});

// Read and convert current color expression and apply as pattern
function color_apply() {
  let temp_weft_pattern =  weft_color_pattern.value.replace(/[^a-zA-Z0-9]/g,''); // Filter out letters and numbers
  temp_weft_pattern = temp_weft_pattern.toUpperCase();
  p5_draft.generate_color_pattern(temp_weft_pattern, "WEFT");

  let temp_warp_pattern =  warp_color_pattern.value.replace(/[^a-zA-Z0-9]/g,''); // Filter out letters and numbers
  temp_warp_pattern = temp_warp_pattern.toUpperCase();
  p5_draft.generate_color_pattern(temp_warp_pattern, "WARP");
}

/* EXPORT */
ui_draft_name.addEventListener('change', () => {
  app_settings.draft_name = ui_draft_name.value;
});

ui_co_creator.addEventListener('change', () => {
  app_settings.co_creator = ui_co_creator.value;
});

ui_draft_notes.addEventListener('change', () => {
  app_settings.draft_notes = ui_draft_notes.value;
});

ui_export_target.forEach( (el) => {
  el.addEventListener('click', () => {
    if (el.checked) {
      switch(el.value) {
        case "FULL":
          app_settings.export_options = "FULL"
          break;
        case "SIMPLE":
          app_settings.export_options = "SIMPLE"
          break;
        case "DRAWDOWN":
          app_settings.export_options = "DRAWDOWN"
          break;
        default:
          break;
      }
    }
  });
});

ui_export_draft_button.addEventListener('click', () => {
  app_settings.draft_name = ui_draft_name.value;
  app_settings.co_creator = ui_co_creator.value;
  app_settings.draft_notes = ui_draft_notes.value;
  p5_draft.export_draft();
});

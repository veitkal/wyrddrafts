
/* INFO
 * 
 * Early stages of an application meant to help creating experimental weaving drafts using generative techniques.
 * 
 *
 */

//==================================================
// Global Variables 
var styling;
var playing = true;

var app_settings = {
  canvas_width: 0,
  canvas_height: 0,
  cell_size: 10,
  co_creator: "Your Name",
  draft_name: "wyrd_draft",
  draft_notes: "",
  drawdown_style: "SIMPLE",
  export_options: "FULL",
  isRising: false,
  pattern_target: { threading : true, treadling : false },  //remove
  pattern_unit: { 
    threading : [], 
    threading_type : "GENERATOR",
    threading_size : 10,
    treadling : [],
    treadling_type : "STRAIGHT",
    treadling_size : 4
  },
  pattern_repeat: { 
    threading : "/", 
    treadling : "/",
  },

  shaft_count: 4,
  treadle_count: 4,
  warp_count: 50,
  weft_count: 50,
  text_size: {
    heading: 60,
    regular: 24,
    small: 18,
  },
}

var synth_input = {
  osc1_freq: 10,
  osc1_amp: 1,
  osc1_mod_rate: 0.001,
  osc1_mod_amnt: 0,
  osc2_mod_rate: 0.001,
  osc2_mod_amnt: 0,
  osc2_freq: 10,
  osc2_amp: 1,
  osc_scale: 6,
  osc_mix: 0.5,
  osc1_shape: OSC_SHAPE_SINE,
  osc2_shape: OSC_SHAPE_SINE,
}


let p5_draft = new p5(function (p) {
'use strict'

  //canvas variables
  let canvas_div = document.getElementById("draft_canvas");
  app_settings.canvas_width = canvas_div.offsetWidth;
  app_settings.canvas_height = canvas_div.offsetHeight;


  styling = {
    bg: p.color(255),
    fg: p.color(0),
  }

  let weave_colors = [];
  let warp_colors = [];
  let weft_colors = [];

  let loom;
  let draft;
  let wave;

  let export_font;

  //==================================================
  //Setup
  p.setup = () => {
    p.createCanvas(app_settings.canvas_width,app_settings.canvas_height);
    loom = new Loom(p);
    loom.init();
    draft = new Draft(p, loom);
    loom.calc_drawdown();
    wave = new Wave(p, 100, 100);
    tieup_grid_update();
    export_font = p.loadFont('../../assets/Hack-Regular.ttf');
    wave.update_oscillators();

  };

  //==================================================
  //Draw
  p.draw = () => {

    p.translate(20,20);
    p.background(styling.bg);
    p.noFill();
    p.stroke(0);
    draft.display();
    if(playing){
      wave.update_oscillators();
    }
    wave.update();
    p5_wave_viz.set_wave(wave.get_wave());

    loom.update_threading(repp("THREADING"));
    loom.update_treadling(repp("TREADLING"));

    loom.calc_drawdown();
  };


  //==================================================
  // Repeat a sample over threading or treadling
  function repp(_target) {
    let rep = [];
    let sample = [];
    let expr;
    let delete_last_threaad;

    // Select which part of the draft to assign the pattern to
    switch(_target) {
      case "THREADING":
        expr = app_settings.pattern_repeat.threading;
        rep.length = app_settings.warp_count;
        app_settings.pattern_unit.threading.length = app_settings.pattern_unit.threading_size;

        if(app_settings.pattern_unit.threading_type === "GENERATOR") {
          // Get a wave sample
          sample = wave.get_sample("THREADING", app_settings.pattern_unit.threading_size);

          app_settings.pattern_unit.threading = sample;
        } else if(app_settings.pattern_unit.threading_type === "STRAIGHT") {
          // Create a simple straight pattern
          for(let i = 0; i < app_settings.pattern_unit.threading_size; i++) {
            sample[i] = i % app_settings.shaft_count;
          }
          app_settings.pattern_unit.threading = sample;
        } else if(app_settings.pattern_unit.threading_type === "DRAW") {
          sample = app_settings.pattern_unit.threading;
        }
        pattern_grid_update("THREADING");

        break;
      case "TREADLING":
        expr = app_settings.pattern_repeat.treadling;
        rep.length = app_settings.weft_count;
        app_settings.pattern_unit.treadling.length = app_settings.pattern_unit.treadling_size;

        if(app_settings.pattern_unit.treadling_type === "GENERATOR") {
          sample = wave.get_sample("TREADLING", app_settings.pattern_unit.treadling_size);

          app_settings.pattern_unit.treadling = sample;
        } else if(app_settings.pattern_unit.treadling_type === "STRAIGHT") {
          // Create a simple straight pattern
          for(let i = 0; i < app_settings.pattern_unit.treadling_size; i++) {
            sample[i] = i % app_settings.treadle_count;
          }
          app_settings.pattern_unit.treadling = sample;
        } else if(app_settings.pattern_unit.treadling_type === "DRAW") {
          sample = app_settings.pattern_unit.treadling;
        }
        pattern_grid_update("TREADLING");

        break;
      default:
        break;
    }

    let reverse_sample = [...sample].reverse();
    let straight_sample = [...sample];
    let new_sample =  [];

    if(expr.length > 0) {
      for(let i = 0; i < expr.length; i++) {
        if(expr[i] === "/") {
          new_sample.push(...straight_sample);
        }
        if(expr[i] === "\\") {
          new_sample.push(...reverse_sample);
        }
      }
    }


    for(let i = 0; i < rep.length; i++) {
      rep[i] = new_sample[(i) % new_sample.length];
    }

    return(rep);
  }

  //==================================================
  // Window size and scaling
  p.windowResized = () => {
    app_settings.canvas_width = canvas_div.offsetWidth;
    app_settings.canvas_height = canvas_div.offsetHeight;
    p.resizeCanvas(app_settings.canvas_width, app_settings.canvas_height);
    p.scaletofit_cell_size();
  }

  p.update_input = () => {
    wave.update_oscillators();
    loom.update_settings();
    draft.init();
  }

  p.scaletofit_cell_size = () => {
    app_settings.cell_size = draft.calc_cell_size();
    draft.init();
  }

  p.scale_cell_size = (factor) => {
    app_settings.cell_size *= factor;
    draft.init();

  }

  //==================================================
  // Player
  p.step_fwd = () => {
    if(!playing) {
      wave.update_oscillators();
    } else {
      playing = false;
    }
  };

  p.step_bck = () => {
    if(!playing) {
      wave.update_oscillators_reverse();
    } else {
      playing = false;
    }
  };

  //==================================================
  // Tie Up functions
  p.get_tieup = () => {
    return(loom.tieup);
  }

  p.set_tieup = (_idx, _selected) => {
    let x = Math.floor(_idx / app_settings.shaft_count);
    let y = _idx % app_settings.shaft_count;
    loom.tieup[x][y] = _selected;
  }

  // Generate Tie-up Setps
  p.tieup_generate_tabby = () => {
    for(let i = 0; i < app_settings.treadle_count; i++) {
      for(let j = 0; j < app_settings.shaft_count; j ++) {
        loom.tieup[i][j] = (i + j) % 2 === 0 ? 1 : 0; 
      }
    }
  }

  p.tieup_generate_straight = () => {
    for(let i = 0; i < app_settings.treadle_count; i++) {
      for(let j = 0; j < app_settings.shaft_count; j ++) {
        loom.tieup[i][j] = i % app_settings.shaft_count === j % app_settings.treadle_count ? 1 : 0; 
      }
    }
  }

  p.tieup_generate_batavia = () => {
    let arr = [app_settings.shaft_count / 2, app_settings.shaft_count / 2];
    let temp_arr = [];
    for (let i = 0; i < arr.length; i++) {
      for(let j = 0; j < arr[i]; j++) {
        let temp_val = i % 2 === 0 ? 1 : 0;
        temp_arr.push(temp_val);
      }
    }

    for(let i = 0; i < app_settings.treadle_count; i++) {
      for(let j = 0; j < app_settings.shaft_count; j ++) {
        loom.tieup[i][j] = temp_arr[(temp_arr.length-i+j) % temp_arr.length]; 
      }
    }

  }

  p.tieup_generate_random = () => {
    for(let i = 0; i < app_settings.treadle_count; i++) {
      for(let j = 0; j < app_settings.shaft_count; j ++) {
        loom.tieup[i][j] = Math.random(1) > 0.5 ? 1 : 0; 
      }
    }
  }

  p.tieup_generate_expr = (_str) => {
    //todo reverse 
    let temp_arr = [];
    for (let i = 0; i < _str.length; i++) {
      for(let j = 0; j < _str[i]; j++) {
        let temp_val = i % 2 === 0 ? 1 : 0;
        temp_arr.push(temp_val);
      }
    }

    for(let i = 0; i < app_settings.treadle_count; i++) {
      for(let j = 0; j < app_settings.shaft_count; j ++) {
        loom.tieup[i][j] = temp_arr[(i+j) % temp_arr.length]; 
      }
    }

  }


  //==================================================
  // Draw pattern
  p.pattern_draw = (_idx, _target) => {
    let x;
    let y;
    switch(_target) {
      case "THREADING":
        x = Math.floor(_idx / app_settings.shaft_count);
        y = _idx % app_settings.shaft_count;
        app_settings.pattern_unit.threading[x] = y;
        break;
      case "TREADLING":
        x = Math.floor(_idx / app_settings.treadle_count);
        y = _idx % app_settings.treadle_count;
        app_settings.pattern_unit.treadling[x] = y;
        break;
      default:
        break;
    }


  }


  //Color functions
  //==================================================
  p.add_weave_color = (clr) => {
    weave_colors.push(p.color(clr));
    // colors_assign_repeat("warp");
  }

  p.delete_weave_color = () => {
    if(weave_colors.length > 1) {
      weave_colors.pop();
    }
  }

  p.set_weave_color = (idx, clr) => {
    weave_colors[idx] = p.color(clr);
    // colors_assign_repeat("warp");
  }

  p.generate_color_pattern = (_str, _target) => {
    // Generate a color_pattern from incoming string of chars and numbers. Numbers multiply following chars(color index)
    let temp_pattern = [];
    let multiplyer = 0;
    let index;

    for(let i = 0; i < _str.length; i++) {

      // Check if char is a number
      if (!isNaN(_str[i])) {
        let prev_multi = 0;
        // check if not first number in a row (ie get multiple digit number or numbers higher then 9);
        if(multiplyer > 0) {
          prev_multi = parseInt(multiplyer) * 10; // Multiply previous value with 10
        }
        multiplyer = parseInt(prev_multi) + parseInt(_str[i]); // Add both values together

      } else  {
        if (multiplyer > 0) {
          for (let m = 0; m < multiplyer; m++) {
            index = alphabet.indexOf(_str[i]);
            if(index < weave_colors.length) {
              temp_pattern.push(weave_colors[index]);
            } 
          }
          multiplyer = 0;;
        } else {
          index = alphabet.indexOf(_str[i]);
          if(index < weave_colors.length) {
            temp_pattern.push(weave_colors[index]);
          } 
        }

      }
    }

    if(temp_pattern.length < 1) {
      temp_pattern.push(weave_colors[0]);
    }

    switch(_target) {
      case "WARP":
        warp_colors = temp_pattern;
        colors_assign_repeat("warp");
        break;
      case "WEFT":
        weft_colors = temp_pattern;
        colors_assign_repeat("weft");
        break;
    }
  }

  // Repeat colors across warp/weft
  function colors_assign_repeat(_target) {

    if (_target === "warp") {
      let warp_colors_repeat = new Array(app_settings.warp_count);

      for(let i = 0; i < warp_colors_repeat.length; i++) {
        warp_colors_repeat[i] = warp_colors[i % warp_colors.length];
      }

      loom.update_warp_colors(warp_colors_repeat);
    }

    if (_target === "weft") {
      let weft_colors_repeat = new Array(app_settings.weft_count);

      for(let i = 0; i < weft_colors_repeat.length; i++) {
        weft_colors_repeat[i] = weft_colors[i % weft_colors.length];
      }

      loom.update_weft_colors(weft_colors_repeat);
    }
  }

  // EXPORT
  //==================================================
  // Export draft to file, as of now all is very hacky and only low-res
  // TODO: More and better HQ export options
  p.export_draft = () => {
    let dimensions = draft.get_dimensions(); // Get dimensions of draft
    // let export_w = app_settings.canvas_width; // Get canvas width
    let export_w = 1500; // Get canvas width
    let export_h = export_w * 1.412; // Scale to A4 dimensions
    let new_width; 
    let new_height;

    let draft_copy;

    // Create a separate p5 buffer
    let export_buffer = p.createGraphics(export_w, export_h);

    // Create timestamp
    let current_time = new Date();
    let date  = current_time.getFullYear() + "." + (current_time.getMonth()+1) + "." + current_time.getDay();
    let time  = current_time.getHours() + "." + current_time.getMinutes() + "." + current_time.getSeconds();
    let date_formated = current_time.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Create file name
    let file_type = ".png";
    let file_name = app_settings.draft_name + "-" +  date + "-" + time;

    // Crisp up the text TODO: find better solution
    export_buffer.pixelDensity(4);
    export_buffer.background(255);


    switch(app_settings.export_options) {
      case "FULL": // Export Draft + Info

        // Calculate draft size, height capped to 1/3 of page
        // Scale to fit to new dimensions. See helpers.js for used function
        draft_copy = p.get(0,0,dimensions.w, dimensions.h); // Copy draft from canvas
        new_width = scale_to_fit(dimensions.w, dimensions.h, export_w, (export_h / 3) * 2).w; 
        new_height = scale_to_fit(dimensions.w, dimensions.h, export_w, (export_h / 3) * 2).h; 

        // Draw scaled image to buffer
        export_buffer.image(draft_copy, 0, export_h / 3, new_width, new_height);

        // Info
        export_buffer.textFont(export_font);
        export_buffer.fill(styling.fg);
        export_buffer.stroke(styling.fg);

        // Title
        export_buffer.textSize(app_settings.text_size.heading);
        export_buffer.text("WYRD", 100,100);

        export_buffer.textSize(app_settings.text_size.regular);
        export_buffer.text("Draft Name: " + app_settings.draft_name, 150,200);
        export_buffer.text("Co-Creator: " + app_settings.co_creator, 150,250);
        export_buffer.text("Date: " + date_formated, 150,300);
        export_buffer.text("Warp Ends: " + app_settings.warp_count, 150,400);
        export_buffer.text("Weft Picks: " + app_settings.weft_count, 150,450);
        export_buffer.text("Shafts: " + app_settings.shaft_count, 150,500);
        export_buffer.text("Treadles: " + app_settings.treadle_count, 150,550);
        let type = app_settings.isRising ? "Rising" : "Sinking"
        export_buffer.text("Loom Type: " + type, 150,600);

        // Color
        export_buffer.text("Colours: ", export_w / 2, 200);

        export_buffer.textSize(app_settings.text_size.small);
        colors_select_arr.forEach( (el, idx) => {
          let x = export_w / 2 + 100;
          x = (idx > 2) ? x + 250 : x;
          let y = 250 + (50 * (idx % 3));

          export_buffer.fill(el.value);
          export_buffer.rect(x-25, y, 12, -12);

          export_buffer.stroke(styling.fg);
          export_buffer.fill(styling.fg);
          export_buffer.text(alphabet[idx] + ": " + el.value, x, y);

        });

        export_buffer.textSize(app_settings.text_size.regular);
        export_buffer.stroke(styling.fg);
        export_buffer.fill(styling.fg);
        export_buffer.text("Notes: ", export_w / 2, 400);
        export_buffer.textSize(app_settings.text_size.small);
        export_buffer.text(app_settings.draft_notes, export_w / 2 + 25, 450, export_w / 3);

        break;
      case "SIMPLE": // Export draft only
        // Repeating scale to fit but to full size of page
        draft_copy = p.get(0,0,dimensions.w, dimensions.h); // Copy draft from canvas
        new_width = scale_to_fit(dimensions.w, dimensions.h, export_w, export_h).w; // Check which ratio fits
        new_height = scale_to_fit(dimensions.w, dimensions.h, export_w, export_h).h; // Check which ratio fits
        export_buffer.image(draft_copy, 0, 0, new_width, new_height);
        break;
      case "DRAWDOWN": // Export drawdown only
        draft.drawdown_to_buffer(export_buffer, export_w, export_h);
        break;
      default:
        break;
    }
    p.save(export_buffer, file_name + file_type);
    export_buffer.remove();

  }


},
"draft_canvas"); //div id

//HELPER FUNCTIONS
//==================================================
function init2dArray(cols, rows) {
  // Initiate a 2d Array
  let tempArr = new Array(cols);
  for (let i = 0; i < tempArr.length; i++) {
    tempArr[i] = new Array(rows);
  }
  return tempArr;
}

// Scale width+height to fit within constraints while keeping aspect ratio. Returns an object containing two values
function scale_to_fit(width_in, height_in, max_width, max_height) {
  let aspect_ratio = Math.min((max_width / width_in), (max_height / height_in)); // Check which ratio to use
  let width_out = width_in * aspect_ratio; // Apply ratio to width
  let height_out = height_in * aspect_ratio; // Apply ratio to height

  return {
    w: width_out,
    h: height_out
  }
}



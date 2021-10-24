/* Loom Class 
*Containing all info of the virtual loom setup, warp/weft/shafts/etc
*Calculates and returns picks.
*Receives and updates threading/tieup/treadling
*Contains methods to generate standard setups ie tabby/twill/etc
*/

class Loom {

  constructor(_p) {
    this.p = _p;
    this.warp_count = app_settings.warp_count;
    this.weft_count = app_settings.weft_count;
    this.shaft_count = app_settings.shaft_count;
    this.treadle_count = app_settings.treadle_count;
    this.threading = [];
    this.tieup = [];
    this.treadling = [];
    this.drawdown = [];
  };

  //==================================================
  init() {
    //init threading
    for(let i = 0; i < this.warp_count; i++) {
      // this.threading[i] = i % 4;
      this.threading[i] = {
        index: i,
        shaft: i % this.shaft_count,
        color: this.p.color(150, 200, 200),
      };
    }

    //init tieup
    for(let i = 0; i < this.shaft_count; i++) {
      this.tieup[i] = new Array(this.shaft_count);
      for(let j = 0; j < this.treadle_count; j ++) {
        this.tieup[i][j] = i === j ? 1 : 0; //weft-faced twill
      }
    }

    //init treadling
    for(let i = 0; i < this.weft_count; i++) {
      this.treadling[i] = {
        index: i,
        treadle: i % this.treadle_count,
        color: this.p.color(200, 70, 70),
      }
    }

  }


  re_init() {
    for(let i = 0; i < this.threading.length; i++) {
      if(this.threading[i] === undefined) {
        this.threading[i] = {
          index: i,
          shaft: 0,
          color: this.p.color(255),
        }
      }
      if(this.threading[i].shaft >= this.shaft_count){
        this.threading[i].shaft = 0;
      }
    }

    for(let i = 0; i < this.treadling.length; i++) {
      // this.threading[i] = i % 4;
      if(this.treadling[i] === undefined) {
        this.treadling[i] = {
          index: i,
          treadle: 0,
          color: this.p.color(255),
        }
      }
    }

    // update tieup
    for(let i = 0; i < this.treadle_count; i++) {
      if(this.tieup[i] === undefined) { this.tieup[i] = new Array(this.shaft_count) };
      for(let j = 0; j < this.shaft_count; j ++) {

        //keeping old values, adding new ones
        if(this.tieup[i][j] !== 1) {
          this.tieup[i][j] = 0; 
        }
      }
    }
  }


  //==================================================
  // Calculate pick by looking at which treadle(idx) is currently engaged
  // Returns array of colors 
  calc_pick(idx) {
    let temp_pick = new Array(this.warp_count);
    let temp_treadle = this.treadling[idx].treadle;

    if(app_settings.isRising) {
      // Rising shaft
      for(let k = 0; k < this.threading.length; k++) {
        temp_pick[k] = {
          color: this.treadling[idx].color,
          thread: "WEFT",
        };
      }

      for(let i = 0; i < this.tieup[0].length; i++) {
        for(let j = 0; j < this.threading.length; j++) {
          if(this.tieup[temp_treadle] !== undefined && this.tieup[temp_treadle][i ]> 0 && this.threading[j].shaft === i) {
            temp_pick[j].color = this.threading[j].color;
            temp_pick[j].thread = "WARP";
          }
        }
      }
    } else {
      // Sinking shaft
      for(let k = 0; k < this.threading.length; k++) {
        temp_pick[k] = {
          color: this.threading[k].color,
          thread: "WARP",
        };
      }

      for(let i = 0; i < this.tieup[0].length; i++) {
        for(let j = 0; j < this.threading.length; j++) {
          if(this.tieup[temp_treadle] !== undefined && this.tieup[temp_treadle][i] > 0 && this.threading[j].shaft === i) {
            // temp_pick[j] = this.treadling[idx].color;
            temp_pick[j].color = this.treadling[idx].color;
            temp_pick[j].thread = "WEFT";
          }
        }
      }
    }

    return(temp_pick);
  }

  //==================================================
  // Update Settings
  update_settings() {
    this.warp_count = app_settings.warp_count;
    this.weft_count = app_settings.weft_count;
    this.shaft_count = app_settings.shaft_count;
    this.treadle_count = app_settings.treadle_count;
    this.threading.length = this.warp_count;
    this.treadling.length = this.weft_count;
    this.tieup.length = this.treadle_count;
    this.tieup.forEach((el) => {
      el.length = this.shaft_count;
    })
    // this.tieup.length = this.treadle_count;
    this.re_init();
  }

  //==================================================
  // Update Threading/Treadling

  //Update Threading
  update_threading(_threading_array) {
    this.threading.forEach((el, index) => {
      if(_threading_array != undefined) {
        el.shaft = _threading_array[index];
      }
    });
  }

  //Update Treadling
  update_treadling(_treadling_array) {
    this.treadling.forEach((el, index) => {
      if(_treadling_array != undefined) {
        el.treadle = _treadling_array[index];
      }
    });
  }

  //==================================================
  // Update Colors
  update_warp_colors(_warp_colors_array) {
    this.threading.forEach((el, index) => {
      if(_warp_colors_array != undefined) {
        el.color = _warp_colors_array[index];
      }
    });
  }

  update_weft_colors(_weft_colors_array) {
    this.treadling.forEach((el, index) => {
      if(_weft_colors_array != undefined) {
        el.color = _weft_colors_array[index];
      }
    });
  }

  //==================================================
  //Calcultions

  calc_pick_simple(idx) {
    //calculate simple pick (ie 1/0 for warp position) by looking at which treadle is engaged
    let temp_pick = new Array(this.warp_count);

    this.tieup[idx].forEach((treadle_element, treadle_index) => {
      if (treadle_element > 0) {
        this.threading.forEach((threading_element, threading_index) => {
          temp_pick[threading_index] = threading_element.shaft === treadle_index ? 1 : 0;
        });

      }
    });

    return(temp_pick);
  }

  calc_drawdown() {
    this.drawdown.length = 0;
    for(let i = 0; i < this.treadling.length; i++) {
      let current_pick = this.calc_pick(i);
      //  for(let j = 0; j < this.threading.length; j++) {
      //    this.drawdown[i][j] = current_pick[j];
      //  }
      this.drawdown.push(current_pick);
    }
  }


}


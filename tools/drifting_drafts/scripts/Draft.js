/* Draft Class\
 * Visualizing the threading/tie-up/treadling drafts & drawdown
 */

class Draft {
  'use strict'

  constructor(_p, _loom) {
    this.p = _p;
    this.loom = _loom;

    this.box_offset_count = 2;
    this.draft_dimensions = {
      w: 0,
      h: 0,
    }
    app_settings.cell_size = this.calc_cell_size();
    this.cell_size =  app_settings.cell_size;
    this.box_offset_size = this.box_offset_count * this.cell_size;

    this.init();

    this.tieup_grid = [];

  }

  //==================================================
  // Calculating positions of draft modules/boxes
  init() {
    // app_settings.cell_size = this.calc_cell_size();
    this.cell_size =  app_settings.cell_size;

    this.threading_box = {
      x: 0,
      y: this.cell_size + (this.box_offset_size / 2),
      w: this.cell_size * this.loom.warp_count,
      h: this.cell_size * this.loom.shaft_count,
    }

    this.tieup_box = {
      x: this.threading_box.w + this.box_offset_size,
      y: this.box_offset_size,
      w: this.cell_size * this.loom.treadle_count,
      h: this.cell_size * this.loom.shaft_count,
    }

    this.treadling_box = {
      x: this.threading_box.w + this.box_offset_size,
      y: this.threading_box.h + (this.box_offset_size * 2), //offset * 2 to make way for colour array
      w: this.cell_size * this.loom.treadle_count,
      h: this.cell_size * this.loom.weft_count,
    }

    this.drawdown_box = {
      x: 0,
      y: this.threading_box.h + (this.box_offset_size * 2), //offset * 2 to make way for colour array,
      w: this.cell_size * this.loom.warp_count,
      h: this.cell_size * this.loom.weft_count,
    }
    this.warp_color_box = {
      x: 0,
      y: 0,
      w: this.cell_size * this.loom.warp_count,
      h: this.cell_size,
    }
    this.weft_color_box = {
      x: this.treadling_box.x + this.treadling_box.w + (this.box_offset_size / 2),
      y: this.treadling_box.y,
      w: this.cell_size,
      h: this.cell_size * this.loom.weft_count,
    }

    this.draft_dimensions.w = this.threading_box.w + this.treadling_box.w + this.weft_color_box.w + (4 * this.box_offset_size);
    this.draft_dimensions.h = this.threading_box.h + this.treadling_box.h + this.warp_color_box.h + (4 * this.box_offset_size);
  }


  //==================================================
  // Calculate cellsize to fit within canvas container
  calc_cell_size() {
    let temp_size = 0;
    if (app_settings.canvas_width / app_settings.warp_count <  app_settings.canvas_height / app_settings.weft_count) {
      temp_size =  app_settings.canvas_width / (this.loom.warp_count + this.loom.treadle_count + (this.box_offset_count*5));
    } else {
      temp_size =  app_settings.canvas_height / (this.loom.weft_count + this.loom.treadle_count + (this.box_offset_count*6));
    }
    return temp_size;
  }



  //==================================================
  // Draw all parts of the draft to screen
  display() {

    this.draw_threading();
    this.draw_tieup();
    this.draw_treadling();
    this.draw_drawdown();

    this.draw_threading_box();
    this.draw_tieup_box();
    this.draw_treadling_box();
    this.draw_drawdown_box();

    this.draw_warp_colors();
    this.draw_weft_colors();
  }

  //==================================================
  // Visualize the boxes/moduls of the draft

  //Draw draft grids and outlines
  draw_threading_box() {
    this.p.noFill();
    this.p.stroke(styling.fg);

    // Grid
    for(let i = 0; i < this.loom.warp_count + 1; i++) {
      for(let j = 0; j < this.loom.shaft_count + 1; j++) {
        let x = this.threading_box.x + i*this.cell_size;
        let y = this.threading_box.y + j*this.cell_size;
        this.p.line(x, this.threading_box.y, x, this.threading_box.y + this.threading_box.h);
        this.p.line(this.threading_box.x, y, this.threading_box.x + this.threading_box.w, y);
      }
    }

    // Outline 
    this.p.rect(this.threading_box.x, this.threading_box.y,this.threading_box.w,this.threading_box.h);
  }

  draw_tieup_box() {
    this.p.noFill();
    this.p.stroke(styling.fg);

    // Grid
    for(let i = 0; i < this.loom.treadle_count + 1; i++) {
      for(let j = 0; j < this.loom.shaft_count + 1; j++) {
        let x = this.tieup_box.x + i*this.cell_size;
        let y = this.tieup_box.y + j*this.cell_size;
        this.p.line(x, this.tieup_box.y, x, this.tieup_box.y + this.tieup_box.h);
        this.p.line(this.tieup_box.x, y, this.tieup_box.x + this.tieup_box.w, y);
      }
    }

    // Outline
    this.p.rect(this.tieup_box.x, this.tieup_box.y,this.tieup_box.w,this.tieup_box.h);
  }

  draw_treadling_box() {
    this.p.noFill();
    this.p.stroke(styling.fg);

    // Grid
    for(let i = 0; i < this.loom.treadle_count + 1; i++) {
      for(let j = 0; j < this.loom.weft_count + 1; j++) {
        let x = this.treadling_box.x + i*this.cell_size;
        let y = this.treadling_box.y + j*this.cell_size;
        this.p.line(x, this.treadling_box.y, x, this.treadling_box.y + this.treadling_box.h);
        this.p.line(this.treadling_box.x, y, this.treadling_box.x + this.treadling_box.w, y);
      }
    }

    // Outline
    this.p.rect(this.treadling_box.x, this.treadling_box.y,this.treadling_box.w,this.treadling_box.h);
  }

  draw_drawdown_box() {
    this.p.noFill();
    this.p.stroke(styling.fg);

    // Outline
    this.p.rect(this.drawdown_box.x, this.drawdown_box.y,this.drawdown_box.w,this.drawdown_box.h);
  }

  //==================================================
  // Visualize the actual threading/tieup/treadling of the draft

  // Draws draft threading module by reading the threading of the loom instance
  draw_threading() {
    for(let i = 0; i < this.loom.warp_count; i++) {
      let x = this.threading_box.x + this.threading_box.w - (this.cell_size * i);
      let y = this.threading_box.y + this.threading_box.h - (this.loom.threading[i].shaft * this.cell_size);
      this.p.fill(styling.fg);
      this.p.rect(x, y, -this.cell_size, -this.cell_size);
    }
  }

  draw_tieup() {
    for(let i = 0; i < this.loom.tieup.length; i++) {
      for(let j = 0; j < this.loom.tieup[0].length; j++) {
        let x = (this.tieup_box.x) + (i * this.cell_size);
        let y = (this.tieup_box.y + this.tieup_box.h) -  (j * this.cell_size) ;
        if(this.loom.tieup[i][j] > 0) {
          this.p.fill(styling.fg);
          this.p.rect(x, y, this.cell_size, -this.cell_size);
        }
      }
    }
  }

  draw_treadling() {
    if(app_settings.scandinavian) {
      for(let i = 0; i < this.loom.weft_count; i++) {
        let y = (this.treadling_box.y) + (this.cell_size * i);
        let x = (this.treadling_box.x + this.treadling_box.w) - (this.loom.treadling[i].treadle * this.cell_size);
        this.p.fill(styling.fg);
        this.p.rect(x, y, -this.cell_size, +this.cell_size);
      }
    } else {
      for(let i = 0; i < this.loom.weft_count; i++) {
        // console.log(this.loom.weft_count);
        let y = (this.treadling_box.y) + (this.cell_size * i);
        let x = (this.treadling_box.x) + (this.loom.treadling[i].treadle * this.cell_size);
        this.p.fill(styling.fg);
        this.p.rect(x, y, this.cell_size, this.cell_size);
      }
    }
  }

  // Calculate and visualize the drawdown with warp/weft colours
  draw_drawdown() {
    for(let i = 0; i < this.loom.drawdown.length; i++) {
      for(let j = 0; j < this.loom.drawdown[i].length; j++) {
        let x = (this.drawdown_box.x + this.drawdown_box.w) - (j * this.cell_size);
        let y = (this.drawdown_box.y) + (i * this.cell_size);
        this.p.stroke(this.loom.drawdown[i][j].color);
        this.p.fill(this.loom.drawdown[i][j].color);
        this.p.rect(x, y, -this.cell_size, this.cell_size);
        this.p.stroke(styling.fg);

        // Grid
        if(app_settings.drawdown_style === "GRID") {
          this.p.line(x, this.drawdown_box.y, x, this.drawdown_box.y + this.drawdown_box.h);
          this.p.line(this.drawdown_box.x, y, this.drawdown_box.x + this.drawdown_box.w, y);
        }

        // Structure
        if(app_settings.drawdown_style === "STRUCTURE") {
          if(this.loom.drawdown[i][j].thread === "WARP") {
            this.p.line(x, y, x, y+this.cell_size);
            this.p.line(x - this.cell_size, y, x - this.cell_size, y + this.cell_size);
          } else {
            this.p.line(x, y, x - this.cell_size, y);
            this.p.line(x, y + this.cell_size, x - this.cell_size, y + this.cell_size);
          }
        }
      }
    }

  }

  // Draw out drawdown to p5.graphics buffer 'b' and scale to fit width and hight
  drawdown_to_buffer(b, w, h) {
    let b_cell_size = ((w / app_settings.warp_count) <= (h / app_settings.weft_count)) ? w / app_settings.warp_count : h / app_settings.weft_count; // scale size of cells to fit width and height
    let b_width = b_cell_size * app_settings.warp_count;
    let b_height = b_cell_size * app_settings.weft_count;
    b.resizeCanvas(b_width,b_height); //resize buffer to new drawdown size

    for(let i = 0; i < this.loom.drawdown.length; i++) {
      for(let j = 0; j < this.loom.drawdown[i].length; j++) {
        let x = w - (j * b_cell_size);
        let y = 0 + (i * b_cell_size);
        b.stroke(this.loom.drawdown[i][j].color);
        b.fill(this.loom.drawdown[i][j].color);
        b.rect(x, y, -b_cell_size, b_cell_size);
        b.stroke(styling.fg);

        // Grid
        if(app_settings.drawdown_style === "GRID") {
          b.line(x, 0, x, b_height);
          b.line(0, y, b_width, y);
        }

        // Structure
        if(app_settings.drawdown_style === "STRUCTURE") {
          if(this.loom.drawdown[i][j].thread === "WARP") {
            b.line(x, y, x, y+b_cell_size);
            b.line(x - b_cell_size, y, x - b_cell_size, y + b_cell_size);
          } else {
            b.line(x, y, x - b_cell_size, y);
            b.line(x, y + b_cell_size, x - b_cell_size, y + b_cell_size);
          }
        }
      }
    }
    b.stroke(styling.fg);
    b.noFill();
    b.rect(0, 0, b_width, b_height);
  }

  //==================================================
  // Visualize the warp / weft colours

  draw_warp_colors() {
    for(let i = 0; i < this.loom.threading.length; i++) {
      this.p.stroke(styling.fg);
      this.p.fill(this.loom.threading[i].color);
      let x = (this.warp_color_box.x + this.warp_color_box.w) - (i * this.cell_size);
      let y = this.warp_color_box.y;
      this.p.rect(x, y, -this.cell_size, this.cell_size);
    }
    this.p.noFill();
    this.p.stroke(styling.fg);
    this.p.rect(this.warp_color_box.x, this.warp_color_box.y, this.warp_color_box.w, this.warp_color_box.h)
  }

  draw_weft_colors() {
    for(let i = 0; i < this.loom.treadling.length; i++) {
      this.p.fill(this.loom.treadling[i].color);
      this.p.stroke(styling.fg);
      let x = this.weft_color_box.x;
      let y = (this.weft_color_box.y) + (i * this.cell_size);
      this.p.rect(x, y, this.cell_size, this.cell_size);
    }
    this.p.stroke(styling.fg);
    this.p.noFill();
    this.p.rect(this.weft_color_box.x, this.weft_color_box.y, this.weft_color_box.w, this.weft_color_box.h)
  }

  get_dimensions() {
    return(this.draft_dimensions);
  }

}

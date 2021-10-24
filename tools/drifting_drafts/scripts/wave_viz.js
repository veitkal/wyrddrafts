//Waveform Visualizer, renders as its own canvas

let p5_wave_viz = new p5(function (p) {
  "use strict";

  let wave_array = [];

  p.setup = function () {
    p.createCanvas(250, 100);
  };

  p.draw = function () {
      p.background(255);
      p.stroke(0);
      p.strokeWeight(3);
      p.rect(0,0, p.width, p.height);
      p.strokeWeight(1);

      // // Draw waveform
      p.noFill();
      p.stroke(0);
    if(wave_array.length > 0) {
      p.beginShape();

      let offset = p.width/(wave_array.length - 1);
        p.curveVertex(0, p.map(wave_array[0].y, 1, 0, -0.5, 0.5) * p.height + (p.height / 2)); //  Mapping wave y value  to invert wave displ
      
      for (let n = 0; n < wave_array.length; n++) {
        let x =   (n * offset);
        p.curveVertex(x, p.map(wave_array[n].y, 1, 0, -0.5, 0.5) * p.height + (p.height / 2)); //  Mapping wave y value  to invert wave displ
      }
        p.curveVertex(p.width, p.map(wave_array[wave_array.length-1].y, 1, 0, -0.5, 0.5) * p.height + (p.height / 2)); //  Mapping wave y value  to invert wave displ
      p.endShape();
    }
  };

  p.set_wave = function (_wave_arr) {
    wave_array =  _wave_arr
  };

  p.set_canvas_size = function (w, h) {
    p.resizeCanvas(w, h);
  };
 
},
"ui_viz_canvas")

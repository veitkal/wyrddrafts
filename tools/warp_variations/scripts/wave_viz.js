

new p5(function (p) {
  "use strict";
 
 
  p.setup = function () {
    p.createCanvas(200, 100);
  };
 
  p.draw = function () {
    p.background(255);
    p.stroke(0);
    
    
    //
    // // Draw waveform
    p.translate(0, 30);
    p.beginShape();
    p.noFill();
    p.stroke(0);
    for (let n = 0; n < wave_arr.length; n++) {
      p.curveVertex(wave_arr[n].x, p.map(wave_arr[n].y, 1, 0, 0, 1) * wave_multY); //  Mapping wave y value  to invert wave display 
    }
    p.endShape();
    
  };
 
},
"ui_viz_canvas")

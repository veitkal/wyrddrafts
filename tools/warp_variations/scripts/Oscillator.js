'use strict'
     //shape enum;
     const OSC_SHAPE_SINE = 0,
           OSC_SHAPE_SQUARE = 1,
           OSC_SHAPE_TRIANGLE = 2,
           OSC_SHAPE_NOISE = 3;

// Oscillator Class

 class Oscillator {
   constructor(p, _freq, _amp, _shape, _mod_rate, _mod_amnt) {
     this.freq = _freq;
     this.amp = _amp;
     this.shape = _shape;
     this.mod_rate = _mod_rate;
     this.mod_amnt = _mod_amnt;

     this.tick = 0;
     this.p = p;
     this.x = p.createVector(this.p.width, 0);
   }

   update_param(_freq, _amp, _mod_rate, _mod_amnt, _shape) {
     this.freq = _freq;
     this.amp = _amp;
     this.mod_rate = _mod_rate;
     this.mod_amnt = _mod_amnt;
     this.shape = _shape;
   } 

   update() {
     this.tick++;
   }
   update_reverse() {
     this.tick--;
   }


   calc(p, _phase) {
     let wave;
     let mod = this.mod_amnt * (this.p.sin((_phase+this.tick) / this.mod_rate));

     switch (this.shape) {
       case OSC_SHAPE_SINE:
       wave = ((this.amp * 1+(this.amp * (this.p.sin(mod+(_phase + this.tick) / this.freq))))/2);
       break;
       case OSC_SHAPE_SQUARE:
       wave = this.amp * ( ( 1+(this.amp * (this.p.sin(mod+(_phase + this.tick) / this.freq))))/2 > 0.5 ? 1.0 : 0.0 );
       break;
       case OSC_SHAPE_TRIANGLE:
       wave = this.p.abs( mod+((this.tick + _phase ) / this.freq ) % (2*this.amp) - this.amp);
       break;
       case OSC_SHAPE_NOISE:
       wave =  this.amp * (this.p.noise(_phase + this.tick * (this.freq * 0.01)));
       break;
     }

       return(wave);
   }

 }

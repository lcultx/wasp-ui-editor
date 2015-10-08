var execTime = require('exec-time')
  , profiler = new execTime('Wozlla IDE');

export class ExecTimeService{
  constructor(){

  }

  static beginProfiling(){
    profiler.beginProfiling();
  }

  static step(msg){
    profiler.step(msg);
  }

  step(msg){
    profiler.step(msg);
  }
}

(<any>window).ExecTimeService = ExecTimeService;

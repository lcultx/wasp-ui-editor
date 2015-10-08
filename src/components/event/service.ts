import EventEmitter = require('eventemitter3');

export class EventService{
  private eventEmitter:EventEmitter;
  constructor(){
    this.eventEmitter = new EventEmitter();
  }

  emit(name,ev){
    this.eventEmitter.emit(name,ev)
  }

  on(name,callback:Function){
    this.eventEmitter.on(name,(ev)=>{
      callback(ev);
    })
  }
}

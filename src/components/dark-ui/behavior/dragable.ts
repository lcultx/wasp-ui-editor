import ng = require('angular2/angular2');
import $ = require('jquery');
import {EventService} from "../../event/service";

@ng.Directive({
  selector:'[dragable]',
  host:{
    '(^mousedown)': '_onMouseDown($event)'
  },properties:['data','shadowclass']
})

export class Dragable{
    isMousePushing:boolean = false;
    isDragging:boolean = false;
    elementStartX:number = 0;
    elementStartY:number = 0;
    mouseStartX:number = 0;
    mouseStartY:number = 0;

    $element:JQuery;
    $movingElement:JQuery;
    data;

    eventService:EventService;

    sens:number = 5;//sensitivity
  constructor(private el:ng.ElementRef,@ng.Inject(EventService) eventService:EventService){

    this.eventService = eventService;

    this.$element = $(el.nativeElement);

    $('html').mouseup((ev:JQueryMouseEventObject)=>{
      this._onMouseUp(<any>ev.originalEvent);
    });

    $('html').mousemove((ev:JQueryMouseEventObject)=>{
      this._onMouseMove(<any>ev.originalEvent);
    });

  }

  _onMouseDown(ev:MouseEvent){
    ev.stopPropagation();
    this.isMousePushing = true;
    this.mouseStartX = ev.pageX;
    this.mouseStartY = ev.pageY;
    this.elementStartX = this.$element.offset().left;
    this.elementStartY = this.$element.offset().top;
    this.$movingElement = this.$element;
  }

  _onMouseUp(ev:MouseEvent){
    if(this.isDragging){
      this.eventService.emit('dragstop', {data:{ev:ev,el:this.el,data:this.data}});
    }
    this.isMousePushing = false;
    this.isDragging = false;
  }

  move(deltaX,deltaY){

    this.$movingElement.css({
      'position':'fixed',
      'top':this.elementStartY + deltaY,
      'left': this.elementStartX + deltaX,
      'z-index':10000
    })
  }


  _onMouseMove(ev:MouseEvent){
    if(this.isMousePushing){
      var deltaX = ev.pageX - this.mouseStartX;
      var deltaY = ev.pageY - this.mouseStartY;
      if(deltaX > this.sens || deltaX < 0- this.sens || deltaY > this.sens || deltaY < 0 - this.sens){
        this.isDragging = true;
        this.eventService.emit('dragmove', {data:{ev:ev,el:this.el,data:this.data}});
        this.move(deltaX,deltaY);
      }
    }

  }

}

@ng.Directive({
  selector:'[shadow-dragable]',
  host:{
    '(^mousedown)': '_onMouseDown($event)',
  },properties:['data','draggingAddClass','draggingRemoveClass']
})

export class ShadowDragable extends Dragable{

      draggingAddClass:string;
      draggingRemoveClass:string;

  private $shadow:JQuery;
  constructor(el:ng.ElementRef,@ng.Inject(EventService) eventService:EventService){
    super(el,eventService);
  }

  makeShadow(){

    this.$shadow = this.$element.clone()
      .addClass(this.draggingAddClass).removeClass(this.draggingRemoveClass);

    this.hideShadow();
    this.$element.parent().append(this.$shadow);
  }

  showShadow(){
    this.$shadow.show();
  }

  hideShadow(){
    this.$shadow.hide();
  }

  clearShadow(){
    if(this.$shadow){
      this.$shadow.remove();
    }
  }



  _onMouseDown(ev:MouseEvent){
    super._onMouseDown(ev);
    this.makeShadow();
    this.$movingElement = this.$shadow;
  }

  _onMouseUp(ev:MouseEvent){
    super._onMouseUp(ev);
    this.clearShadow();
  }


    move(deltaX,deltaY){

      super.move(deltaX,deltaY);
      this.showShadow();
    }


}

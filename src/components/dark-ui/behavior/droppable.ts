import ng = require('angular2/angular2');
import $ = require('jquery');
import dragable = require('./dragable');
import {EventService} from "../../event/service";

var $areaShowElement = $('<div>');
$areaShowElement.appendTo($('body'));

@ng.Directive({
  selector:'[droppable]',
  events:['drop'],properties:['data']
})

export class Droppable{
  $element;

  drop = new ng.EventEmitter();

  data;

  isShowingAreaElement;

  eventService:EventService;

  constructor(protected el:ng.ElementRef,@ng.Inject(EventService) eventService:EventService){
    this.$element = $(el.nativeElement);
    this.eventService = eventService;
    this.listenDragStop();
  }

  listenDragStop(){
    this.eventService.on('dragstop', (e) => {
      var ev = e.data.ev;
      if(this.isMouseAtHere(ev)){
        this.clearShow();
        if(this.data != e.data.data){
          this.drop.next({
            ev:ev,
            e:e,
            droppable:this.el,
            dragable:e.data.el,
            droppable_data:this.data,
            dragable_data:e.data.data
          });
        }
      }

    });
  }

  showHere(){
    if(!this.isShowingAreaElement){

      $areaShowElement.css({
        position:'fixed',
        width:this.el.nativeElement.scrollWidth,
        height:this.el.nativeElement.scrollHeight,
        top:this.$element.offset().top,
        left:this.$element.offset().left,
        background:'rgba(255, 0, 0, 0.3)'
      }).show();

      this.isShowingAreaElement =true;
    }
  }

  clearShow(){
    console.log('clearShow');
    if(this.isShowingAreaElement){
      $areaShowElement.hide();
      this.isShowingAreaElement = false;
    }
  }

  isMouseAtHere(ev:MouseEvent){

    var x = ev.pageX, y = ev.pageY;
    var offset = this.$element.offset();
    var nativeElement = this.$element[0];
    if(
      (offset.left<x && (offset.left + nativeElement.scrollWidth)>x) &&
      (offset.top <y && (offset.top + nativeElement.scrollHeight)>y)
    ){

      return true;
    }else{
      return false;
    }
  }

}

@ng.Directive({
  selector:'[dynamic-droppable]',
  events:['dropenter','dropleave','dropmove','drop'],properties:['data']
})
export class DynamicDroppable extends Droppable{
  private isMouseHaveBeenHere:boolean = false;
  dropenter;
  dropleave;
  dropmove;

  constructor(el:ng.ElementRef,@ng.Inject(EventService) eventService:EventService){

    super(el,eventService);


    this.dropenter = new ng.EventEmitter();
    this.dropleave = new ng.EventEmitter();
    this.dropmove = new ng.EventEmitter();


    this.eventService.on('dragmove', (e) => {
      var ev = e.data.ev;
      var isMouseHere = this.isMouseAtHere(ev);

      if(isMouseHere && this.data != e.data.data){

        if(this.isMouseHaveBeenHere){
          this.dropmove.next(e.data);
        }else{
          this.showHere();
          this.dropenter.next(e.data);
        }

      }else{
        if(this.isMouseHaveBeenHere){
          this.clearShow();
          this.dropleave.next(e.data);
        }
      }
      this.isMouseHaveBeenHere = isMouseHere;
    });

  }

  //

}

@ng.Directive({
  selector:'[side-droppable]',
  events:['dropEnterTop','dropEnterBottom','dropEnterCenter','dropleave','dropmove','drop'
  ,'dropTop','dropBottom','dropCenter'
],properties:['data','index','isLastItem']
})
export class SideDroppable extends Droppable{
  private mouseHaveBeenArea:string = null;
  dropEnterTop = new ng.EventEmitter();
  dropEnterBottom = new ng.EventEmitter();
  dropEnterCenter = new ng.EventEmitter();
  dropleave = new ng.EventEmitter();
  dropmove = new ng.EventEmitter();

  dropTop = new ng.EventEmitter();
  dropCenter = new ng.EventEmitter();
  dropBottom = new ng.EventEmitter();

  index:number;
  isLastItem:boolean;

  private isMouseHaveBeenHere:boolean = false;

  constructor(el:ng.ElementRef,@ng.Inject(EventService) eventService:EventService){

    super(el,eventService);

    this.listenDragMove();
  }

  listenDragStop(){
    this.eventService.on('dragstop', (e) => {
      var ev = e.data.ev;
      var mouseArea = this.getMouseArea(ev);
      if(mouseArea && this.data != e.data.data){
        var data = {
          ev:ev,
          e:e,
          droppable:this.el,
          dragable:e.data.el,
          droppable_data:this.data,
          dragable_data:e.data.data
        };
        if(mouseArea == 'top'){
          if(this.shouldOpenTopInsert()){
            this.dropTop.next(data);
          }

        }
        if(mouseArea == "bottom"){
          if(this.shouldOpenBottomInsert()){
              this.dropBottom.next(data);
          }

        }
        if(mouseArea == "center"){
          this.dropCenter.next(data);
        }
        this.showByMsg(null);

      }

    });
  }

  isDir(){
    return this.data && this.data.children && this.data.children.length > 0;
  }

  shouldOpenTopInsert(){
    return true;
  }

  shouldOpenBottomInsert(){
    return this.isLastItem;
  }

  listenDragMove(){
    this.eventService.on('dragmove', (e) => {
      var ev = e.data.ev;
      var mouseArea = this.getMouseArea(ev);
      if(mouseArea && this.data != e.data.data){
        if(mouseArea == 'top'){
          if(this.mouseHaveBeenArea == "top"){
            this.dropmove.next(e.data);
          }else{

            if(this.shouldOpenTopInsert()){
              console.log('this is should open top insert')
              this.dropEnterTop.next(e.data);
              this.showByMsg('top');
            }

          }
        }
        if(mouseArea == "bottom"){
          if(this.mouseHaveBeenArea == "bottom"){
            this.dropmove.next(e.data);
          }else{
            if(this.shouldOpenBottomInsert()){
              this.dropEnterBottom.next(e.data);
              this.showByMsg('bottom');
            }

          }
        }
        if(mouseArea == "center"){
          if(this.mouseHaveBeenArea == "center"){
            this.dropmove.next(e.data);
          }else{
            this.dropEnterCenter.next(e.data);
            this.showByMsg('center')
          }
        }

      }else{
        if(this.mouseHaveBeenArea){
          this.showByMsg(null);
          this.dropleave.next(e.data);
        }
      }
      this.mouseHaveBeenArea = mouseArea;
    });

  }

  getElementHeight(){
    var nativeElement = this.$element[0];
    return nativeElement.scrollHeight;
  }

  getElementWidth(){
    var nativeElement = this.$element[0];
    return nativeElement.scrollWidth
  }

  getElementOffsetTop(){
    var offset = this.$element.offset();
    return offset.top;
  }

  getElementOffsetLeft(){
    var offset = this.$element.offset();
    return  offset.left
  }

  getMouseArea(ev){
    var x = ev.pageX, y = ev.pageY;



    if(
        (this.getElementOffsetLeft()<x
          && (this.getElementOffsetLeft() + this.getElementWidth())>x
        ) &&
        (this.getElementOffsetTop() <y
        && (this.getElementOffsetTop() + this.getElementHeight())>y
      )
    ){
      if(
        y<(this.getElementOffsetTop() + this.getElementHeight()/3)
      ){
        return 'top'
      }else if(
        y>(this.getElementOffsetTop() + this.getElementHeight()/3 * 2)
      ){
        return 'bottom'
      }else{
        return 'center'
      }
    }else{
      return null;
    }
  }


  showByMsg(msg:string){


    switch(msg){
      case "top":
        $areaShowElement.css({
          position:'fixed',
          width:this.getElementWidth(),
          height:this.getElementHeight()/10,
          top:this.getElementOffsetTop(),
          left:this.getElementOffsetLeft(),
          background:'rgba(255, 0, 0, 0.3)'
        }).show();
        this.isShowingAreaElement =true;
      break;
      case "center":
        $areaShowElement.css({
          position:'fixed',
          width:this.getElementWidth(),
          height:this.getElementHeight(),
          top:this.getElementOffsetTop(),
          left:this.getElementOffsetLeft(),
          background:'rgba(255, 0, 0, 0.3)'
        }).show();
        this.isShowingAreaElement =true;
      break;
      case "bottom":

        $areaShowElement.css({
          position:'fixed',
          width:this.getElementWidth(),
          height:this.getElementHeight()/10,
          top:this.getElementOffsetTop() + this.getElementHeight(),
          left:this.getElementOffsetLeft(),
          background:'rgba(255, 0, 0, 0.3)'
        }).show();
        this.isShowingAreaElement =true;
      break;
      default:
        $areaShowElement.hide();
        this.isShowingAreaElement = false;
    }
  }

}

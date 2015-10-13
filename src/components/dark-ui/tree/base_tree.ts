import ng = require('angular2/angular2');
import $ = require('jquery');
import {Contextmenu} from '../contextmenu/Contextmenu';
import {Menu,Item} from '../menu/menu';
import {SideDroppable,Droppable,DynamicDroppable} from '../behavior/droppable';
import {ShadowDragable,Dragable} from '../behavior/dragable';
var activingLeafElement = null;
const tpl = require('./base_tree.html').load();
const css = require('./base_tree.css').load();
@ng.Component({
  selector:'base-tree',
  properties:['root','isleaftree','defaultCloseSubtree'],
  events:['select','add','remove','copy','childify','drop','click','dblclick']
})

@ng.View({
  template:tpl,styles:[css],
  directives:[ng.formDirectives,ng.coreDirectives,BaseTree,Contextmenu,Menu,Item,ShadowDragable,Dragable
    ,Droppable,DynamicDroppable
  ],
  encapsulation:ng.ViewEncapsulation.NONE
})

export class BaseTree{

  $element:JQuery;
  select = new ng.EventEmitter();
  add = new ng.EventEmitter();
  remove = new ng.EventEmitter();
  copy = new ng.EventEmitter();
  childify = new ng.EventEmitter();
  drop = new ng.EventEmitter();
  click = new ng.EventEmitter();
  dblclick = new ng.EventEmitter();
  isleaftree:boolean;
  defaultCloseSubtree:boolean;

  _root;

  get root(){
    return this._root;
  }

  set root(root){
    this._root = root;
  }

  get leaf(){
    return this._root;
  }

  constructor(private el:ng.ElementRef){
    this.$element = $(el.nativeElement);


    $('body').click(()=>{
      this.closeAllMenu();
    });


    //
    // this.$element.click((e)=>{
    //   e.stopPropagation();
    // })


        setTimeout(()=>{
            if(this.isleaftree){
            if(this.defaultCloseSubtree){
              var leafs = this.$element.find('.leaf');
              leafs.each((index,leaf)=>{
                this.closeLeafSubTree($(leaf));
              })
            }
            }
        },10);





  }




  randomColor(){
    var r = Math.round(Math.random() * 10);
    return '#' + r + r + r;
  }

  closeAllMenu(){
    Contextmenu.closeAll();
  }




  getThisLeafElement(){
    return this.$element.children().children('.leaf');
  }

  activeLeafElementShow(leafElement){
    if(activingLeafElement){
      activingLeafElement.removeClass('active');
      activingLeafElement = leafElement;
    }else{
      activingLeafElement = leafElement;
    }
    activingLeafElement.addClass('active');
  }

  toggleLeafSubTree(leafElement){

    var $child =leafElement.children('.children');
    if($child.length > 0){
        var nowStatus = $child.css('display');
        var leafName = leafElement.children('.leaf-name');
        var leafNameText = leafName.find('.leaf-name-text');
        if(nowStatus == "none"){
          leafNameText.addClass('expanded').removeClass('collapsed');
          $child.show();
        }else{
          leafNameText.addClass('collapsed').removeClass('expanded');
          $child.hide();
        }
    }

  }

  openLeafSubTree(leafElement){
      var $child =leafElement.children('.children');
      if($child.length > 0){
          var leafName = leafElement.children('.leaf-name');
          var leafNameText = leafName.find('.leaf-name-text');
          leafNameText.addClass('expanded').removeClass('collapsed');
          $child.show();
      }
  }

  closeLeafSubTree(leafElement){
    var $child =leafElement.children('.children');
    if($child.length > 0){
        var leafName = leafElement.children('.leaf-name');
        var leafNameText = leafName.find('.leaf-name-text');
          leafNameText.addClass('collapsed').removeClass('expanded');
          $child.hide();
    }
  }

  onLeafNameDoubleClick(leaf){
      var leafElement = this.getThisLeafElement();
      Contextmenu.closeAll();
      this.selectLeaf(leaf);
      this.dblclick.next(leaf);
  }

  onLeafNameClick(leaf){

    var leafElement = this.getThisLeafElement();
    this.toggleLeafSubTree(leafElement);
    this.activeLeafElementShow(leafElement);
    this.click.next(leaf);
  }


  addLeaf(desc){
    this.add.next(desc);
    Contextmenu.closeAll();
  }

  copyLeaf(leaf){
    this.copy.next(leaf);
    Contextmenu.closeAll();
  }

  deleteLeaf(leaf){
    this.remove.next(leaf);
    Contextmenu.closeAll();
  }

  selectLeaf(leaf){
    this.select.next(leaf);
  }

  objHasChildren(ob){
    return (ob && ob.children && ob.children.length > 0) ||(ob && ob.is_dir);
  }

  childifyLeaf(desc){
    this.childify.next(desc);
  }

      onDropEnter(ev){
        console.log('drop enter');
        console.log(ev);
      }

      onDropMove(ev){
        console.log('drop move');
      //  console.log(ev);
      }

      onDropLeave(ev){
        console.log('drop leave');
        console.log(ev);
      }

      onDrop(ev){
        console.log('tree drop event');
        this.drop.next(ev);

      }

      onLeafDropped(ev){
        console.log('DEEP tree drop event');
          this.drop.next(ev);

      }
  clickLeaf(ev){
    this.click.next(ev);
  }

  dblClickLeaf(ev){
    this.dblclick.next(ev);
  }
}

import ng = require('angular2/angular2');
import $ = require('jquery');
import {Contextmenu} from '../contextmenu/Contextmenu';
import {Menu,Item} from '../menu/menu';
import {SideDroppable,Droppable,DynamicDroppable} from '../behavior/droppable';
import {ShadowDragable,Dragable} from '../behavior/dragable';
var activingLeafElement = null;
const tpl = require('./orderable_tree.html');
const css = require('./base_tree.css');
import {BaseTree} from './base_tree';

@ng.Component({
  selector:'orderable-tree',
  properties:['root','isleaftree','index','isLastItem'],
  events:['select','add','remove','copy','childify','drop','dropTop','dropCenter','dropBottom','export']
})

@ng.View({
  template:require('./orderable_tree.html'),styles:[css],
  directives:[ng.formDirectives,ng.coreDirectives,OrdertableTree,Contextmenu,Menu,Item,ShadowDragable
    ,SideDroppable
  ],
  encapsulation:ng.ViewEncapsulation.NONE
})

export class OrdertableTree extends BaseTree{
    dropTop = new ng.EventEmitter();
    dropCenter = new ng.EventEmitter();
    dropBottom = new ng.EventEmitter();
    export = new ng.EventEmitter();

    index:number;
    isLastItem:boolean;

    constructor(el:ng.ElementRef){
      super(el);
    }

      onDrop(ev){
        console.log('tree drop event');
        this.drop.next(ev);
      }

    onTopDrop(ev){
      console.log('tree top drop event');
      this.dropTop.next(ev);
    }

    onBottomDrop(ev){
      console.log('tree bottom drop event');
      this.dropBottom.next(ev);
    }

    onCenterDrop(ev){
      console.log('tree center drop event');
      this.dropCenter.next(ev);
    }

      onLeafNameDoubleClick(leaf){

          var leafElement = this.getThisLeafElement();
          this.toggleLeafSubTree(leafElement);

          this.click.next(leaf);


      }

      onLeafNameClick(leaf){
          var leafElement = this.getThisLeafElement();
          Contextmenu.closeAll();
          this.selectLeaf(leaf);
          this.dblclick.next(leaf);
          this.activeLeafElementShow(leafElement);
      }




    onLeafDropped(ev){
      console.log('DEEP tree drop event');
      this.drop.next(ev);
    }

    onLeafTopDropped(ev){
      console.log('DEEP tree top drop event');
      this.dropTop.next(ev);
    }

      onLeafBottomDropped(ev){
        console.log('DEEP tree bottom drop event');
        this.dropBottom.next(ev);
      }

        onLeafCenterDropped(ev){
          console.log('DEEP tree center drop event');
          this.dropCenter.next(ev);
        }

      exportLeaf(ev){
        console.log('export');
        this.export.next(ev);
      }

}

import ng = require('angular2/angular2');
import $ = require('jquery');
import {Contextmenu} from '../contextmenu/Contextmenu';
import {Menu,Item} from '../menu/menu';
import {SideDroppable,Droppable,DynamicDroppable} from '../behavior/droppable';
import {ShadowDragable,Dragable} from '../behavior/dragable';
var activingLeafElement = null;
const tpl = require('./file_tree.html');
const baseTreeCss = require('./base_tree.css');
const fileTreeCss = require('./file_tree.css');
import {BaseTree} from './base_tree';
import project = require('../../project/project');


@ng.Component({
  selector:'file-tree',
  properties:['root','isleaftree','defaultCloseSubtree','hideFileTypeList'],
  events:['select','add','remove','copy','childify','drop','click','dblclick']
})

@ng.View({
  template:tpl,styles:[baseTreeCss,fileTreeCss],
  directives:[ng.formDirectives,ng.coreDirectives,FileTree,Contextmenu,Menu,Item,ShadowDragable,Dragable
    ,Droppable,DynamicDroppable
  ],
  encapsulation:ng.ViewEncapsulation.NONE
})

export class FileTree extends BaseTree{

  _root;

  hideFileTypeList;

  get root(){
    return this._root;
  }

  set root(root){
    this._root = root;
  }

  get leaf(){
    return this._root;
  }
    isleaftree:boolean;
    defaultCloseSubtree:boolean;
    constructor(el:ng.ElementRef){
      super(el);
    }

    shouldShow(leaf){
      var type = leaf.path.split('.').pop();
      if(!leaf.is_dir && this.hideFileTypeList.indexOf(type)>-1){
        return false;
      }else{
        return true;
      }
    }

    getDisplayStyles(leaf){
      if(this.shouldShow(leaf)){
          return '';
      }else{
          return 'display:none'
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
        if(!leaf.is_dir){
              this.activeLeafElementShow(leafElement);
        }

        this.click.next(leaf);
      }

      addUIFile(leaf){
        debugger;
        project.handleNewUIFile(leaf.parent.path);
      }

      addSceneFile(leaf){
        debugger;
        project.handleNewSceneFile(leaf.parent.path);
      }
}

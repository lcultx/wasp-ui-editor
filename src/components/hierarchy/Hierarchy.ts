import $ = require('jquery');
import {Component, View,ViewEncapsulation} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
import project = require('../project/project');
import template = require('../project/template');
const tpl = require('./hierarchy.html').load();
const css = require('./hierarchy.css').load();
import {OrdertableTree,Menu,Item} from '../dark-ui/ui';
import jQuery = require('jquery');
var global:any = window;
var remote = global.require('remote');
var fs = global.require('fs');
var dialog = remote.require('dialog');

function delArrayItem(array,item){
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function objDeepClone(obj) {
    return jQuery.extend(true, {}, obj);
}

@Component({
  selector: 'hierarchy'
})
@View({
  template: tpl,
  directives:[Menu,Item,OrdertableTree],
  styles: [css],
  encapsulation: ViewEncapsulation.NONE
})
class Hierarchy{
    root:any;
    constructor() {
      this.root =  {
        name:'ROOT'
      }

        project.eventDispatcher.addListener('openFile', (e) => {
            this.root = e.data.fileData.root;
        });

      // var append =   this.root.children;
      // setInterval(()=>{
      //   var obj = {
      //     name:Math.round(Math.random()*100),
      //     children:[]
      //   };
      //   append.push(obj);
      //   append = obj.children;
      // },200)
    }



    getNodeByUUID(tree,uuid){
      if(tree){
        for(var i in tree.children){
          var node = tree.children[i];
          if(node.uuid == uuid){
            return node;
          }else{
            var subNode = this.getNodeByUUID(node,uuid);
              if(subNode){
                return subNode;
              }else{
                continue;
              }
          }
        }
      }
    }



    getParentNodeByUUID(tree,uuid){
      var realParent = null;
      if(tree){
        for(var i in tree.children){
          var node = tree.children[i];
          if(node.uuid == uuid){
            realParent = tree;
            break;
          }else{
            var subParent = this.getParentNodeByUUID(node,uuid);
            if(subParent){
              realParent = subParent;
              break;
            }else{
              continue ;
            }
          }
        }
      }
      return realParent;
    }

    deleteNode(node){
      if(node.uuid){
        var parent = this.getParentNodeByUUID(this.root,node.uuid);
        var node = this.getNodeByUUID(this.root,node.uuid);
        delArrayItem(parent.children,node);
      }
    }

    copyNode(node){
      var parent,node;
      if(node.uuid){
        parent = this.getParentNodeByUUID(this.root,node.uuid);
        node = this.getNodeByUUID(this.root,node.uuid);
        var copyNode = objDeepClone(node);
        copyNode.uuid = template.genUUID();
        copyNode.name = node.name + ' Copy';
        this.deepRefeshUUID(copyNode);
        parent.children.push(copyNode);
      }


    }

      deepRefeshUUID(parent){
            if(parent){
              for(var i in parent.children){
                var node = parent.children[i];
                node.uuid = template.genUUID();
                this.deepRefeshUUID(node);
              }
            }
        }

    childifyNode(desc){
        var childNode = desc.child;
        var newNode = template.createGameObjTemplate(desc.rect);
        var mountNode = null;
        if(childNode.uuid){
          mountNode = this.getParentNodeByUUID(this.root,childNode.uuid);
        }

        if(!newNode.children){
          newNode.children = [];
        }
        newNode.children.push(childNode);

        if(mountNode && !mountNode.children){
          mountNode.children = [];
        }
        if(mountNode.children){
          mountNode.children.push(newNode);
        }

    }

    onSelectNode(node){
      console.log('onSelectNode');
      console.log(node);
      project.handleTreeNodeSelect(node);
    }

    onAddNode(desc){
      console.log('onAddNode');
      var parent = desc.parent;
      if(!parent.children){
        parent.children = [];
      }

      var nodeData = template.createGameObjTemplate(desc.rect);
      template.fillDefaults(nodeData);
      parent.children.push(nodeData);
    }

    onRemoveNode(node){
      console.log('onRemoveNode');
      console.log(node);
      this.deleteNode(node);

    }

    onCopyNode(node){
      console.log('onCopyNode');
      console.log(node);
      this.copyNode(node);
    }

    onChildifyNode(desc){
      console.log('onChildifyNode');
      console.log(desc);
      this.childifyNode(desc);
    }

    isItProgeny(parent,child){
        var isTrue = false;
        if(parent){
          for(var i in parent.children){
            var node = parent.children[i];
            if(node.uuid == child.uuid){
              isTrue = true;
              break;
            }else{
              var isSubChild = this.isItProgeny(node,child);
              if(isSubChild){
                isTrue = true;
                break;
              }else{
                continue ;
              }
            }
          }
        }

        return isTrue;
    }

    isMoveing:boolean = false;
    isExistInRoot(node){
      if(node && this.root){
        return node == this.root || this.isItProgeny(this.root,node);
      }else{
        throw new Error('data is wrong!');
      }
    }
    onNodeDropped(ev){
      console.log('success get drop event');
      if(!this.isMoveing){
        var target = ev.droppable_data;
        var child = ev.dragable_data;

        if(target.children.indexOf(child) == -1
          && target.uuid != child.uuid
          && !this.isItProgeny(child,target) //禁止乱伦！
          && this.isExistInRoot(target) && this.isExistInRoot(child) //maybe angular bug
        ){
          this.isMoveing = true;

          var bakRoot = objDeepClone(this.root);
          this.deleteNode(child);
          setTimeout(()=>{
            try{
                if(!target.children){
                  target.children = [];
                }
                target.children.push(child);
                this.isMoveing = false;
            }catch(e){
              console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',e);
              this.root = bakRoot;
              this.isMoveing = false;
            }

          },50);

        }
      }
    }

    insertBefore(target,source){
      var tagetParent = this.getParentNodeByUUID(this.root,target.uuid);
      var index = tagetParent.children.indexOf(target);
      tagetParent.children.splice(index, 0, source);
    }

    insertAfter(target,source){
      var tagetParent = this.getParentNodeByUUID(this.root,target.uuid);
      var index = tagetParent.children.indexOf(target);
      tagetParent.children.splice(index + 1, 0, source);
    }

    onNodeTopDrop(ev){
        console.log('success get top drop event');
          if(!this.isMoveing){
            var target = ev.droppable_data;
            var child = ev.dragable_data;

            if( target.uuid != this.root.uuid
              && target.uuid != child.uuid
              && !this.isItProgeny(child,target) //禁止乱伦！
              && this.isExistInRoot(target) && this.isExistInRoot(child) //maybe angular bug
            ){
              this.isMoveing = true;

              var bakRoot = objDeepClone(this.root);
              this.deleteNode(child);
              setTimeout(()=>{
                try{
                    this.insertBefore(target,child);
                    this.isMoveing = false;
                }catch(e){
                  console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',e);
                  this.root = bakRoot;
                  this.isMoveing = false;
                }

              },50);

            }
          }
    }

    onNodeCenterDrop(ev){
        console.log('success get center drop event');
        this.onNodeDropped(ev);
    }

    onNodeBottomDrop(ev){
        console.log('success get bottom drop event');
        if(!this.isMoveing){
          var target = ev.droppable_data;
          var child = ev.dragable_data;

          if( target.uuid != this.root.uuid
            && target.uuid != child.uuid
            && !this.isItProgeny(child,target) //禁止乱伦！
            && this.isExistInRoot(target) && this.isExistInRoot(child) //maybe angular bug
          ){
            this.isMoveing = true;

            var bakRoot = objDeepClone(this.root);
            this.deleteNode(child);
            setTimeout(()=>{
              try{
                  this.insertAfter(target,child);
                  this.isMoveing = false;
              }catch(e){
                console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',e);
                this.root = bakRoot;
                this.isMoveing = false;
              }

            },50);

          }
        }
    }

    onNodeExport(ev){
      console.log('onNodeExport')
      var node = ev;
      dialog.showSaveDialog({
          defaultPath: project.currentProjectPath,
          filters: [
            { name: 'Custom File Type', extensions: ['json'] }
          ]
      }, (filename) => {
          console.log(template.uiFileTemplate);
          var ob = JSON.parse(JSON.stringify(template.uiFileTemplate));
          ob.root.children = [node];
          fs.writeFileSync(filename, JSON.stringify(ob, null, '  '), 'utf8');
      });
    }
}

export = Hierarchy;

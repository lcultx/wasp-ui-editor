import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View, ViewEncapsulation, formDirectives, coreDirectives, ElementRef} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
const tpl = require('./visual.html');
const css = require('./visual.css');

var uuidMap = {};

import {
    eventDispatcher,
    getCurrentProjectPath
} from '../project/project';

@Component({
  selector: 'visual'
})
@View({
  template: tpl,
  styles: [css],
  directives: [formDirectives, coreDirectives],
  encapsulation: ViewEncapsulation.NONE,
})
class Visual {

    engineDirector;
    canvas:any;
    editToolsDiv:any;
    editToolsPosDiv:any;
    editToolsColDiv:any;
    scale:number = 50;
    screenSize:string = '960x640';

    updateTimer = null;
    fileData = null;
    dataGameObj = null;

    selectedObjData = null;
    selectedGameObj = null;
    selectedUUID = null;

    pauseUpdateInterval = false;

    mode:string = 'Position';

    playMode:boolean = true;

    mousePos:string = '';

    constructor(private el:ElementRef) {
        this.initCanvas();
        eventDispatcher.addListenerScope('openFile', this.onOpenFile, this);
        eventDispatcher.addListenerScope('openProject', this.onOpenProject, this);
        eventDispatcher.addListener('reload', () => this.reloadStage(this.fileData));
        eventDispatcher.addListenerScope('dataChange', this.onDataChange, this);
        eventDispatcher.addListenerScope('nodeSelect', this.onNodeSelect, this);

        $('.canvas-wrapper').on('mousemove', (e) => {
            this.mousePos = e.offsetX + ',' + e.offsetY;
        });
    }

    initCanvas() {
        WOZLLA.wson.setBuilderFactory(() => {
            return new GameObjectBuilder();
        });
        this.canvas = document.getElementById('visual-canvas');
        this.editToolsDiv = document.getElementById('edit-tools');
        this.editToolsPosDiv = document.getElementById('edit-tools-pos');
        this.editToolsColDiv = document.getElementById('edit-tools-col');
        this.engineDirector = new WOZLLA.Director(this.canvas, { bgColor: [0,0,0,0] });
        this.engineDirector.assetManager.setAssetPathResolver({
            resolvePath(path:string) {
                if(/^\$prj:/i.test(path)) {
                    return 'file://' + getCurrentProjectPath() + '/' + path.substr(5);
                }
                if(/^data:image\/(png|jpg|jpeg);base64/ig.test(path)) {
                    return path;
                }
                return 'file://' + getCurrentProjectPath() + '/tsv2_res/' + path;
            }
        });
        setInterval(() => {
            if(this.pauseUpdateInterval) return;
            this.engineDirector.runStep();
        }, 500);
        this.engineDirector.scheduler.scheduleLoop(() => {
            this.updateEditTools();
        });
        window['director'] = this.engineDirector; // for debug
        this.updateCanvasSize();
        this.updateScale();
        this.initMouseOperations();


    }



    updateCanvasSize() {
        var size = this.screenSize.split('x');
        var width = this.canvas.width = (parseInt(size[0]));
        var height = this.canvas.height = (parseInt(size[1]));
        this.engineDirector.updateViewport({ x:0, y:0, width: width, height: height });
        this.editToolsDiv.style.width = width + 'px';
        this.editToolsDiv.style.height = height + 'px';
        this.updateScale();
    }

    updateScale() {
        var scalePer = this.scale/100;
        var scaleStr = 'scale(' + scalePer + ',' + scalePer + ')'
        var translateStr = 'translate(' + (-this.canvas.width/2) + 'px,' + (-this.canvas.height/2) + 'px' + ')'
        this.canvas.style.transform = translateStr + ' ' + scaleStr;
        this.editToolsDiv.style.transform = translateStr + ' ' + scaleStr;
    }

    initMouseOperations() {
        var mousedown = false;
        var lastX, lastY;
        var startX, startY;
        this.editToolsPosDiv.addEventListener('mousedown', (e) => {
            if(e.altKey) {
                mousedown = true;
                this.pauseUpdateInterval = true;
                this.engineDirector.start();
                lastX = e.pageX;
                lastY = e.pageY;
                startX = e.pageX;
                startY = e.pageY;


                for(let i in this.selectedObjData.components){
                  if(this.selectedObjData.components[i].name == "Sprite9Patch"){
                    let s9c = this.selectedObjData.components[i];
                    let data ;
                    if(s9c.__editor_data){
                      data = s9c.__editor_data;
                    }else{
                      data = {
                        originalRenderWidth:s9c.properties.renderWidth * 1,
                        originalRenderHeight:s9c.properties.renderHeight * 1
                      }
                      s9c.__editor_data = data;
                    }
                  }
                }

            }
        });
        window.addEventListener('mouseup', (e) => {
            mousedown = false;
            this.pauseUpdateInterval = false;
            this.engineDirector.stop();
        });
        window.addEventListener('mousemove', (e) => {
            if(e.altKey && !e.ctrlKey && mousedown && this.selectedObjData) {
                var deltaX = e.pageX - lastX;
                var deltaY = e.pageY - lastY;
                deltaX *= 100/this.scale;
                deltaY *= 100/this.scale;
                lastX = e.pageX;
                lastY = e.pageY;
                if(this.selectedObjData.rect) {
                    this.selectedObjData.transform.px += deltaX;
                    this.selectedObjData.transform.py += deltaY;
                } else {
                    this.selectedObjData.transform.x += deltaX;
                    this.selectedObjData.transform.y += deltaY;
                }
            }

            if(e.altKey && e.ctrlKey && mousedown && this.selectedObjData) {
              if(this.selectedObjData.rect) {
                  let x0 = this.selectedObjData.transform.px ;
                  let y0 = this.selectedObjData.transform.py ;
                  this.updateSelectedObScale((e.pageX - x0)/(startX - x0),(e.pageY - y0)/(startY - y0));
              } else {
                  let x0 = this.selectedObjData.transform.x;
                  let y0 = this.selectedObjData.transform.y;
                  this.updateSelectedObScale((e.pageX - x0)/(startX - x0),(e.pageY - y0)/(startY - y0));
              }
            }

            if(e.altKey && e.ctrlKey && e.shiftKey && mousedown && this.selectedObjData) {
              function max(a,b){
                if(a>b){
                  return a;
                }else{
                  return b;
                }
              }
              let x0:number;
              let y0:number;
              if(this.selectedObjData.rect) {
                  x0 = this.selectedObjData.transform.px ;
                  y0 = this.selectedObjData.transform.py ;
              } else {
                  x0 = this.selectedObjData.transform.x;
                  y0 = this.selectedObjData.transform.y;
              }
              var scaleX = (e.pageX - x0)/(startX - x0);
              var scaleY = (e.pageY - y0)/(startY - y0);
              var maxScale = max(scaleX,scaleY)
              this.updateSelectedObScale(maxScale,maxScale);
            }
        });
    }

    hasSprite9PatchComponent(){
      for(let i in this.selectedObjData.components){
        if(this.selectedObjData.components[i].name == "Sprite9Patch"){
          return true;
        }
      }
    }

    updataSelectObjS9PSize(scaleX,scaleY){

      for(let i in this.selectedObjData.components){
        if(this.selectedObjData.components[i].name == "Sprite9Patch"){
          let s9c = this.selectedObjData.components[i];
          let data ;
          if(s9c.__editor_data){
            data = s9c.__editor_data;
          }else{
            data = {
              originalRenderWidth:s9c.properties.renderWidth * 1,
              originalRenderHeight:s9c.properties.renderHeight * 1
            }
            s9c.__editor_data = data;
          }

          s9c.properties.renderWidth = Math.round(data.originalRenderWidth*scaleX) + "";
          s9c.properties.renderHeight = Math.round(data.originalRenderHeight*scaleY) + "";
        }
      }
    }

    updateSelectedObScale(scaleX,scaleY){
      if(this.hasSprite9PatchComponent()){
        this.updataSelectObjS9PSize(scaleX,scaleY);
      }else{
        this.selectedGameObj.transform.scaleX = scaleX;
        this.selectedObjData.transform.scaleX = scaleX;
        this.selectedGameObj.transform.scaleY = scaleY;
        this.selectedObjData.transform.scaleY = scaleY;
      }
    }

    updateEditTools() {
        if(this.selectedGameObj) {
            let cssMatrix = toCssMatrix(this.selectedGameObj.transform.worldMatrix,  this.engineDirector.stage.domScale);
            this.editToolsPosDiv.style.display = 'block';
            this.editToolsPosDiv.style.transform = cssMatrix;

            let collider = this.selectedGameObj.collider;
            if(collider) {
                this.editToolsColDiv.style.display = 'block';
                this.editToolsColDiv.style.transform = cssMatrix;
                if(collider instanceof WOZLLA.component.RectCollider) {
                    this.editToolsColDiv.style.width = collider.width.get() + 'px';
                    this.editToolsColDiv.style.height = collider.height.get() + 'px';
                    this.editToolsColDiv.style.left = collider.x.get() + 'px';
                    this.editToolsColDiv.style.top = collider.y.get() + 'px';
                    this.editToolsColDiv.style.borderRadius = '0px';
                } else if(collider instanceof WOZLLA.component.CircleCollider) {
                    let radius = collider.radius.get();
                    this.editToolsColDiv.style.left = (collider.centerX.get() - radius) + 'px';
                    this.editToolsColDiv.style.top = (collider.centerY.get() - radius) + 'px';
                    this.editToolsColDiv.style.width = (radius*2) + 'px';
                    this.editToolsColDiv.style.height = (radius*2) + 'px';
                    this.editToolsColDiv.style.borderRadius = radius + 'px';
                } else {
                    this.editToolsColDiv.style.display = 'none';
                }
            } else {
                this.editToolsColDiv.style.display = 'none';
            }
        } else {
            this.editToolsPosDiv.style.display = 'none';
            this.editToolsColDiv.style.display = 'none';
        }
    }

    onNodeSelect(e) {
        var objData = e.data.node;
        this.selectedObjData = objData;
        this.selectedUUID = objData.uuid;
        this.selectedGameObj = objData && uuidMap[objData.uuid];
    }

    onOpenFile(e) {
        this.reloadStage(e.data.fileData);
        this.fileData = e.data.fileData;
    }

    onOpenProject(e) {
        // this.engineDirector.assetManager.setBaseURL('file://' + getCurrentProjectPath() + '/');
    }

    onReloadClick(timestamp?:number) {
      // if(this.playMode){
      //
      //   requestAnimationFrame((timestamp)=>{
      //     this.onReloadClick(timestamp)
      //   });
      // }
      // console.log(timestamp)
      // console.log(this.fileData)
        this.reloadStage(this.fileData);
    }

    onDataChange(e) {
        if(!this.selectedGameObj) return;
        var changes = e.data.changes;
        var needReload = false;
        var needLoadAsset = false;
        for(let change of changes) {
            if(change.op !== 'replace') {
                needReload = true;
                break;
            }
            let paths = change.path.split('/');
            if(paths[paths.length-2] === 'transform') {
                let key = paths[paths.length-1];
                let data = {};
                if(key === 'relative' || key === 'anchorMode') {
                    data[key] = change.value;
                } else {
                    data[key] = parseFloat(change.value);
                }
                for(let key in data) {
                    this.selectedGameObj.transform[key] = data[key];
                }
            } else if(paths[paths.length-4] === 'components' && paths[paths.length-2] === 'properties') {
                // var compIdx = parseInt(paths[paths.length-3]);
                // var compData = this.selectedObjData.components[compIdx];
                // var compName = compData.name;
                // var type = WOZLLA.component.ComponentFactory.getType(compName);
                // var component = this.selectedGameObj.getComponent(type);
                // var propertyName = paths[paths.length-1];
                // var propAnno = WOZLLA.component.ComponentFactory.getAnnotation(compName).getPropertyAnnotation(propertyName);
                // var value = change.value;
                // if(propAnno.propertyType === WOZLLA.component.Type.Int) {
                //     value = parseInt(value);
                // } else if(propAnno.propertyType === WOZLLA.component.Type.Number) {
                //     value = parseFloat(value);
                // }
                // component[propertyName].convert(change.value);
                // this.selectedGameObj.transform.dirty = true;
                needLoadAsset = true;
            }
        }
        if(needReload) {
            this.reloadStage(this.fileData);
        } else if(needLoadAsset) {
            this.selectedGameObj.loadAssets();
        }
    }

    reloadStage(data) {
        var director = this.engineDirector;
        this.updateTimer && clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.updateTimer = null;
            if(!data.root || typeof data.root !== 'object') {
                return;
            }
            var wsonBuilder = WOZLLA.wson.newBuilder();
            uuidMap = {};
            wsonBuilder.buildWithData(director, data, (err, gameObj) => {
                if(err) {
                    console.log(err);
                    return;
                }
                gameObj.loadAssets(() => {
                    gameObj.init();
                });
                this.dataGameObj && this.dataGameObj.destroyAndRemove();
                this.dataGameObj = gameObj;
                director.stage.addChild(gameObj);
                if(this.selectedUUID) {
                    this.selectedGameObj = uuidMap[this.selectedUUID];
                }
            });
        }, 400);
    }

}


class GameObjectBuilder extends WOZLLA.wson.WSONBuilder {

    buildGameObject(director:WOZLLA.Director, data:any, callback:(error:any, root:WOZLLA.GameObject) => void) {
        super.buildGameObject(director, data, (err, root:WOZLLA.GameObject) => {
            uuidMap[data.uuid] = root;
            callback(err, root);
        });
    }

    buildComponent(data:any, owner:WOZLLA.GameObject):WOZLLA.Component {
        var compName = data.name;
        var compAnno = WOZLLA.component.ComponentFactory.getAnnotation(compName);
        var properties = data.properties;
        var component = this.newComponent(compName);
        for(let prop in properties) {
            let property = component[prop];
            if(property) {
                let value = properties[prop];
                let propAnno = compAnno.getPropertyAnnotation(prop);
                if(propAnno && propAnno.propertyType === WOZLLA.component.Type.Int) {
                    value = parseInt(value);
                } else if(propAnno && propAnno.propertyType === WOZLLA.component.Type.Number) {
                    value = parseFloat(value);
                }
                property.convert(value);
            }
        }
        return component;
    }

    newGameObject(director:WOZLLA.Director, useRectTransform:boolean=false):WOZLLA.GameObject {
        return new WOZLLA.GameObject(director, useRectTransform);
    }

    newComponent(compName:string):WOZLLA.Component {
        return WOZLLA.component.ComponentFactory.create(compName);
    }

}

const helpMatrix:WOZLLA.math.Matrix3x3 = new WOZLLA.math.Matrix3x3();

function toCssMatrix(matrix:WOZLLA.math.Matrix3x3, scale:number=1):string {
    var m = helpMatrix;
    m.identity();
    m.appendTransform(0, 0, scale, scale);
    m.append(1, matrix.c, matrix.b, 1, matrix.tx, matrix.ty);
    // m.appendTransform(0, 0, 1/gameObjScale, 1/gameObjScale);
    return `matrix(${m.a},${m.c},${m.b},${m.d},${m.tx},${m.ty})`;
}

export = Visual;

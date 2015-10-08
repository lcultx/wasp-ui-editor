import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View, ViewEncapsulation, coreDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
import BasicPanel = require('./panel/BasicPanel');
import TransformPanel = require('./panel/TransformPanel');
import ComponentPanel = require('./panel/ComponentPanel');
import {fillDefaults} from '../project/template';

var CompFactory = WOZLLA.component.ComponentFactory;

import {
    eventDispatcher,
    getCurrentProjectPath
} from '../project/project';

const tpl = require('./inspector.html');
const css = require('./inspector.css');



@Component({
  selector: 'inspector'
})
@View({
  template: tpl,
  styles: [css],
  directives: [BasicPanel, TransformPanel, ComponentPanel, coreDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class Inspector {

    objData:any;

    constructor() {
        // eventDispatcher.addListener('openFile', (e) => {
        //     var objData = e.data.fileData.root;
        //     this._fillDefaults(objData);
        //     this.objData = objData;
        // });
        eventDispatcher.addListener('nodeSelect', (e) => {
            var objData = e.data.node;
            fillDefaults(objData);
            this.objData = null;
            setTimeout(() => this.objData = objData, 1);
        });
        eventDispatcher.addListener('componentAdd', (e) => {
            var name = e.data.name;
            this.objData.components = this.objData.components || [];
            this.objData.components.push({
                name: name,
                properties: {}
            });
            fillDefaults(this.objData, false);
        });
    }

    onAddCompBtnClick() {
        $('component-selector').show();
    }

    _getPropertyAnnos(compData) {
        var ret = [];
        var compName = compData.name;
        while(compName) {
            let compAnno = CompFactory.getAnnotation(compName);
            for(let propAnno of compAnno.properties) {
                ret.push(propAnno);
            }
            let superClass = CompFactory.getSuperClass(CompFactory.getType(compName));
            if(superClass) {
                compName = CompFactory.getName(superClass);
            } else {
                compName = null;
            }
        }
        return ret;
    }

}

export = Inspector;

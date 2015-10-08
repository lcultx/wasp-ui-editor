import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View, coreDirectives, formDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
import Panel = require('./Panel');
import ProjectFileField = require('../field/ProjectFileField');
import JsonField = require('../field/JsonField');
import SpriteSelector = require('../SpriteSelector');
import {setSavable} from '../../project/project';
const tpl = require('./component-panel.html');

var CompFactory = WOZLLA.component.ComponentFactory;

var tempValue = null;

@Component({
  selector: 'component-panel',
  properties: ['objdata', 'compdata', 'title']
})
@View({
  template: tpl,
  styles: [],
  directives: [SpriteSelector, Panel, coreDirectives, formDirectives, ProjectFileField, JsonField]
})
class ComponentPanel {

    objdata;
    compdata;
    ptype:any = WOZLLA.component.Type;

    constructor() {
    }

    getPropertyAnnos() {
        var ret = [];
        var compName = this.compdata.name;
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

    onPropertyChange(prop) {
    }

    onClick(e) {
        if($(e.target).hasClass('close-btn')) {
            if(window.confirm('确认删除？')) {
                let idx = this.objdata.components.indexOf(this.compdata);
                this.objdata.components.splice(idx, 1);
            }
        }
    }
    getValueFromComponentData(compdata,propertyName){
        var value = compdata.properties[propertyName];
        if(value) {
            tempValue = value;
            return value;
        }
        if(tempValue){
            value = tempValue;
            compdata.properties[propertyName] = value;
        }
        return value;
    }

}

export = ComponentPanel;

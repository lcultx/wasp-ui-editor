import $ = require('jquery');
import {Component, View, coreDirectives, formDirectives} from 'angular2/angular2';
import ng2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');

import {
    showProjectFileChooser
} from '../../project/project';

@Component({
  selector: 'prj-file-field',
  properties: ['property', 'value', 'compdata']
})
@View({
  template: `<input readonly="true" [(ng-model)]="value" (click)="onClick()">`,
  styles: [],
  directives: [coreDirectives, formDirectives]
})
class ProjectFileField {

    compdata:any;
    value:string;
    property:string;

    constructor() {
    }

    onClick() {
        showProjectFileChooser((filename) => {
            this.compdata.properties = this.compdata.properties || {};
            this.value = filename;
            console.log(filename);
            this.compdata.properties[this.property] = filename;
        });
    }

}

export = ProjectFileField;

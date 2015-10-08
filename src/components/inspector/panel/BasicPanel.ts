import $ = require('jquery');
import {Component, View, coreDirectives, formDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
import Panel = require('./Panel');
const tpl = require('./basic-panel.html');

@Component({
  selector: 'basic-panel',
  properties: ['objdata']
})
@View({
  template: tpl,
  styles: [],
  directives: [Panel, coreDirectives, formDirectives]
})
class BasicPanel {

    objdata;

    constructor() {
    }

    logData() {
        console.log(this.objdata);
    }
}

export = BasicPanel;

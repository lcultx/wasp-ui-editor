import $ = require('jquery');
import {Component, View, coreDirectives, formDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
import Panel = require('./Panel');
import AnchorModeField = require('../field/AnchorModeField');
const tpl = require('./transform-panel.html');

@Component({
  selector: 'transform-panel',
  properties: ['objdata']
})
@View({
  template: tpl,
  styles: [],
  directives: [AnchorModeField, Panel, coreDirectives, formDirectives]
})
class TransformPanel {

    objdata;

    constructor() {
    }
}

export = TransformPanel;

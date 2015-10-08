import $ = require('jquery');
import {Component, View, ViewEncapsulation, coreDirectives, formDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
const tpl = require('./panel.html');
const css = require('./panel.css');

@Component({
  selector: 'panel',
  properties: ['title', 'closable']
})
@View({
  template: tpl,
  styles: [css],
  directives: [coreDirectives, formDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class Panel {

    constructor() {

    }

}

export = Panel;

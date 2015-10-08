import $ = require('jquery');
import {Component, View, ViewEncapsulation, coreDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');


const tpl = require('./dialog.html');
const css = require('./dialog.css');

@Component({
  selector: 'ide-dialog',
  properties: ['title']
})
@View({
  template: tpl,
  styles: [css],
  directives: [coreDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class Dialog {

    constructor() {
    }

}

export = Dialog;

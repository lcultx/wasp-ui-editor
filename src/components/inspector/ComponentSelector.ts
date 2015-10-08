import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View, ViewEncapsulation, coreDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
import BasicPanel = require('./panel/BasicPanel');
import Dialog = require('../dark-ui/dialog/Dialog');
import TransformPanel = require('./panel/TransformPanel');
import ComponentPanel = require('./panel/ComponentPanel');

var CompFactory = WOZLLA.component.ComponentFactory;

import {
    eventDispatcher,
    getCurrentProjectPath,
    handleAddComponent
} from '../project/project';

const tpl = require('./component-selector.html');
const css = require('./component-selector.css');


@Component({
  selector: 'component-selector'
})
@View({
  template: tpl,
  styles: [css],
  directives: [Dialog, coreDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class ComponentSelector {

    $root;
    $selectedItem;

    constructor() {
        this.$root = $('component-selector');
        this.$root.hide();
    }

    getComponentNames():string[] {
        var ret = [];
        CompFactory.eachComponent((name:string) => {
            ret.push(name);
        });
        return ret;
    }

    onItemClick(e) {
        this.$selectedItem && this.$selectedItem.removeClass('selected');
        this.$selectedItem = $(e.target);
        this.$selectedItem.addClass('selected');
    }

    onItemDblClick(e) {
        this.onConfirmSelect();
    }

    onClick(e) {
        var $target = $(e.target);
        if($target.hasClass('ok')) {
            this.onConfirmSelect();
        } else if($target.hasClass('cancel')) {
            $('component-selector').hide();
        }
    }

    onConfirmSelect() {
        if(!this.$selectedItem) return;
        this.$root.hide();
        handleAddComponent(this.$selectedItem.text().trim());
    }
}

export = ComponentSelector;

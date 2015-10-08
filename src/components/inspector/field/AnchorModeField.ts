import $ = require('jquery');
import {Component, View, coreDirectives, formDirectives, ViewEncapsulation} from 'angular2/angular2';
import ng2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
import {
    showProjectFileChooser
} from '../../project/project';

const tpl = require('./anchor-mode-field.html');
const css = require('./anchor-mode-field.css');

@Component({
  selector: 'anchor-mode-field',
  properties: ['objdata']
})
@View({
  template: tpl,
  styles: [css],
  directives: [coreDirectives, formDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class AnchorModeField {

    $root;
    $selector;
    $selectedItem;
    objdata;

    constructor(el:ng2.ElementRef) {
        var me = this;
        this.$root = $(el.nativeElement);
        this.$selector = this.$root.find('.anchor-mode-selector');
        this.$selector.hide();
        this.$root.click((e) => {
            e.stopPropagation();
        });
        $(document).click((e) => {
            this.$selector.hide();
        });
    }

    onClick() {
        this.$selector.find('.item').removeClass('selected');
        this.$selectedItem = this.$selector.find(`.item[value="${this.objdata.transform.anchorMode}"]`);
        this.$selectedItem.addClass('selected');
        this.$selector.show();
    }

    onSelectorClick($event) {
        this.$selectedItem.removeClass('selected');
        this.$selectedItem = $($event.target).closest('.item');;
        $(this.$selectedItem).addClass('selected');
        this.objdata.transform.anchorMode = this.$selectedItem.attr('value');
    }
}

export = AnchorModeField;

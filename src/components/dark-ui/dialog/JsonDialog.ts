import $ = require('jquery');
import {Component, ElementRef, View, ViewEncapsulation, coreDirectives} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import Dialog = require('./Dialog');


const tpl = require('./json-dialog.html');
const css = require('./json-dialog.css');

declare var ace:any;

@Component({
  selector: 'json-dialog',
  properties: ['title', 'jsonprovider']
})
@View({
  template: tpl,
  styles: [css],
  directives: [coreDirectives, Dialog],
  encapsulation: ViewEncapsulation.NONE
})
export class JsonDialog {

    $el;

    jsonprovider:IJsonProvider;

    editor;

    constructor(private el:ElementRef) {
        this.$el = $(el.nativeElement);
        var editorEl = el.nativeElement.querySelector('.editor');
        var editor = ace.edit(editorEl);
        var JsonMode = ace.require("ace/mode/json").Mode;
        editor.getSession().setMode(new JsonMode());
        editor.setTheme("ace/theme/terminal");
        this.$el.hide();
        this.editor = editor;

        if(this.$el.attr('show-action') === 'before:click') {
            this.$el.prev().click(() => {
                this.$el.show();
                console.log(this.jsonprovider);
                this.editor.setValue(JSON.stringify(this.jsonprovider.data, null, '  '));
            });
        }
    }

    onClick(e) {
        var $target = $(e.target);
        if($target.hasClass('ok')) {
            try {
                var data = JSON.parse(this.editor.getValue());
                this.jsonprovider.data = data;
                this.$el.hide();
            } catch(e) {
                alert(e.message);
            }
        } else if($target.hasClass('cancel')) {
            this.$el.hide();
        }
    }

}

export interface IJsonProvider {
    data:any;
}

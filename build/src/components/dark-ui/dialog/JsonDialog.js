var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var $ = require('jquery');
var angular2_1 = require('angular2/angular2');
var Dialog = require('./Dialog');
var tpl = require('./json-dialog.html');
var css = require('./json-dialog.css');
var JsonDialog = (function () {
    function JsonDialog(el) {
        var _this = this;
        this.el = el;
        this.$el = $(el.nativeElement);
        var editorEl = el.nativeElement.querySelector('.editor');
        var editor = ace.edit(editorEl);
        var JsonMode = ace.require("ace/mode/json").Mode;
        editor.getSession().setMode(new JsonMode());
        editor.setTheme("ace/theme/terminal");
        this.$el.hide();
        this.editor = editor;
        if (this.$el.attr('show-action') === 'before:click') {
            this.$el.prev().click(function () {
                _this.$el.show();
                console.log(_this.jsonprovider);
                _this.editor.setValue(JSON.stringify(_this.jsonprovider.data, null, '  '));
            });
        }
    }
    JsonDialog.prototype.onClick = function (e) {
        var $target = $(e.target);
        if ($target.hasClass('ok')) {
            try {
                var data = JSON.parse(this.editor.getValue());
                this.jsonprovider.data = data;
                this.$el.hide();
            }
            catch (e) {
                alert(e.message);
            }
        }
        else if ($target.hasClass('cancel')) {
            this.$el.hide();
        }
    };
    JsonDialog = __decorate([
        angular2_1.Component({
            selector: 'json-dialog',
            properties: ['title', 'jsonprovider']
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [angular2_1.coreDirectives, Dialog],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [angular2_1.ElementRef])
    ], JsonDialog);
    return JsonDialog;
})();
exports.JsonDialog = JsonDialog;
//# sourceMappingURL=JsonDialog.js.map
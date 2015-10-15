var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var $ = require('jquery');
var WOZLLA = require('wozllajs');
var angular2_1 = require('angular2/angular2');
var Dialog = require('../dark-ui/dialog/Dialog');
var CompFactory = WOZLLA.component.ComponentFactory;
var project_1 = require('../project/project');
var tpl = require('./component-selector.html');
var css = require('./component-selector.css');
var ComponentSelector = (function () {
    function ComponentSelector() {
        this.$root = $('component-selector');
        this.$root.hide();
    }
    ComponentSelector.prototype.getComponentNames = function () {
        var ret = [];
        CompFactory.eachComponent(function (name) {
            ret.push(name);
        });
        return ret;
    };
    ComponentSelector.prototype.onItemClick = function (e) {
        this.$selectedItem && this.$selectedItem.removeClass('selected');
        this.$selectedItem = $(e.target);
        this.$selectedItem.addClass('selected');
    };
    ComponentSelector.prototype.onItemDblClick = function (e) {
        this.onConfirmSelect();
    };
    ComponentSelector.prototype.onClick = function (e) {
        var $target = $(e.target);
        if ($target.hasClass('ok')) {
            this.onConfirmSelect();
        }
        else if ($target.hasClass('cancel')) {
            $('component-selector').hide();
        }
    };
    ComponentSelector.prototype.onConfirmSelect = function () {
        if (!this.$selectedItem)
            return;
        this.$root.hide();
        project_1.handleAddComponent(this.$selectedItem.text().trim());
    };
    ComponentSelector = __decorate([
        angular2_1.Component({
            selector: 'component-selector'
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [Dialog, angular2_1.coreDirectives],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [])
    ], ComponentSelector);
    return ComponentSelector;
})();
module.exports = ComponentSelector;
//# sourceMappingURL=ComponentSelector.js.map
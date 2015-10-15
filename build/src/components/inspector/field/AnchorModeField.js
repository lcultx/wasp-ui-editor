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
var angular2_1 = require('angular2/angular2');
var ng2 = require('angular2/angular2');
var tpl = require('./anchor-mode-field.html');
var css = require('./anchor-mode-field.css');
var AnchorModeField = (function () {
    function AnchorModeField(el) {
        var _this = this;
        var me = this;
        this.$root = $(el.nativeElement);
        this.$selector = this.$root.find('.anchor-mode-selector');
        this.$selector.hide();
        this.$root.click(function (e) {
            e.stopPropagation();
        });
        $(document).click(function (e) {
            _this.$selector.hide();
        });
    }
    AnchorModeField.prototype.onClick = function () {
        this.$selector.find('.item').removeClass('selected');
        this.$selectedItem = this.$selector.find(".item[value=\"" + this.objdata.transform.anchorMode + "\"]");
        this.$selectedItem.addClass('selected');
        this.$selector.show();
    };
    AnchorModeField.prototype.onSelectorClick = function ($event) {
        this.$selectedItem.removeClass('selected');
        this.$selectedItem = $($event.target).closest('.item');
        ;
        $(this.$selectedItem).addClass('selected');
        this.objdata.transform.anchorMode = this.$selectedItem.attr('value');
    };
    AnchorModeField = __decorate([
        angular2_1.Component({
            selector: 'anchor-mode-field',
            properties: ['objdata']
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [angular2_1.coreDirectives, angular2_1.formDirectives],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng2.ElementRef])
    ], AnchorModeField);
    return AnchorModeField;
})();
module.exports = AnchorModeField;
//# sourceMappingURL=AnchorModeField.js.map
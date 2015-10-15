var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
console.log('##########################################');
var System = window.System;
var ng = require('angular2/angular2');
var $ = require('jquery');
var css = require('./menu.css');
var hoverOpenMenuList = [];
console.log(ng, ng.Component);
var Menu = (function () {
    function Menu(el) {
        var _this = this;
        this.el = el;
        this.$element = $(el.nativeElement);
        var showAction = this.$element.attr('show-action');
        if (showAction == "parent:hover") {
            var parent = this.$element.parent();
            parent.hover(function (e) {
                Menu.closeAlHoverMenu();
                var offset = parent.offset();
                _this.$element.css({
                    position: 'fixed', top: offset.top, left: offset.left + parent[0].scrollWidth
                });
                _this.open();
                hoverOpenMenuList.push(_this);
            }, function (e) {
            });
        }
    }
    Menu.prototype.open = function () {
        this.$element.show();
    };
    Menu.prototype.close = function () {
        this.$element.hide();
    };
    Menu.closeAlHoverMenu = function () {
        for (var i in hoverOpenMenuList) {
            var menu = hoverOpenMenuList[i];
            menu.close();
        }
    };
    Menu = __decorate([
        ng.Component({
            selector: 'menu'
        }),
        ng.View({
            template: "\n  <ul>\n    <ng-content></ng-content>\n  </ul>\n\n  ", styles: [css], encapsulation: ng.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], Menu);
    return Menu;
})();
exports.Menu = Menu;
var Item = (function () {
    function Item(el) {
        this.el = el;
        this.$element = $(el.nativeElement);
    }
    Item = __decorate([
        ng.Component({
            selector: 'item'
        }),
        ng.View({
            template: "\n  <li>\n    <ng-content></ng-content>\n  </li>\n  ",
            directives: []
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], Item);
    return Item;
})();
exports.Item = Item;
//# sourceMappingURL=menu.js.map
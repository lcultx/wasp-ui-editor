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
var ng = require('angular2/angular2');
var $ = require('jquery');
var css = require('./menu.css');
var hoverOpenMenuList = [];
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
                //this.$element.hide()
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
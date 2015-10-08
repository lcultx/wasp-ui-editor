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
var openingContextmenu = null;
var Contextmenu = (function () {
    function Contextmenu(el) {
        var _this = this;
        this.el = el;
        this.$element = $(el.nativeElement);
        var $parent = this.$element.parent();
        $parent.on('contextmenu', function (e) {
            _this.draw(e.pageX, e.pageY);
        });
    }
    Contextmenu.prototype.open = function (top, left) {
        var contentmenu = this.$element.children('.contextmenu');
        contentmenu.show();
        contentmenu.css({
            position: 'fixed', left: left, top: top
        });
    };
    Contextmenu.prototype.close = function () {
        this.$element.children('.contextmenu').hide();
    };
    Contextmenu.closeAll = function () {
        if (openingContextmenu) {
            openingContextmenu.close();
        }
    };
    Contextmenu.prototype.draw = function (pageX, pageY) {
        if (openingContextmenu) {
            openingContextmenu.close();
        }
        openingContextmenu = this;
        openingContextmenu.open(pageY, pageX);
    };
    Contextmenu = __decorate([
        ng.Component({
            selector: 'contextmenu'
        }),
        ng.View({
            template: require('./contextmenu.html'), styles: [require('./contextmenu.css')],
            encapsulation: ng.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], Contextmenu);
    return Contextmenu;
})();
exports.Contextmenu = Contextmenu;
//# sourceMappingURL=Contextmenu.js.map
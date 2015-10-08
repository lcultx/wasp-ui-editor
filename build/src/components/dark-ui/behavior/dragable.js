var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ng = require('angular2/angular2');
var $ = require('jquery');
var service_1 = require("../../event/service");
var Dragable = (function () {
    function Dragable(el, eventService) {
        var _this = this;
        this.el = el;
        this.isMousePushing = false;
        this.isDragging = false;
        this.elementStartX = 0;
        this.elementStartY = 0;
        this.mouseStartX = 0;
        this.mouseStartY = 0;
        this.sens = 5;
        this.eventService = eventService;
        this.$element = $(el.nativeElement);
        $('html').mouseup(function (ev) {
            _this._onMouseUp(ev.originalEvent);
        });
        $('html').mousemove(function (ev) {
            _this._onMouseMove(ev.originalEvent);
        });
    }
    Dragable.prototype._onMouseDown = function (ev) {
        ev.stopPropagation();
        this.isMousePushing = true;
        this.mouseStartX = ev.pageX;
        this.mouseStartY = ev.pageY;
        this.elementStartX = this.$element.offset().left;
        this.elementStartY = this.$element.offset().top;
        this.$movingElement = this.$element;
    };
    Dragable.prototype._onMouseUp = function (ev) {
        if (this.isDragging) {
            this.eventService.emit('dragstop', { data: { ev: ev, el: this.el, data: this.data } });
        }
        this.isMousePushing = false;
        this.isDragging = false;
    };
    Dragable.prototype.move = function (deltaX, deltaY) {
        this.$movingElement.css({
            'position': 'fixed',
            'top': this.elementStartY + deltaY,
            'left': this.elementStartX + deltaX,
            'z-index': 10000
        });
    };
    Dragable.prototype._onMouseMove = function (ev) {
        if (this.isMousePushing) {
            var deltaX = ev.pageX - this.mouseStartX;
            var deltaY = ev.pageY - this.mouseStartY;
            if (deltaX > this.sens || deltaX < 0 - this.sens || deltaY > this.sens || deltaY < 0 - this.sens) {
                this.isDragging = true;
                this.eventService.emit('dragmove', { data: { ev: ev, el: this.el, data: this.data } });
                this.move(deltaX, deltaY);
            }
        }
    };
    Dragable = __decorate([
        ng.Directive({
            selector: '[dragable]',
            host: {
                '(^mousedown)': '_onMouseDown($event)'
            }, properties: ['data', 'shadowclass']
        }),
        __param(1, ng.Inject(service_1.EventService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_1.EventService])
    ], Dragable);
    return Dragable;
})();
exports.Dragable = Dragable;
var ShadowDragable = (function (_super) {
    __extends(ShadowDragable, _super);
    function ShadowDragable(el, eventService) {
        _super.call(this, el, eventService);
    }
    ShadowDragable.prototype.makeShadow = function () {
        this.$shadow = this.$element.clone()
            .addClass(this.draggingAddClass).removeClass(this.draggingRemoveClass);
        this.hideShadow();
        this.$element.parent().append(this.$shadow);
    };
    ShadowDragable.prototype.showShadow = function () {
        this.$shadow.show();
    };
    ShadowDragable.prototype.hideShadow = function () {
        this.$shadow.hide();
    };
    ShadowDragable.prototype.clearShadow = function () {
        if (this.$shadow) {
            this.$shadow.remove();
        }
    };
    ShadowDragable.prototype._onMouseDown = function (ev) {
        _super.prototype._onMouseDown.call(this, ev);
        this.makeShadow();
        this.$movingElement = this.$shadow;
    };
    ShadowDragable.prototype._onMouseUp = function (ev) {
        _super.prototype._onMouseUp.call(this, ev);
        this.clearShadow();
    };
    ShadowDragable.prototype.move = function (deltaX, deltaY) {
        _super.prototype.move.call(this, deltaX, deltaY);
        this.showShadow();
    };
    ShadowDragable = __decorate([
        ng.Directive({
            selector: '[shadow-dragable]',
            host: {
                '(^mousedown)': '_onMouseDown($event)',
            }, properties: ['data', 'draggingAddClass', 'draggingRemoveClass']
        }),
        __param(1, ng.Inject(service_1.EventService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_1.EventService])
    ], ShadowDragable);
    return ShadowDragable;
})(Dragable);
exports.ShadowDragable = ShadowDragable;
//# sourceMappingURL=dragable.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var $areaShowElement = $('<div>');
$areaShowElement.appendTo($('body'));
var Droppable = (function () {
    function Droppable(el, eventService) {
        this.el = el;
        this.drop = new ng.EventEmitter();
        this.$element = $(el.nativeElement);
        this.eventService = eventService;
        this.listenDragStop();
    }
    Droppable.prototype.listenDragStop = function () {
        var _this = this;
        this.eventService.on('dragstop', function (e) {
            var ev = e.data.ev;
            if (_this.isMouseAtHere(ev)) {
                _this.clearShow();
                if (_this.data != e.data.data) {
                    _this.drop.next({
                        ev: ev,
                        e: e,
                        droppable: _this.el,
                        dragable: e.data.el,
                        droppable_data: _this.data,
                        dragable_data: e.data.data
                    });
                }
            }
        });
    };
    Droppable.prototype.showHere = function () {
        if (!this.isShowingAreaElement) {
            $areaShowElement.css({
                position: 'fixed',
                width: this.el.nativeElement.scrollWidth,
                height: this.el.nativeElement.scrollHeight,
                top: this.$element.offset().top,
                left: this.$element.offset().left,
                background: 'rgba(255, 0, 0, 0.3)'
            }).show();
            this.isShowingAreaElement = true;
        }
    };
    Droppable.prototype.clearShow = function () {
        console.log('clearShow');
        if (this.isShowingAreaElement) {
            $areaShowElement.hide();
            this.isShowingAreaElement = false;
        }
    };
    Droppable.prototype.isMouseAtHere = function (ev) {
        var x = ev.pageX, y = ev.pageY;
        var offset = this.$element.offset();
        var nativeElement = this.$element[0];
        if ((offset.left < x && (offset.left + nativeElement.scrollWidth) > x) &&
            (offset.top < y && (offset.top + nativeElement.scrollHeight) > y)) {
            return true;
        }
        else {
            return false;
        }
    };
    Droppable = __decorate([
        ng.Directive({
            selector: '[droppable]',
            events: ['drop'], properties: ['data']
        }),
        __param(1, ng.Inject(service_1.EventService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_1.EventService])
    ], Droppable);
    return Droppable;
})();
exports.Droppable = Droppable;
var DynamicDroppable = (function (_super) {
    __extends(DynamicDroppable, _super);
    function DynamicDroppable(el, eventService) {
        var _this = this;
        _super.call(this, el, eventService);
        this.isMouseHaveBeenHere = false;
        this.dropenter = new ng.EventEmitter();
        this.dropleave = new ng.EventEmitter();
        this.dropmove = new ng.EventEmitter();
        this.eventService.on('dragmove', function (e) {
            var ev = e.data.ev;
            var isMouseHere = _this.isMouseAtHere(ev);
            if (isMouseHere && _this.data != e.data.data) {
                if (_this.isMouseHaveBeenHere) {
                    _this.dropmove.next(e.data);
                }
                else {
                    _this.showHere();
                    _this.dropenter.next(e.data);
                }
            }
            else {
                if (_this.isMouseHaveBeenHere) {
                    _this.clearShow();
                    _this.dropleave.next(e.data);
                }
            }
            _this.isMouseHaveBeenHere = isMouseHere;
        });
    }
    DynamicDroppable = __decorate([
        ng.Directive({
            selector: '[dynamic-droppable]',
            events: ['dropenter', 'dropleave', 'dropmove', 'drop'], properties: ['data']
        }),
        __param(1, ng.Inject(service_1.EventService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_1.EventService])
    ], DynamicDroppable);
    return DynamicDroppable;
})(Droppable);
exports.DynamicDroppable = DynamicDroppable;
var SideDroppable = (function (_super) {
    __extends(SideDroppable, _super);
    function SideDroppable(el, eventService) {
        _super.call(this, el, eventService);
        this.mouseHaveBeenArea = null;
        this.dropEnterTop = new ng.EventEmitter();
        this.dropEnterBottom = new ng.EventEmitter();
        this.dropEnterCenter = new ng.EventEmitter();
        this.dropleave = new ng.EventEmitter();
        this.dropmove = new ng.EventEmitter();
        this.dropTop = new ng.EventEmitter();
        this.dropCenter = new ng.EventEmitter();
        this.dropBottom = new ng.EventEmitter();
        this.isMouseHaveBeenHere = false;
        this.listenDragMove();
    }
    SideDroppable.prototype.listenDragStop = function () {
        var _this = this;
        this.eventService.on('dragstop', function (e) {
            var ev = e.data.ev;
            var mouseArea = _this.getMouseArea(ev);
            if (mouseArea && _this.data != e.data.data) {
                var data = {
                    ev: ev,
                    e: e,
                    droppable: _this.el,
                    dragable: e.data.el,
                    droppable_data: _this.data,
                    dragable_data: e.data.data
                };
                if (mouseArea == 'top') {
                    if (_this.shouldOpenTopInsert()) {
                        _this.dropTop.next(data);
                    }
                }
                if (mouseArea == "bottom") {
                    if (_this.shouldOpenBottomInsert()) {
                        _this.dropBottom.next(data);
                    }
                }
                if (mouseArea == "center") {
                    _this.dropCenter.next(data);
                }
                _this.showByMsg(null);
            }
        });
    };
    SideDroppable.prototype.isDir = function () {
        return this.data && this.data.children && this.data.children.length > 0;
    };
    SideDroppable.prototype.shouldOpenTopInsert = function () {
        return true;
    };
    SideDroppable.prototype.shouldOpenBottomInsert = function () {
        return this.isLastItem;
    };
    SideDroppable.prototype.listenDragMove = function () {
        var _this = this;
        this.eventService.on('dragmove', function (e) {
            var ev = e.data.ev;
            var mouseArea = _this.getMouseArea(ev);
            if (mouseArea && _this.data != e.data.data) {
                if (mouseArea == 'top') {
                    if (_this.mouseHaveBeenArea == "top") {
                        _this.dropmove.next(e.data);
                    }
                    else {
                        if (_this.shouldOpenTopInsert()) {
                            console.log('this is should open top insert');
                            _this.dropEnterTop.next(e.data);
                            _this.showByMsg('top');
                        }
                    }
                }
                if (mouseArea == "bottom") {
                    if (_this.mouseHaveBeenArea == "bottom") {
                        _this.dropmove.next(e.data);
                    }
                    else {
                        if (_this.shouldOpenBottomInsert()) {
                            _this.dropEnterBottom.next(e.data);
                            _this.showByMsg('bottom');
                        }
                    }
                }
                if (mouseArea == "center") {
                    if (_this.mouseHaveBeenArea == "center") {
                        _this.dropmove.next(e.data);
                    }
                    else {
                        _this.dropEnterCenter.next(e.data);
                        _this.showByMsg('center');
                    }
                }
            }
            else {
                if (_this.mouseHaveBeenArea) {
                    _this.showByMsg(null);
                    _this.dropleave.next(e.data);
                }
            }
            _this.mouseHaveBeenArea = mouseArea;
        });
    };
    SideDroppable.prototype.getElementHeight = function () {
        var nativeElement = this.$element[0];
        return nativeElement.scrollHeight;
    };
    SideDroppable.prototype.getElementWidth = function () {
        var nativeElement = this.$element[0];
        return nativeElement.scrollWidth;
    };
    SideDroppable.prototype.getElementOffsetTop = function () {
        var offset = this.$element.offset();
        return offset.top;
    };
    SideDroppable.prototype.getElementOffsetLeft = function () {
        var offset = this.$element.offset();
        return offset.left;
    };
    SideDroppable.prototype.getMouseArea = function (ev) {
        var x = ev.pageX, y = ev.pageY;
        if ((this.getElementOffsetLeft() < x
            && (this.getElementOffsetLeft() + this.getElementWidth()) > x) &&
            (this.getElementOffsetTop() < y
                && (this.getElementOffsetTop() + this.getElementHeight()) > y)) {
            if (y < (this.getElementOffsetTop() + this.getElementHeight() / 3)) {
                return 'top';
            }
            else if (y > (this.getElementOffsetTop() + this.getElementHeight() / 3 * 2)) {
                return 'bottom';
            }
            else {
                return 'center';
            }
        }
        else {
            return null;
        }
    };
    SideDroppable.prototype.showByMsg = function (msg) {
        switch (msg) {
            case "top":
                $areaShowElement.css({
                    position: 'fixed',
                    width: this.getElementWidth(),
                    height: this.getElementHeight() / 10,
                    top: this.getElementOffsetTop(),
                    left: this.getElementOffsetLeft(),
                    background: 'rgba(255, 0, 0, 0.3)'
                }).show();
                this.isShowingAreaElement = true;
                break;
            case "center":
                $areaShowElement.css({
                    position: 'fixed',
                    width: this.getElementWidth(),
                    height: this.getElementHeight(),
                    top: this.getElementOffsetTop(),
                    left: this.getElementOffsetLeft(),
                    background: 'rgba(255, 0, 0, 0.3)'
                }).show();
                this.isShowingAreaElement = true;
                break;
            case "bottom":
                $areaShowElement.css({
                    position: 'fixed',
                    width: this.getElementWidth(),
                    height: this.getElementHeight() / 10,
                    top: this.getElementOffsetTop() + this.getElementHeight(),
                    left: this.getElementOffsetLeft(),
                    background: 'rgba(255, 0, 0, 0.3)'
                }).show();
                this.isShowingAreaElement = true;
                break;
            default:
                $areaShowElement.hide();
                this.isShowingAreaElement = false;
        }
    };
    SideDroppable = __decorate([
        ng.Directive({
            selector: '[side-droppable]',
            events: ['dropEnterTop', 'dropEnterBottom', 'dropEnterCenter', 'dropleave', 'dropmove', 'drop',
                'dropTop', 'dropBottom', 'dropCenter'
            ], properties: ['data', 'index', 'isLastItem']
        }),
        __param(1, ng.Inject(service_1.EventService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_1.EventService])
    ], SideDroppable);
    return SideDroppable;
})(Droppable);
exports.SideDroppable = SideDroppable;
//# sourceMappingURL=droppable.js.map
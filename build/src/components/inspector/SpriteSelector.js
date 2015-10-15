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
var ng2 = require('angular2/angular2');
var Dialog = require('../dark-ui/dialog/Dialog');
var CompFactory = WOZLLA.component.ComponentFactory;
var project_1 = require('../project/project');
var tpl = require('./sprite-selector.html');
var css = require('./sprite-selector.css');
var SpriteSelector = (function () {
    function SpriteSelector(el) {
        var _this = this;
        this.$root = $(el.nativeElement);
        this.$root.hide();
        if (this.$root.attr('show-action') === 'before:click') {
            this.$root.prev().click(function () {
                _this.refresh();
            });
        }
    }
    SpriteSelector.prototype.onClick = function (e) {
        var $target = $(e.target);
        if ($target.hasClass('ok')) {
            this.onConfirmSelect();
        }
        else if ($target.hasClass('cancel')) {
            this.$root.hide();
        }
    };
    SpriteSelector.prototype.onImgClick = function (e) {
        if (!$(e.target).hasClass('image'))
            return;
        var offX = e.offsetX;
        var offY = e.offsetY;
        var name;
        for (var i in this.frames) {
            var f = this.frames[i].frame;
            var x = f.x;
            var xw = f.x + f.w;
            var y = f.y;
            var yh = f.y + f.h;
            if (x <= offX && offX < xw && y <= offY && offY < yh) {
                name = i;
                this.$root.find('.size').text(JSON.stringify(f));
                break;
            }
        }
        if (name) {
            this.compdata.properties[this.property] = name;
            this.updateSelection();
        }
    };
    SpriteSelector.prototype.onImgDblClick = function () {
        this.$root.hide();
    };
    SpriteSelector.prototype.refresh = function () {
        var spriteAtlas = this.compdata.properties.spriteAtlas;
        if (!spriteAtlas) {
            this.$root.hide();
            return;
        }
        this.$root.show();
        console.log(spriteAtlas);
        var contents = project_1.getSpriteAtlasFileContents(spriteAtlas);
        var frames = JSON.parse(contents).frames;
        var sprites = [];
        for (var i in frames) {
            sprites.push(i);
        }
        this.frames = frames;
        this.sprites = sprites;
        this.spriteSrc = project_1.getSpriteAtlasImagePath(spriteAtlas);
        this.updateSelection();
    };
    SpriteSelector.prototype.updateSelection = function () {
        var frame = this.compdata.properties[this.property];
        var frameLight = this.$root.find('.frame-light');
        var frameData = frame && this.frames[frame] && this.frames[frame].frame;
        if (!frameData) {
            frameLight.hide();
        }
        else {
            frameLight.css({
                left: frameData.x,
                top: frameData.y,
                width: frameData.w,
                height: frameData.h
            });
            frameLight.show();
        }
        this.frame = frame;
        this.frameData = JSON.stringify(frameData);
        console.log('updateSelection', frame, this.frameData);
    };
    SpriteSelector.prototype.onConfirmSelect = function () {
        this.$root.hide();
    };
    SpriteSelector = __decorate([
        angular2_1.Component({
            selector: 'sprite-selector',
            properties: ['compdata', 'property']
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [Dialog, angular2_1.coreDirectives, angular2_1.formDirectives],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng2.ElementRef])
    ], SpriteSelector);
    return SpriteSelector;
})();
module.exports = SpriteSelector;
//# sourceMappingURL=SpriteSelector.js.map
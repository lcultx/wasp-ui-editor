import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View, ViewEncapsulation, coreDirectives, formDirectives} from 'angular2/angular2';
import ng2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
import BasicPanel = require('./panel/BasicPanel');
import Dialog = require('../dark-ui/dialog/Dialog');
import TransformPanel = require('./panel/TransformPanel');
import ComponentPanel = require('./panel/ComponentPanel');

var CompFactory = WOZLLA.component.ComponentFactory;

import {
    getSpriteAtlasImagePath,
    getSpriteAtlasFileContents
} from '../project/project';

const tpl = require('./sprite-selector.html');
const css = require('./sprite-selector.css');


@Component({
  selector: 'sprite-selector',
  properties: ['compdata', 'property']
})
@View({
  template: tpl,
  styles: [css],
  directives: [Dialog, coreDirectives, formDirectives],
  encapsulation: ViewEncapsulation.NONE
})
class SpriteSelector {

    $root;
    compdata;
    property;
    sprites;
    spriteSrc;
    frames;
    frame;
    frameData;

    constructor(el:ng2.ElementRef) {
        this.$root = $(el.nativeElement);
        this.$root.hide();
        if(this.$root.attr('show-action') === 'before:click') {
            this.$root.prev().click(() => {
                this.refresh();
            });
        }
    }

    onClick(e) {
        var $target = $(e.target);
        if($target.hasClass('ok')) {
            this.onConfirmSelect();
        } else if($target.hasClass('cancel')) {
            this.$root.hide();
        }
    }

    onImgClick(e) {
        if(!$(e.target).hasClass('image')) return;
        var offX = e.offsetX;
        var offY = e.offsetY;
        var name;
        for(var i in this.frames) {
            var f = this.frames[i].frame;
            var x = f.x;
            var xw = f.x + f.w;
            var y = f.y;
            var yh = f.y + f.h;
            if(x <= offX && offX < xw && y <= offY && offY < yh) {
                name = i;
                this.$root.find('.size').text(JSON.stringify(f));


                break;
            }
        }
        if(name) {
            this.compdata.properties[this.property] = name;
            this.updateSelection();
        }
    }

    onImgDblClick() {
        this.$root.hide();
    }

    refresh() {


        var spriteAtlas = this.compdata.properties.spriteAtlas;
        if(!spriteAtlas) {
            this.$root.hide();
            return;
        }
        this.$root.show();
        // select
        console.log(spriteAtlas);
        
        var contents = getSpriteAtlasFileContents(spriteAtlas);


        var frames = JSON.parse(contents).frames;
        var sprites = [];
        for(var i in frames) {
            sprites.push(i);
        }
        this.frames = frames;
        this.sprites = sprites;


        // image

        this.spriteSrc = getSpriteAtlasImagePath(spriteAtlas);
        this.updateSelection();
    }

    updateSelection() {
        var frame = this.compdata.properties[this.property];
        var frameLight = this.$root.find('.frame-light');
        var frameData = frame && this.frames[frame] && this.frames[frame].frame;
        if(!frameData) {
            frameLight.hide();
        } else {
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

    }

    onConfirmSelect() {
        this.$root.hide();
    }
}

export = SpriteSelector;

/// <reference path="../../../typings/tsd.d.ts"/>
import {ExecTimeService as execTime} from '../exec-time/service';
import $ = require('jquery');
import WOZLLA = require('wozllajs');
import {Component, View ,ViewEncapsulation} from 'angular2/angular2';
import angular2 = require('angular2/angular2');
import ng2Helper = require('../ng2-library/ng2Helper');
import Hierachy = require('../hierarchy/Hierarchy');
import Inspector = require('../inspector/Inspector');
import Visual = require('../visual/Visual');
import Dialog = require('../dark-ui/dialog/Dialog');
import ComponentSelector = require('../inspector/ComponentSelector');
import {Droppable,DynamicDroppable} from '../dark-ui/behavior';
import {Explorer} from '../explorer/explorer';
import {Menu} from '../dark-ui/ui';
import {
    handleOpenProject,
    handleOpenFile,
    handleNewUIFile,
    handleNewSceneFile,
    eventDispatcher,
    reloadCustomComponents,
    getCurrentProjectPath
} from '../project/project';

const tpl = require('./application.html').load();
const baseCss = require('../basic.css').load();
const css = require('./application.css').load();


@Component({
  selector: 'application'
})
@View({
  template: tpl,
  styles: [baseCss, css],
  directives: [ComponentSelector, Dialog, Hierachy, Inspector, Menu, Visual,Droppable,DynamicDroppable,Explorer],
  encapsulation: ViewEncapsulation.NONE
})
class Application {

    constructor() {
        execTime.step('application.Application init');
        eventDispatcher.addListener('openProject', () => {
            this.onReloadCustomCompoents();
        });
        if(getCurrentProjectPath()) {
            this.onReloadCustomCompoents();
        }
        this.initSplits();
    }

    getCurrentProjectPath() {
        return getCurrentProjectPath();
    }

    initSplits() {
        var downX;
        var tWidth;
        var $changeTarget;
        $('#app .splitter').mousedown((e) => {
            var splitter = $(e.target);
            downX = e.pageX;
            $changeTarget = splitter.prev();
            tWidth = $changeTarget.width();
            $(document.body).addClass('resizing');
        });
        $(document).mouseup((e) => {
            downX = null;
            $(document.body).removeClass('resizing');
        });
        $(document).mousemove((e) => {
            if(!downX) return;
            let deltaX = e.pageX - downX;
            $changeTarget.width(tWidth + deltaX);
        });
    }

    onOpenProjectClick() {
        handleOpenProject();
    }

    onOpenFileClick() {
        handleOpenFile();
    }

    onNewSceneFileClick() {
        handleNewSceneFile();
    }

    onNewUIFileClick() {
        handleNewUIFile();
    }

    onReloadCustomCompoents() {
        $('#global-loading').show();
        reloadCustomComponents((compFilePath) => {
            if(!compFilePath) {
                $('#global-loading').hide();
            } else {
                var scriptTag = document.createElement('script');
                scriptTag.src = 'file://' + compFilePath + '?' + Date.now();
                scriptTag.onload = () => {
                    $('#global-loading').hide();
                    // scriptTag.parentNode.removeChild(scriptTag);
                };
                scriptTag.onerror = () => {
                    alert('加载自定义组件失败');
                    $('#global-loading').hide();
                };
                document.getElementsByTagName('head')[0].appendChild(scriptTag);
            }
        });
    }

}

var component = WOZLLA.component.component;
WOZLLA.component.component = function (name:string, superClass?:Function) {
    return function(target:Function) {
        WOZLLA.component.ComponentFactory.unregister(name);
        WOZLLA.component.ComponentFactory.register(name, target, superClass);
    }
};

export = Application;

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
var service_1 = require('../exec-time/service');
var $ = require('jquery');
var WOZLLA = require('wozllajs');
var angular2_1 = require('angular2/angular2');
var Hierachy = require('../hierarchy/Hierarchy');
var Inspector = require('../inspector/Inspector');
var Visual = require('../visual/Visual');
var Dialog = require('../dark-ui/dialog/Dialog');
var ComponentSelector = require('../inspector/ComponentSelector');
var behavior_1 = require('../dark-ui/behavior');
var explorer_1 = require('../explorer/explorer');
var ui_1 = require('../dark-ui/ui');
var project_1 = require('../project/project');
var tpl = require('./application.html').load();
var baseCss = require('../basic.css').load();
var css = require('./application.css').load();
var Application = (function () {
    function Application() {
        var _this = this;
        service_1.ExecTimeService.step('application.Application init');
        project_1.eventDispatcher.addListener('openProject', function () {
            _this.onReloadCustomCompoents();
        });
        if (project_1.getCurrentProjectPath()) {
            this.onReloadCustomCompoents();
        }
        this.initSplits();
    }
    Application.prototype.getCurrentProjectPath = function () {
        return project_1.getCurrentProjectPath();
    };
    Application.prototype.initSplits = function () {
        var downX;
        var tWidth;
        var $changeTarget;
        $('#app .splitter').mousedown(function (e) {
            var splitter = $(e.target);
            downX = e.pageX;
            $changeTarget = splitter.prev();
            tWidth = $changeTarget.width();
            $(document.body).addClass('resizing');
        });
        $(document).mouseup(function (e) {
            downX = null;
            $(document.body).removeClass('resizing');
        });
        $(document).mousemove(function (e) {
            if (!downX)
                return;
            var deltaX = e.pageX - downX;
            $changeTarget.width(tWidth + deltaX);
        });
    };
    Application.prototype.onOpenProjectClick = function () {
        project_1.handleOpenProject();
    };
    Application.prototype.onOpenFileClick = function () {
        project_1.handleOpenFile();
    };
    Application.prototype.onNewSceneFileClick = function () {
        project_1.handleNewSceneFile();
    };
    Application.prototype.onNewUIFileClick = function () {
        project_1.handleNewUIFile();
    };
    Application.prototype.onReloadCustomCompoents = function () {
        $('#global-loading').show();
        project_1.reloadCustomComponents(function (compFilePath) {
            if (!compFilePath) {
                $('#global-loading').hide();
            }
            else {
                var scriptTag = document.createElement('script');
                scriptTag.src = 'file://' + compFilePath + '?' + Date.now();
                scriptTag.onload = function () {
                    $('#global-loading').hide();
                };
                scriptTag.onerror = function () {
                    alert('加载自定义组件失败');
                    $('#global-loading').hide();
                };
                document.getElementsByTagName('head')[0].appendChild(scriptTag);
            }
        });
    };
    Application = __decorate([
        angular2_1.Component({
            selector: 'application'
        }),
        angular2_1.View({
            template: tpl,
            styles: [baseCss, css],
            directives: [ComponentSelector, Dialog, Hierachy, Inspector, ui_1.Menu, Visual, behavior_1.Droppable, behavior_1.DynamicDroppable, explorer_1.Explorer],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [])
    ], Application);
    return Application;
})();
var component = WOZLLA.component.component;
WOZLLA.component.component = function (name, superClass) {
    return function (target) {
        WOZLLA.component.ComponentFactory.unregister(name);
        WOZLLA.component.ComponentFactory.register(name, target, superClass);
    };
};
module.exports = Application;
//# sourceMappingURL=Application.js.map
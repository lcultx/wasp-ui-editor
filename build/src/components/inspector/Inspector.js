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
var BasicPanel = require('./panel/BasicPanel');
var TransformPanel = require('./panel/TransformPanel');
var ComponentPanel = require('./panel/ComponentPanel');
var template_1 = require('../project/template');
var CompFactory = WOZLLA.component.ComponentFactory;
var project_1 = require('../project/project');
var tpl = require('./inspector.html');
var css = require('./inspector.css');
var Inspector = (function () {
    function Inspector() {
        var _this = this;
        project_1.eventDispatcher.addListener('nodeSelect', function (e) {
            var objData = e.data.node;
            template_1.fillDefaults(objData);
            _this.objData = null;
            setTimeout(function () { return _this.objData = objData; }, 1);
        });
        project_1.eventDispatcher.addListener('componentAdd', function (e) {
            var name = e.data.name;
            _this.objData.components = _this.objData.components || [];
            _this.objData.components.push({
                name: name,
                properties: {}
            });
            template_1.fillDefaults(_this.objData, false);
        });
    }
    Inspector.prototype.onAddCompBtnClick = function () {
        $('component-selector').show();
    };
    Inspector.prototype._getPropertyAnnos = function (compData) {
        var ret = [];
        var compName = compData.name;
        while (compName) {
            var compAnno = CompFactory.getAnnotation(compName);
            for (var _i = 0, _a = compAnno.properties; _i < _a.length; _i++) {
                var propAnno = _a[_i];
                ret.push(propAnno);
            }
            var superClass = CompFactory.getSuperClass(CompFactory.getType(compName));
            if (superClass) {
                compName = CompFactory.getName(superClass);
            }
            else {
                compName = null;
            }
        }
        return ret;
    };
    Inspector = __decorate([
        angular2_1.Component({
            selector: 'inspector'
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [BasicPanel, TransformPanel, ComponentPanel, angular2_1.coreDirectives],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [])
    ], Inspector);
    return Inspector;
})();
module.exports = Inspector;
//# sourceMappingURL=Inspector.js.map
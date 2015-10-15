var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var Panel = require('./Panel');
var tpl = require('./basic-panel.html');
var BasicPanel = (function () {
    function BasicPanel() {
    }
    BasicPanel.prototype.logData = function () {
        console.log(this.objdata);
    };
    BasicPanel = __decorate([
        angular2_1.Component({
            selector: 'basic-panel',
            properties: ['objdata']
        }),
        angular2_1.View({
            template: tpl,
            styles: [],
            directives: [Panel, angular2_1.coreDirectives, angular2_1.formDirectives]
        }), 
        __metadata('design:paramtypes', [])
    ], BasicPanel);
    return BasicPanel;
})();
module.exports = BasicPanel;
//# sourceMappingURL=BasicPanel.js.map
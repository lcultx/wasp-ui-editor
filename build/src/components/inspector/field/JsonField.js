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
var JsonDialog_1 = require('../../dark-ui/dialog/JsonDialog');
var JsonField = (function () {
    function JsonField() {
    }
    JsonField.prototype.getTitle = function () {
        return this.compdata.name + ' - ' + this.property;
    };
    JsonField.prototype.getDataProvider = function () {
        this.jsonProvider = this.jsonProvider || new JsonProvider(this.compdata, this.property);
        return this.jsonProvider;
    };
    JsonField.prototype.onClick = function () {
    };
    JsonField = __decorate([
        angular2_1.Component({
            selector: 'json-field',
            properties: ['property', 'value', 'compdata']
        }),
        angular2_1.View({
            template: "\n    <input readonly=\"true\" value=\"[Json]\" (click)=\"onClick()\">\n    <json-dialog [title]=\"getTitle()\" [jsonprovider]=\"getDataProvider()\" show-action=\"before:click\"></json-dialog>\n  ",
            styles: [],
            directives: [angular2_1.coreDirectives, angular2_1.formDirectives, JsonDialog_1.JsonDialog]
        }), 
        __metadata('design:paramtypes', [])
    ], JsonField);
    return JsonField;
})();
var JsonProvider = (function () {
    function JsonProvider(compdata, property) {
        this.compdata = compdata;
        this.property = property;
    }
    Object.defineProperty(JsonProvider.prototype, "data", {
        get: function () {
            return this.compdata.properties[this.property];
        },
        set: function (value) {
            this.compdata.properties[this.property] = value;
        },
        enumerable: true,
        configurable: true
    });
    return JsonProvider;
})();
module.exports = JsonField;
//# sourceMappingURL=JsonField.js.map
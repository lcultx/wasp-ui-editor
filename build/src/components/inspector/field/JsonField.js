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
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
var service_1 = require('../exec-time/service');
var ng = require('angular2/angular2');
var $ = require('jquery');
var project = require('../project/project');
var fs = require('fs');
var ui_1 = require('../dark-ui/ui');
var service_2 = require('./service');
var Explorer = (function () {
    function Explorer(el, explorerService) {
        var _this = this;
        this.el = el;
        this.$element = $(el.nativeElement);
        service_1.ExecTimeService.step('Explorer Init');
        explorerService.getDataAsync(function (data) {
            service_1.ExecTimeService.step('explorerService.getDataAsync success');
            _this.data = data;
        });
        this.explorerService = explorerService;
    }
    Explorer.prototype.onFilterCheckboxChange = function () {
        var unExpectList = [];
        var filterItems = this.$element.find('.filter').find('item');
        filterItems.each(function (index, item) {
            var $item = $(item);
            var checked = $item.find('input').is(':checked');
            if (!checked) {
                unExpectList.push($item.find('input').val());
            }
        });
        this.explorerService.updateHideFileTypeList(unExpectList);
        console.log(this);
    };
    Explorer.prototype.onSelectNode = function (ev) {
        if (!ev.is_dir) {
            var fileData = JSON.parse(fs.readFileSync(ev.path, 'utf8'));
            project.handleOpenFile(ev.path);
        }
        else {
            this.explorerService.openDir(ev);
        }
    };
    Explorer.prototype.onAddNode = function (ev) {
    };
    Explorer.prototype.onRemoveNode = function (ev) {
    };
    Explorer.prototype.noCopyNode = function (ev) {
    };
    Explorer.prototype.noNodeDropped = function (ev) {
    };
    Explorer.prototype.onNodeClick = function (ev) {
        if (ev.is_dir) {
            this.explorerService.openDir(ev);
        }
    };
    Explorer.prototype.onNodeDblClick = function (ev) {
        console.log('onNodeDblClick', ev);
    };
    Explorer.prototype.toggleFitterListCheckbox = function () {
        var menu = this.$element.find('.toolbar>.filter').find('menu');
        var status = menu.css('display');
        if (status == "none") {
            menu.show();
        }
        else {
            menu.hide();
        }
    };
    Explorer = __decorate([
        ng.Component({
            selector: 'explorer',
        }),
        ng.View({
            template: require('./explorer.html'),
            styles: [require('./explorer.css')],
            directives: [ui_1.FileTree, ui_1.Menu, ui_1.Item, ng.coreDirectives],
            encapsulation: ng.ViewEncapsulation.NONE
        }),
        __param(1, ng.Inject(service_2.ExplorerService)), 
        __metadata('design:paramtypes', [ng.ElementRef, service_2.ExplorerService])
    ], Explorer);
    return Explorer;
})();
exports.Explorer = Explorer;
//# sourceMappingURL=explorer.js.map
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
var project = require('../project/project');
var ng = require('angular2/angular2');
var DBService_1 = require('../db/DBService');
var fs = require('fs');
var electron_1 = require('../electron/electron');
var Datastore = electron_1.remote.require('nedb');
var ExplorerService = (function () {
    function ExplorerService(dbService) {
        this.hideFileTypeList = [];
        this.fileTypeList = [];
        service_1.ExecTimeService.step('explorer.ExplorerService init');
        this.dbService = dbService;
    }
    ExplorerService.prototype.isUnExpect = function (item) {
        var unExpectList = ['node_modules', 'build', 'game.js', 'game_all.js', 'dist', 'Engine', 'git'];
        if (item[0] == '.') {
            return true;
        }
        if (unExpectList.indexOf(item) > -1) {
            return true;
        }
    };
    ExplorerService.prototype.getFileTreeByPath = function (path, deep, unExpectList) {
        var _this = this;
        var dirList = fs.readdirSync(path);
        var dataList = [];
        dirList.forEach(function (item) {
            if (!_this.isUnExpect(item)) {
                var p = path + '/' + item;
                var is_dir = fs.statSync(p).isDirectory();
                var data = {
                    name: item,
                    path: p,
                    is_dir: is_dir,
                    children: []
                };
                if (is_dir && deep && deep < 2) {
                    data.children = _this.getFileTreeByPath(p, deep + 1);
                }
                if (!is_dir) {
                    var fileType = item.split('.').pop();
                    if (_this.fileTypeList.indexOf(fileType) == -1) {
                        _this.fileTypeList.push(fileType);
                    }
                }
                dataList.push(data);
            }
        });
        var finalList = [];
        for (var i in dataList) {
            var d = dataList[i];
            if (d.is_dir) {
                finalList.push(d);
            }
        }
        for (var i in dataList) {
            var d = dataList[i];
            if (!d.is_dir) {
                finalList.push(d);
            }
        }
        return finalList;
    };
    ExplorerService.prototype.getExplorerDataAsync = function (callback) {
        var _this = this;
        service_1.ExecTimeService.step('getExplorerDataAsync..');
        var path = project.currentProjectPath;
        var db = this.dbService.getDb();
        if (path) {
            db.find({ key: 'explorer.root' }, function (err, docs) {
                var tree = {
                    name: 'Explorer',
                    path: path,
                    is_dir: true,
                    children: _this.getFileTreeByPath(path)
                };
                _this.data = tree;
                db.insert({
                    key: 'explorer.root',
                    value: tree
                }, function (err) {
                    if (!err) {
                        console.log('success save project tree to db');
                    }
                    else {
                        throw err;
                    }
                });
                callback(_this.data);
            });
        }
    };
    ExplorerService.prototype.getDataAsync = function (callback) {
        var _this = this;
        this.getExplorerDataAsync(function (root) {
            _this.data = {
                root: root,
                hideFileTypeList: _this.hideFileTypeList,
                fileTypeList: _this.fileTypeList
            };
            callback(_this.data);
        });
    };
    ExplorerService.prototype.openDir = function (ev) {
        ev.children = this.getFileTreeByPath(ev.path);
    };
    ExplorerService.prototype.getHideFileTypeList = function () {
        return this.hideFileTypeList;
    };
    ExplorerService.prototype.updateHideFileTypeList = function (hideFileTypeList) {
        console.log(hideFileTypeList);
        this.data.hideFileTypeList = hideFileTypeList;
    };
    ExplorerService.prototype.getFileTypeList = function () {
        return this.fileTypeList;
    };
    ExplorerService = __decorate([
        __param(0, ng.Inject(DBService_1.DBService)), 
        __metadata('design:paramtypes', [DBService_1.DBService])
    ], ExplorerService);
    return ExplorerService;
})();
exports.ExplorerService = ExplorerService;
//# sourceMappingURL=service.js.map
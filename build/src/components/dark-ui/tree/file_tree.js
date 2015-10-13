var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var ng = require('angular2/angular2');
var Contextmenu_1 = require('../contextmenu/Contextmenu');
var menu_1 = require('../menu/menu');
var droppable_1 = require('../behavior/droppable');
var dragable_1 = require('../behavior/dragable');
var activingLeafElement = null;
var tpl = require('./file_tree.html');
var baseTreeCss = require('./base_tree.css');
var fileTreeCss = require('./file_tree.css');
var base_tree_1 = require('./base_tree');
var project = require('../../project/project');
var FileTree = (function (_super) {
    __extends(FileTree, _super);
    function FileTree(el) {
        _super.call(this, el);
    }
    Object.defineProperty(FileTree.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (root) {
            this._root = root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileTree.prototype, "leaf", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    FileTree.prototype.shouldShow = function (leaf) {
        var type = leaf.path.split('.').pop();
        if (!leaf.is_dir && this.hideFileTypeList.indexOf(type) > -1) {
            return false;
        }
        else {
            return true;
        }
    };
    FileTree.prototype.getDisplayStyles = function (leaf) {
        if (this.shouldShow(leaf)) {
            return '';
        }
        else {
            return 'display:none';
        }
    };
    FileTree.prototype.onLeafNameDoubleClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        Contextmenu_1.Contextmenu.closeAll();
        this.selectLeaf(leaf);
        this.dblclick.next(leaf);
    };
    FileTree.prototype.onLeafNameClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        this.toggleLeafSubTree(leafElement);
        if (!leaf.is_dir) {
            this.activeLeafElementShow(leafElement);
        }
        this.click.next(leaf);
    };
    FileTree.prototype.addUIFile = function (leaf) {
        debugger;
        project.handleNewUIFile(leaf.parent.path);
    };
    FileTree.prototype.addSceneFile = function (leaf) {
        debugger;
        project.handleNewSceneFile(leaf.parent.path);
    };
    FileTree = __decorate([
        ng.Component({
            selector: 'file-tree',
            properties: ['root', 'isleaftree', 'defaultCloseSubtree', 'hideFileTypeList'],
            events: ['select', 'add', 'remove', 'copy', 'childify', 'drop', 'click', 'dblclick']
        }),
        ng.View({
            template: tpl, styles: [baseTreeCss, fileTreeCss],
            directives: [ng.formDirectives, ng.coreDirectives, FileTree, Contextmenu_1.Contextmenu, menu_1.Menu, menu_1.Item, dragable_1.ShadowDragable, dragable_1.Dragable,
                droppable_1.Droppable, droppable_1.DynamicDroppable
            ],
            encapsulation: ng.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], FileTree);
    return FileTree;
})(base_tree_1.BaseTree);
exports.FileTree = FileTree;
//# sourceMappingURL=file_tree.js.map
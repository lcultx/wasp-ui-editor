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
var $ = require('jquery');
var Contextmenu_1 = require('../contextmenu/Contextmenu');
var menu_1 = require('../menu/menu');
var droppable_1 = require('../behavior/droppable');
var dragable_1 = require('../behavior/dragable');
var activingLeafElement = null;
var tpl = require('./base_tree.html').load();
var css = require('./base_tree.css').load();
var BaseTree = (function () {
    function BaseTree(el) {
        var _this = this;
        this.el = el;
        this.select = new ng.EventEmitter();
        this.add = new ng.EventEmitter();
        this.remove = new ng.EventEmitter();
        this.copy = new ng.EventEmitter();
        this.childify = new ng.EventEmitter();
        this.drop = new ng.EventEmitter();
        this.click = new ng.EventEmitter();
        this.dblclick = new ng.EventEmitter();
        this.$element = $(el.nativeElement);
        $('body').click(function () {
            _this.closeAllMenu();
        });
        setTimeout(function () {
            if (_this.isleaftree) {
                if (_this.defaultCloseSubtree) {
                    var leafs = _this.$element.find('.leaf');
                    leafs.each(function (index, leaf) {
                        _this.closeLeafSubTree($(leaf));
                    });
                }
            }
        }, 10);
    }
    Object.defineProperty(BaseTree.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (root) {
            this._root = root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTree.prototype, "leaf", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    BaseTree.prototype.randomColor = function () {
        var r = Math.round(Math.random() * 10);
        return '#' + r + r + r;
    };
    BaseTree.prototype.closeAllMenu = function () {
        Contextmenu_1.Contextmenu.closeAll();
    };
    BaseTree.prototype.getThisLeafElement = function () {
        return this.$element.children().children('.leaf');
    };
    BaseTree.prototype.activeLeafElementShow = function (leafElement) {
        if (activingLeafElement) {
            activingLeafElement.removeClass('active');
            activingLeafElement = leafElement;
        }
        else {
            activingLeafElement = leafElement;
        }
        activingLeafElement.addClass('active');
    };
    BaseTree.prototype.toggleLeafSubTree = function (leafElement) {
        var $child = leafElement.children('.children');
        if ($child.length > 0) {
            var nowStatus = $child.css('display');
            var leafName = leafElement.children('.leaf-name');
            var leafNameText = leafName.find('.leaf-name-text');
            if (nowStatus == "none") {
                leafNameText.addClass('expanded').removeClass('collapsed');
                $child.show();
            }
            else {
                leafNameText.addClass('collapsed').removeClass('expanded');
                $child.hide();
            }
        }
    };
    BaseTree.prototype.openLeafSubTree = function (leafElement) {
        var $child = leafElement.children('.children');
        if ($child.length > 0) {
            var leafName = leafElement.children('.leaf-name');
            var leafNameText = leafName.find('.leaf-name-text');
            leafNameText.addClass('expanded').removeClass('collapsed');
            $child.show();
        }
    };
    BaseTree.prototype.closeLeafSubTree = function (leafElement) {
        var $child = leafElement.children('.children');
        if ($child.length > 0) {
            var leafName = leafElement.children('.leaf-name');
            var leafNameText = leafName.find('.leaf-name-text');
            leafNameText.addClass('collapsed').removeClass('expanded');
            $child.hide();
        }
    };
    BaseTree.prototype.onLeafNameDoubleClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        Contextmenu_1.Contextmenu.closeAll();
        this.selectLeaf(leaf);
        this.dblclick.next(leaf);
    };
    BaseTree.prototype.onLeafNameClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        this.toggleLeafSubTree(leafElement);
        this.activeLeafElementShow(leafElement);
        this.click.next(leaf);
    };
    BaseTree.prototype.addLeaf = function (desc) {
        this.add.next(desc);
        Contextmenu_1.Contextmenu.closeAll();
    };
    BaseTree.prototype.copyLeaf = function (leaf) {
        this.copy.next(leaf);
        Contextmenu_1.Contextmenu.closeAll();
    };
    BaseTree.prototype.deleteLeaf = function (leaf) {
        this.remove.next(leaf);
        Contextmenu_1.Contextmenu.closeAll();
    };
    BaseTree.prototype.selectLeaf = function (leaf) {
        this.select.next(leaf);
    };
    BaseTree.prototype.objHasChildren = function (ob) {
        return (ob && ob.children && ob.children.length > 0) || (ob && ob.is_dir);
    };
    BaseTree.prototype.childifyLeaf = function (desc) {
        this.childify.next(desc);
    };
    BaseTree.prototype.onDropEnter = function (ev) {
        console.log('drop enter');
        console.log(ev);
    };
    BaseTree.prototype.onDropMove = function (ev) {
        console.log('drop move');
    };
    BaseTree.prototype.onDropLeave = function (ev) {
        console.log('drop leave');
        console.log(ev);
    };
    BaseTree.prototype.onDrop = function (ev) {
        console.log('tree drop event');
        this.drop.next(ev);
    };
    BaseTree.prototype.onLeafDropped = function (ev) {
        console.log('DEEP tree drop event');
        this.drop.next(ev);
    };
    BaseTree.prototype.clickLeaf = function (ev) {
        this.click.next(ev);
    };
    BaseTree.prototype.dblClickLeaf = function (ev) {
        this.dblclick.next(ev);
    };
    BaseTree = __decorate([
        ng.Component({
            selector: 'base-tree',
            properties: ['root', 'isleaftree', 'defaultCloseSubtree'],
            events: ['select', 'add', 'remove', 'copy', 'childify', 'drop', 'click', 'dblclick']
        }),
        ng.View({
            template: tpl, styles: [css],
            directives: [ng.formDirectives, ng.coreDirectives, BaseTree, Contextmenu_1.Contextmenu, menu_1.Menu, menu_1.Item, dragable_1.ShadowDragable, dragable_1.Dragable,
                droppable_1.Droppable, droppable_1.DynamicDroppable
            ],
            encapsulation: ng.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], BaseTree);
    return BaseTree;
})();
exports.BaseTree = BaseTree;
//# sourceMappingURL=base_tree.js.map
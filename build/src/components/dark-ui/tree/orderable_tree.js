var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var tpl = require('./orderable_tree.html');
var css = require('./base_tree.css');
var base_tree_1 = require('./base_tree');
var OrdertableTree = (function (_super) {
    __extends(OrdertableTree, _super);
    function OrdertableTree(el) {
        _super.call(this, el);
        this.dropTop = new ng.EventEmitter();
        this.dropCenter = new ng.EventEmitter();
        this.dropBottom = new ng.EventEmitter();
        this.export = new ng.EventEmitter();
    }
    OrdertableTree.prototype.onDrop = function (ev) {
        console.log('tree drop event');
        this.drop.next(ev);
    };
    OrdertableTree.prototype.onTopDrop = function (ev) {
        console.log('tree top drop event');
        this.dropTop.next(ev);
    };
    OrdertableTree.prototype.onBottomDrop = function (ev) {
        console.log('tree bottom drop event');
        this.dropBottom.next(ev);
    };
    OrdertableTree.prototype.onCenterDrop = function (ev) {
        console.log('tree center drop event');
        this.dropCenter.next(ev);
    };
    OrdertableTree.prototype.onLeafNameDoubleClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        this.toggleLeafSubTree(leafElement);
        this.click.next(leaf);
    };
    OrdertableTree.prototype.onLeafNameClick = function (leaf) {
        var leafElement = this.getThisLeafElement();
        Contextmenu_1.Contextmenu.closeAll();
        this.selectLeaf(leaf);
        this.dblclick.next(leaf);
        this.activeLeafElementShow(leafElement);
    };
    OrdertableTree.prototype.onLeafDropped = function (ev) {
        console.log('DEEP tree drop event');
        this.drop.next(ev);
    };
    OrdertableTree.prototype.onLeafTopDropped = function (ev) {
        console.log('DEEP tree top drop event');
        this.dropTop.next(ev);
    };
    OrdertableTree.prototype.onLeafBottomDropped = function (ev) {
        console.log('DEEP tree bottom drop event');
        this.dropBottom.next(ev);
    };
    OrdertableTree.prototype.onLeafCenterDropped = function (ev) {
        console.log('DEEP tree center drop event');
        this.dropCenter.next(ev);
    };
    OrdertableTree.prototype.exportLeaf = function (ev) {
        console.log('export');
        this.export.next(ev);
    };
    OrdertableTree = __decorate([
        ng.Component({
            selector: 'orderable-tree',
            properties: ['root', 'isleaftree', 'index', 'isLastItem'],
            events: ['select', 'add', 'remove', 'copy', 'childify', 'drop', 'dropTop', 'dropCenter', 'dropBottom', 'export']
        }),
        ng.View({
            template: require('./orderable_tree.html'), styles: [css],
            directives: [ng.formDirectives, ng.coreDirectives, OrdertableTree, Contextmenu_1.Contextmenu, menu_1.Menu, menu_1.Item, dragable_1.ShadowDragable,
                droppable_1.SideDroppable
            ],
            encapsulation: ng.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [ng.ElementRef])
    ], OrdertableTree);
    return OrdertableTree;
})(base_tree_1.BaseTree);
exports.OrdertableTree = OrdertableTree;
//# sourceMappingURL=orderable_tree.js.map
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
var project = require('../project/project');
var template = require('../project/template');
var tpl = require('./hierarchy.html').load();
var css = require('./hierarchy.css').load();
var ui_1 = require('../dark-ui/ui');
var jQuery = require('jquery');
var global = window;
var remote = global.require('remote');
var fs = global.require('fs');
var dialog = remote.require('dialog');
function delArrayItem(array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}
function objDeepClone(obj) {
    return jQuery.extend(true, {}, obj);
}
var Hierarchy = (function () {
    function Hierarchy() {
        var _this = this;
        this.isMoveing = false;
        this.root = {
            name: 'ROOT'
        };
        project.eventDispatcher.addListener('openFile', function (e) {
            _this.root = e.data.fileData.root;
        });
    }
    Hierarchy.prototype.getNodeByUUID = function (tree, uuid) {
        if (tree) {
            for (var i in tree.children) {
                var node = tree.children[i];
                if (node.uuid == uuid) {
                    return node;
                }
                else {
                    var subNode = this.getNodeByUUID(node, uuid);
                    if (subNode) {
                        return subNode;
                    }
                    else {
                        continue;
                    }
                }
            }
        }
    };
    Hierarchy.prototype.getParentNodeByUUID = function (tree, uuid) {
        var realParent = null;
        if (tree) {
            for (var i in tree.children) {
                var node = tree.children[i];
                if (node.uuid == uuid) {
                    realParent = tree;
                    break;
                }
                else {
                    var subParent = this.getParentNodeByUUID(node, uuid);
                    if (subParent) {
                        realParent = subParent;
                        break;
                    }
                    else {
                        continue;
                    }
                }
            }
        }
        return realParent;
    };
    Hierarchy.prototype.deleteNode = function (node) {
        if (node.uuid) {
            var parent = this.getParentNodeByUUID(this.root, node.uuid);
            var node = this.getNodeByUUID(this.root, node.uuid);
            delArrayItem(parent.children, node);
        }
    };
    Hierarchy.prototype.copyNode = function (node) {
        var parent, node;
        if (node.uuid) {
            parent = this.getParentNodeByUUID(this.root, node.uuid);
            node = this.getNodeByUUID(this.root, node.uuid);
            var copyNode = objDeepClone(node);
            copyNode.uuid = template.genUUID();
            copyNode.name = node.name + ' Copy';
            this.deepRefeshUUID(copyNode);
            parent.children.push(copyNode);
        }
    };
    Hierarchy.prototype.deepRefeshUUID = function (parent) {
        if (parent) {
            for (var i in parent.children) {
                var node = parent.children[i];
                node.uuid = template.genUUID();
                this.deepRefeshUUID(node);
            }
        }
    };
    Hierarchy.prototype.childifyNode = function (desc) {
        var childNode = desc.child;
        var newNode = template.createGameObjTemplate(desc.rect);
        var mountNode = null;
        if (childNode.uuid) {
            mountNode = this.getParentNodeByUUID(this.root, childNode.uuid);
        }
        if (!newNode.children) {
            newNode.children = [];
        }
        newNode.children.push(childNode);
        if (mountNode && !mountNode.children) {
            mountNode.children = [];
        }
        if (mountNode.children) {
            mountNode.children.push(newNode);
        }
    };
    Hierarchy.prototype.onSelectNode = function (node) {
        console.log('onSelectNode');
        console.log(node);
        project.handleTreeNodeSelect(node);
    };
    Hierarchy.prototype.onAddNode = function (desc) {
        console.log('onAddNode');
        var parent = desc.parent;
        if (!parent.children) {
            parent.children = [];
        }
        var nodeData = template.createGameObjTemplate(desc.rect);
        template.fillDefaults(nodeData);
        parent.children.push(nodeData);
    };
    Hierarchy.prototype.onRemoveNode = function (node) {
        console.log('onRemoveNode');
        console.log(node);
        this.deleteNode(node);
    };
    Hierarchy.prototype.onCopyNode = function (node) {
        console.log('onCopyNode');
        console.log(node);
        this.copyNode(node);
    };
    Hierarchy.prototype.onChildifyNode = function (desc) {
        console.log('onChildifyNode');
        console.log(desc);
        this.childifyNode(desc);
    };
    Hierarchy.prototype.isItProgeny = function (parent, child) {
        var isTrue = false;
        if (parent) {
            for (var i in parent.children) {
                var node = parent.children[i];
                if (node.uuid == child.uuid) {
                    isTrue = true;
                    break;
                }
                else {
                    var isSubChild = this.isItProgeny(node, child);
                    if (isSubChild) {
                        isTrue = true;
                        break;
                    }
                    else {
                        continue;
                    }
                }
            }
        }
        return isTrue;
    };
    Hierarchy.prototype.isExistInRoot = function (node) {
        if (node && this.root) {
            return node == this.root || this.isItProgeny(this.root, node);
        }
        else {
            throw new Error('data is wrong!');
        }
    };
    Hierarchy.prototype.onNodeDropped = function (ev) {
        var _this = this;
        console.log('success get drop event');
        if (!this.isMoveing) {
            var target = ev.droppable_data;
            var child = ev.dragable_data;
            if (target.children.indexOf(child) == -1
                && target.uuid != child.uuid
                && !this.isItProgeny(child, target)
                && this.isExistInRoot(target) && this.isExistInRoot(child)) {
                this.isMoveing = true;
                var bakRoot = objDeepClone(this.root);
                this.deleteNode(child);
                setTimeout(function () {
                    try {
                        if (!target.children) {
                            target.children = [];
                        }
                        target.children.push(child);
                        _this.isMoveing = false;
                    }
                    catch (e) {
                        console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', e);
                        _this.root = bakRoot;
                        _this.isMoveing = false;
                    }
                }, 50);
            }
        }
    };
    Hierarchy.prototype.insertBefore = function (target, source) {
        var tagetParent = this.getParentNodeByUUID(this.root, target.uuid);
        var index = tagetParent.children.indexOf(target);
        tagetParent.children.splice(index, 0, source);
    };
    Hierarchy.prototype.insertAfter = function (target, source) {
        var tagetParent = this.getParentNodeByUUID(this.root, target.uuid);
        var index = tagetParent.children.indexOf(target);
        tagetParent.children.splice(index + 1, 0, source);
    };
    Hierarchy.prototype.onNodeTopDrop = function (ev) {
        var _this = this;
        console.log('success get top drop event');
        if (!this.isMoveing) {
            var target = ev.droppable_data;
            var child = ev.dragable_data;
            if (target.uuid != this.root.uuid
                && target.uuid != child.uuid
                && !this.isItProgeny(child, target)
                && this.isExistInRoot(target) && this.isExistInRoot(child)) {
                this.isMoveing = true;
                var bakRoot = objDeepClone(this.root);
                this.deleteNode(child);
                setTimeout(function () {
                    try {
                        _this.insertBefore(target, child);
                        _this.isMoveing = false;
                    }
                    catch (e) {
                        console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', e);
                        _this.root = bakRoot;
                        _this.isMoveing = false;
                    }
                }, 50);
            }
        }
    };
    Hierarchy.prototype.onNodeCenterDrop = function (ev) {
        console.log('success get center drop event');
        this.onNodeDropped(ev);
    };
    Hierarchy.prototype.onNodeBottomDrop = function (ev) {
        var _this = this;
        console.log('success get bottom drop event');
        if (!this.isMoveing) {
            var target = ev.droppable_data;
            var child = ev.dragable_data;
            if (target.uuid != this.root.uuid
                && target.uuid != child.uuid
                && !this.isItProgeny(child, target)
                && this.isExistInRoot(target) && this.isExistInRoot(child)) {
                this.isMoveing = true;
                var bakRoot = objDeepClone(this.root);
                this.deleteNode(child);
                setTimeout(function () {
                    try {
                        _this.insertAfter(target, child);
                        _this.isMoveing = false;
                    }
                    catch (e) {
                        console.log('Error ,Try to Recover Data !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', e);
                        _this.root = bakRoot;
                        _this.isMoveing = false;
                    }
                }, 50);
            }
        }
    };
    Hierarchy.prototype.onNodeExport = function (ev) {
        console.log('onNodeExport');
        var node = ev;
        dialog.showSaveDialog({
            defaultPath: project.currentProjectPath,
            filters: [
                { name: 'Custom File Type', extensions: ['json'] }
            ]
        }, function (filename) {
            console.log(template.uiFileTemplate);
            var ob = JSON.parse(JSON.stringify(template.uiFileTemplate));
            ob.root.children = [node];
            fs.writeFileSync(filename, JSON.stringify(ob, null, '  '), 'utf8');
        });
    };
    Hierarchy = __decorate([
        angular2_1.Component({
            selector: 'hierarchy'
        }),
        angular2_1.View({
            template: tpl,
            directives: [ui_1.Menu, ui_1.Item, ui_1.OrdertableTree],
            styles: [css],
            encapsulation: angular2_1.ViewEncapsulation.NONE
        }), 
        __metadata('design:paramtypes', [])
    ], Hierarchy);
    return Hierarchy;
})();
module.exports = Hierarchy;
//# sourceMappingURL=Hierarchy.js.map
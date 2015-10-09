var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
var $ = require('jquery');
var WOZLLA = require('wozllajs');
var angular2_1 = require('angular2/angular2');
var tpl = require('./visual.html');
var css = require('./visual.css');
var uuidMap = {};
var project_1 = require('../project/project');
var Visual = (function () {
    function Visual(el) {
        var _this = this;
        this.el = el;
        this.scale = 50;
        this.screenSize = '960x640';
        this.updateTimer = null;
        this.fileData = null;
        this.dataGameObj = null;
        this.selectedObjData = null;
        this.selectedGameObj = null;
        this.selectedUUID = null;
        this.pauseUpdateInterval = false;
        this.mode = 'Position';
        this.playMode = true;
        this.mousePos = '';
        this.initCanvas();
        project_1.eventDispatcher.addListenerScope('openFile', this.onOpenFile, this);
        project_1.eventDispatcher.addListenerScope('openProject', this.onOpenProject, this);
        project_1.eventDispatcher.addListener('reload', function () { return _this.reloadStage(_this.fileData); });
        project_1.eventDispatcher.addListenerScope('dataChange', this.onDataChange, this);
        project_1.eventDispatcher.addListenerScope('nodeSelect', this.onNodeSelect, this);
        $('.canvas-wrapper').on('mousemove', function (e) {
            _this.mousePos = e.offsetX + ',' + e.offsetY;
        });
    }
    Visual.prototype.initCanvas = function () {
        var _this = this;
        WOZLLA.wson.setBuilderFactory(function () {
            return new GameObjectBuilder();
        });
        this.canvas = document.getElementById('visual-canvas');
        this.editToolsDiv = document.getElementById('edit-tools');
        this.editToolsPosDiv = document.getElementById('edit-tools-pos');
        this.editToolsColDiv = document.getElementById('edit-tools-col');
        this.engineDirector = new WOZLLA.Director(this.canvas, { bgColor: [0, 0, 0, 0] });
        this.engineDirector.assetManager.setAssetPathResolver({
            resolvePath: function (path) {
                if (/^\$prj:/i.test(path)) {
                    return 'file://' + project_1.getCurrentProjectPath() + '/' + path.substr(5);
                }
                if (/^data:image\/(png|jpg|jpeg);base64/ig.test(path)) {
                    return path;
                }
                return 'file://' + project_1.getCurrentProjectPath() + '/tsv2_res/' + path;
            }
        });
        setInterval(function () {
            if (_this.pauseUpdateInterval)
                return;
            _this.engineDirector.runStep();
        }, 500);
        this.engineDirector.scheduler.scheduleLoop(function () {
            _this.updateEditTools();
        });
        window['director'] = this.engineDirector; // for debug
        this.updateCanvasSize();
        this.updateScale();
        this.initMouseOperations();
    };
    Visual.prototype.updateCanvasSize = function () {
        var size = this.screenSize.split('x');
        var width = this.canvas.width = (parseInt(size[0]));
        var height = this.canvas.height = (parseInt(size[1]));
        this.engineDirector.updateViewport({ x: 0, y: 0, width: width, height: height });
        this.editToolsDiv.style.width = width + 'px';
        this.editToolsDiv.style.height = height + 'px';
        this.updateScale();
    };
    Visual.prototype.updateScale = function () {
        var scalePer = this.scale / 100;
        var scaleStr = 'scale(' + scalePer + ',' + scalePer + ')';
        var translateStr = 'translate(' + (-this.canvas.width / 2) + 'px,' + (-this.canvas.height / 2) + 'px' + ')';
        this.canvas.style.transform = translateStr + ' ' + scaleStr;
        this.editToolsDiv.style.transform = translateStr + ' ' + scaleStr;
    };
    Visual.prototype.initMouseOperations = function () {
        var _this = this;
        var mousedown = false;
        var lastX, lastY;
        var startX, startY;
        this.editToolsPosDiv.addEventListener('mousedown', function (e) {
            if (e.altKey) {
                mousedown = true;
                _this.pauseUpdateInterval = true;
                _this.engineDirector.start();
                lastX = e.pageX;
                lastY = e.pageY;
                startX = e.pageX;
                startY = e.pageY;
                for (var i in _this.selectedObjData.components) {
                    if (_this.selectedObjData.components[i].name == "Sprite9Patch") {
                        var s9c = _this.selectedObjData.components[i];
                        var data = void 0;
                        if (s9c.__editor_data) {
                            data = s9c.__editor_data;
                        }
                        else {
                            data = {
                                originalRenderWidth: s9c.properties.renderWidth * 1,
                                originalRenderHeight: s9c.properties.renderHeight * 1
                            };
                            s9c.__editor_data = data;
                        }
                    }
                }
            }
        });
        window.addEventListener('mouseup', function (e) {
            mousedown = false;
            _this.pauseUpdateInterval = false;
            _this.engineDirector.stop();
        });
        window.addEventListener('mousemove', function (e) {
            if (e.altKey && !e.ctrlKey && mousedown && _this.selectedObjData) {
                var deltaX = e.pageX - lastX;
                var deltaY = e.pageY - lastY;
                deltaX *= 100 / _this.scale;
                deltaY *= 100 / _this.scale;
                lastX = e.pageX;
                lastY = e.pageY;
                if (_this.selectedObjData.rect) {
                    _this.selectedObjData.transform.px += deltaX;
                    _this.selectedObjData.transform.py += deltaY;
                }
                else {
                    _this.selectedObjData.transform.x += deltaX;
                    _this.selectedObjData.transform.y += deltaY;
                }
            }
            if (e.altKey && e.ctrlKey && mousedown && _this.selectedObjData) {
                if (_this.selectedObjData.rect) {
                    var x0 = _this.selectedObjData.transform.px;
                    var y0 = _this.selectedObjData.transform.py;
                    _this.updateSelectedObScale((e.pageX - x0) / (startX - x0), (e.pageY - y0) / (startY - y0));
                }
                else {
                    var x0 = _this.selectedObjData.transform.x;
                    var y0 = _this.selectedObjData.transform.y;
                    _this.updateSelectedObScale((e.pageX - x0) / (startX - x0), (e.pageY - y0) / (startY - y0));
                }
            }
            if (e.altKey && e.ctrlKey && e.shiftKey && mousedown && _this.selectedObjData) {
                function max(a, b) {
                    if (a > b) {
                        return a;
                    }
                    else {
                        return b;
                    }
                }
                var x0;
                var y0;
                if (_this.selectedObjData.rect) {
                    x0 = _this.selectedObjData.transform.px;
                    y0 = _this.selectedObjData.transform.py;
                }
                else {
                    x0 = _this.selectedObjData.transform.x;
                    y0 = _this.selectedObjData.transform.y;
                }
                var scaleX = (e.pageX - x0) / (startX - x0);
                var scaleY = (e.pageY - y0) / (startY - y0);
                var maxScale = max(scaleX, scaleY);
                _this.updateSelectedObScale(maxScale, maxScale);
            }
        });
    };
    Visual.prototype.hasSprite9PatchComponent = function () {
        for (var i in this.selectedObjData.components) {
            if (this.selectedObjData.components[i].name == "Sprite9Patch") {
                return true;
            }
        }
    };
    Visual.prototype.updataSelectObjS9PSize = function (scaleX, scaleY) {
        for (var i in this.selectedObjData.components) {
            if (this.selectedObjData.components[i].name == "Sprite9Patch") {
                var s9c = this.selectedObjData.components[i];
                var data = void 0;
                if (s9c.__editor_data) {
                    data = s9c.__editor_data;
                }
                else {
                    data = {
                        originalRenderWidth: s9c.properties.renderWidth * 1,
                        originalRenderHeight: s9c.properties.renderHeight * 1
                    };
                    s9c.__editor_data = data;
                }
                s9c.properties.renderWidth = Math.round(data.originalRenderWidth * scaleX) + "";
                s9c.properties.renderHeight = Math.round(data.originalRenderHeight * scaleY) + "";
            }
        }
    };
    Visual.prototype.updateSelectedObScale = function (scaleX, scaleY) {
        if (this.hasSprite9PatchComponent()) {
            this.updataSelectObjS9PSize(scaleX, scaleY);
        }
        else {
            this.selectedGameObj.transform.scaleX = scaleX;
            this.selectedObjData.transform.scaleX = scaleX;
            this.selectedGameObj.transform.scaleY = scaleY;
            this.selectedObjData.transform.scaleY = scaleY;
        }
    };
    Visual.prototype.updateEditTools = function () {
        if (this.selectedGameObj) {
            var cssMatrix = toCssMatrix(this.selectedGameObj.transform.worldMatrix, this.engineDirector.stage.domScale);
            this.editToolsPosDiv.style.display = 'block';
            this.editToolsPosDiv.style.transform = cssMatrix;
            var collider = this.selectedGameObj.collider;
            if (collider) {
                this.editToolsColDiv.style.display = 'block';
                this.editToolsColDiv.style.transform = cssMatrix;
                if (collider instanceof WOZLLA.component.RectCollider) {
                    this.editToolsColDiv.style.width = collider.width.get() + 'px';
                    this.editToolsColDiv.style.height = collider.height.get() + 'px';
                    this.editToolsColDiv.style.left = collider.x.get() + 'px';
                    this.editToolsColDiv.style.top = collider.y.get() + 'px';
                    this.editToolsColDiv.style.borderRadius = '0px';
                }
                else if (collider instanceof WOZLLA.component.CircleCollider) {
                    var radius = collider.radius.get();
                    this.editToolsColDiv.style.left = (collider.centerX.get() - radius) + 'px';
                    this.editToolsColDiv.style.top = (collider.centerY.get() - radius) + 'px';
                    this.editToolsColDiv.style.width = (radius * 2) + 'px';
                    this.editToolsColDiv.style.height = (radius * 2) + 'px';
                    this.editToolsColDiv.style.borderRadius = radius + 'px';
                }
                else {
                    this.editToolsColDiv.style.display = 'none';
                }
            }
            else {
                this.editToolsColDiv.style.display = 'none';
            }
        }
        else {
            this.editToolsPosDiv.style.display = 'none';
            this.editToolsColDiv.style.display = 'none';
        }
    };
    Visual.prototype.onNodeSelect = function (e) {
        var objData = e.data.node;
        this.selectedObjData = objData;
        this.selectedUUID = objData.uuid;
        this.selectedGameObj = objData && uuidMap[objData.uuid];
    };
    Visual.prototype.onOpenFile = function (e) {
        this.reloadStage(e.data.fileData);
        this.fileData = e.data.fileData;
    };
    Visual.prototype.onOpenProject = function (e) {
        // this.engineDirector.assetManager.setBaseURL('file://' + getCurrentProjectPath() + '/');
    };
    Visual.prototype.onReloadClick = function (timestamp) {
        // if(this.playMode){
        //
        //   requestAnimationFrame((timestamp)=>{
        //     this.onReloadClick(timestamp)
        //   });
        // }
        // console.log(timestamp)
        // console.log(this.fileData)
        this.reloadStage(this.fileData);
    };
    Visual.prototype.onDataChange = function (e) {
        if (!this.selectedGameObj)
            return;
        var changes = e.data.changes;
        var needReload = false;
        var needLoadAsset = false;
        for (var _i = 0; _i < changes.length; _i++) {
            var change = changes[_i];
            if (change.op !== 'replace') {
                needReload = true;
                break;
            }
            var paths = change.path.split('/');
            if (paths[paths.length - 2] === 'transform') {
                var key = paths[paths.length - 1];
                var data = {};
                if (key === 'relative' || key === 'anchorMode') {
                    data[key] = change.value;
                }
                else {
                    data[key] = parseFloat(change.value);
                }
                for (var key_1 in data) {
                    this.selectedGameObj.transform[key_1] = data[key_1];
                }
            }
            else if (paths[paths.length - 4] === 'components' && paths[paths.length - 2] === 'properties') {
                // var compIdx = parseInt(paths[paths.length-3]);
                // var compData = this.selectedObjData.components[compIdx];
                // var compName = compData.name;
                // var type = WOZLLA.component.ComponentFactory.getType(compName);
                // var component = this.selectedGameObj.getComponent(type);
                // var propertyName = paths[paths.length-1];
                // var propAnno = WOZLLA.component.ComponentFactory.getAnnotation(compName).getPropertyAnnotation(propertyName);
                // var value = change.value;
                // if(propAnno.propertyType === WOZLLA.component.Type.Int) {
                //     value = parseInt(value);
                // } else if(propAnno.propertyType === WOZLLA.component.Type.Number) {
                //     value = parseFloat(value);
                // }
                // component[propertyName].convert(change.value);
                // this.selectedGameObj.transform.dirty = true;
                needLoadAsset = true;
            }
        }
        if (needReload) {
            this.reloadStage(this.fileData);
        }
        else if (needLoadAsset) {
            this.selectedGameObj.loadAssets();
        }
    };
    Visual.prototype.reloadStage = function (data) {
        var _this = this;
        var director = this.engineDirector;
        this.updateTimer && clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function () {
            _this.updateTimer = null;
            if (!data.root || typeof data.root !== 'object') {
                return;
            }
            var wsonBuilder = WOZLLA.wson.newBuilder();
            uuidMap = {};
            wsonBuilder.buildWithData(director, data, function (err, gameObj) {
                if (err) {
                    console.log(err);
                    return;
                }
                gameObj.loadAssets(function () {
                    gameObj.init();
                });
                _this.dataGameObj && _this.dataGameObj.destroyAndRemove();
                _this.dataGameObj = gameObj;
                director.stage.addChild(gameObj);
                if (_this.selectedUUID) {
                    _this.selectedGameObj = uuidMap[_this.selectedUUID];
                }
            });
        }, 400);
    };
    Visual = __decorate([
        angular2_1.Component({
            selector: 'visual'
        }),
        angular2_1.View({
            template: tpl,
            styles: [css],
            directives: [angular2_1.formDirectives, angular2_1.coreDirectives],
            encapsulation: angular2_1.ViewEncapsulation.NONE,
        }), 
        __metadata('design:paramtypes', [angular2_1.ElementRef])
    ], Visual);
    return Visual;
})();
var GameObjectBuilder = (function (_super) {
    __extends(GameObjectBuilder, _super);
    function GameObjectBuilder() {
        _super.apply(this, arguments);
    }
    GameObjectBuilder.prototype.buildGameObject = function (director, data, callback) {
        _super.prototype.buildGameObject.call(this, director, data, function (err, root) {
            uuidMap[data.uuid] = root;
            callback(err, root);
        });
    };
    GameObjectBuilder.prototype.buildComponent = function (data, owner) {
        var compName = data.name;
        var compAnno = WOZLLA.component.ComponentFactory.getAnnotation(compName);
        var properties = data.properties;
        var component = this.newComponent(compName);
        for (var prop in properties) {
            var property = component[prop];
            if (property) {
                var value = properties[prop];
                var propAnno = compAnno.getPropertyAnnotation(prop);
                if (propAnno && propAnno.propertyType === WOZLLA.component.Type.Int) {
                    value = parseInt(value);
                }
                else if (propAnno && propAnno.propertyType === WOZLLA.component.Type.Number) {
                    value = parseFloat(value);
                }
                property.convert(value);
            }
        }
        return component;
    };
    GameObjectBuilder.prototype.newGameObject = function (director, useRectTransform) {
        if (useRectTransform === void 0) { useRectTransform = false; }
        return new WOZLLA.GameObject(director, useRectTransform);
    };
    GameObjectBuilder.prototype.newComponent = function (compName) {
        return WOZLLA.component.ComponentFactory.create(compName);
    };
    return GameObjectBuilder;
})(WOZLLA.wson.WSONBuilder);
var helpMatrix = new WOZLLA.math.Matrix3x3();
function toCssMatrix(matrix, scale) {
    if (scale === void 0) { scale = 1; }
    var m = helpMatrix;
    m.identity();
    m.appendTransform(0, 0, scale, scale);
    m.append(1, matrix.c, matrix.b, 1, matrix.tx, matrix.ty);
    // m.appendTransform(0, 0, 1/gameObjScale, 1/gameObjScale);
    return "matrix(" + m.a + "," + m.c + "," + m.b + "," + m.d + "," + m.tx + "," + m.ty + ")";
}
module.exports = Visual;
//# sourceMappingURL=Visual.js.map
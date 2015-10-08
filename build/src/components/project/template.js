var WOZLLA = require('wozllajs');
var CompFactory = WOZLLA.component.ComponentFactory;
function genUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
exports.genUUID = genUUID;
exports.sceneFileTemplate = {
    "root": {
        "uuid": "root",
        "name": "root",
        "id": "",
        "active": true,
        "visible": true,
        "touchable": false,
        "transform": {
            "x": 0,
            "y": 0
        }
    }
};
exports.uiFileTemplate = {
    "root": {
        "uuid": "root",
        "name": "root",
        "id": "",
        "active": true,
        "visible": true,
        "touchable": false,
        "rect": true,
        "transform": {
            "px": 0,
            "py": 0
        }
    }
};
function createGameObjTemplate(rect) {
    if (rect === void 0) { rect = false; }
    return {
        "uuid": genUUID(),
        "name": 'GameObject' + Date.now(),
        "active": true,
        "visible": true,
        "touchable": false,
        "rect": rect,
        children: [],
        "transform": {}
    };
}
exports.createGameObjTemplate = createGameObjTemplate;
function applyIfUndefined(target, source) {
    for (var i in source) {
        if (typeof target[i] === 'undefined') {
            target[i] = source[i];
        }
    }
    return target;
}
function getPropertyAnnos(compData) {
    var ret = [];
    var compName = compData.name;
    while (compName) {
        var compAnno = CompFactory.getAnnotation(compName);
        for (var _i = 0, _a = compAnno.properties; _i < _a.length; _i++) {
            var propAnno = _a[_i];
            ret.push(propAnno);
        }
        var superClass = CompFactory.getSuperClass(CompFactory.getType(compName));
        if (superClass) {
            compName = CompFactory.getName(superClass);
        }
        else {
            compName = null;
        }
    }
    return ret;
}
function fillDefaults(data, deep) {
    if (deep === void 0) { deep = true; }
    applyIfUndefined(data, {
        active: true,
        visible: true,
        touchable: false,
        transform: {},
        z: 0,
        rect: false,
        renderLayer: '',
        renderOrder: 0,
        alpha: 1
    });
    if (data.rect) {
        applyIfUndefined(data.transform, {
            px: 0,
            py: 0,
            width: 0,
            height: 0,
            anchorMode: 'Left_Top',
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            skewX: 0,
            skewY: 0,
            relative: true
        });
    }
    else {
        applyIfUndefined(data.transform, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            skewX: 0,
            skewY: 0,
            relative: true
        });
    }
    if (deep && data.children) {
        for (var _i = 0, _a = data.children; _i < _a.length; _i++) {
            var child = _a[_i];
            fillDefaults(child);
        }
    }
    if (data.components) {
        for (var _b = 0, _c = data.components; _b < _c.length; _b++) {
            var comp = _c[_b];
            var annos = getPropertyAnnos(comp);
            var defaults = {};
            for (var _d = 0; _d < annos.length; _d++) {
                var anno = annos[_d];
                defaults[anno.propertyName] = anno.defaultValue;
            }
            applyIfUndefined(comp.properties, defaults);
        }
    }
}
exports.fillDefaults = fillDefaults;
//# sourceMappingURL=template.js.map
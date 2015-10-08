
import WOZLLA = require('wozllajs');
var CompFactory = WOZLLA.component.ComponentFactory;

export function genUUID():string {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
}



export var sceneFileTemplate = {
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

  export var uiFileTemplate = {
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

export function createGameObjTemplate(rect:boolean=false) {
    return {
        "uuid": genUUID(),
        "name": 'GameObject' + Date.now(),
        "active": true,
        "visible": true,
        "touchable": false,
        "rect": rect,
        children:[],
        "transform": {
        }
    };
}

function applyIfUndefined(target, source) {
    for(var i in source) {
        if(typeof target[i] === 'undefined') {
            target[i] = source[i];
        }
    }
    return target;
}

function getPropertyAnnos(compData) {
    var ret = [];
    var compName = compData.name;
    while(compName) {
        let compAnno = CompFactory.getAnnotation(compName);
        for(let propAnno of compAnno.properties) {
            ret.push(propAnno);
        }
        let superClass = CompFactory.getSuperClass(CompFactory.getType(compName));
        if(superClass) {
            compName = CompFactory.getName(superClass);
        } else {
            compName = null;
        }
    }
    return ret;
}

export function fillDefaults(data, deep:boolean=true) {
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

    if(data.rect) {
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
    } else {
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

    if(deep && data.children) {
        for(let child of data.children) {
            fillDefaults(child);
        }
    }

    if(data.components) {
        for(let comp of data.components) {
            let annos = getPropertyAnnos(comp);
            let defaults = {};
            for(let anno of annos) {
                defaults[anno.propertyName] = anno.defaultValue;
            }
            applyIfUndefined(comp.properties, defaults);
        }
    }
}

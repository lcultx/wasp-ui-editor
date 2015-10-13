/// <reference path="../../tsd.d.ts"/>

var global:any = window;
var ts = require('typescript');
var watchjs = require('watchjs');
var jsonpatch = require('fast-json-patch')
var remote = require('remote');
var fs = require('fs');
var nPath = require('path');
var app = remote.require('app');
var dialog = remote.require('dialog');
var template = require('./template');
var $ = require('jquery');
var WOZLLA = require('wozllajs');
export var currentProjectPath = localStorage.getItem('lastOpenProject') || '';
export var currentOpenFile = '';
export var fileData;
export var savable = false;

function updateTitle() {
    var title = currentProjectPath + ' - ' + currentOpenFile;
    if(savable) {
        title = '[未保存] ' + title;
    }
    document.getElementsByTagName('title')[0].innerHTML = title
    $('.prj-title').text(title);
}

if(currentProjectPath) {
    updateTitle();
}

export const eventDispatcher = new WOZLLA.event.EventDispatcher();

export function setSavable(value:boolean=true) {
    savable = value;
    updateTitle();
}

export function save() {
    if(currentOpenFile) {
        fs.writeFileSync(currentProjectPath + '/' + currentOpenFile, JSON.stringify(fileData, null, '  '), 'utf8');
    }
    savable = false;
    updateTitle();
}

global.addEventListener('keydown', function(e) {
    if(e.metaKey || e.ctrlKey) {
        if(e.keyCode === 83) {
            save();
        }
    }
});

export function showProjectFileChooser(callback:(file)=>void) {

    var filepaths = dialog.showOpenDialog({
        defaultPath: currentProjectPath,
        properties: [ 'openFile' ]
    });

    if(filepaths && filepaths[0]) {
        let path = filepaths[0].replace(nPath.join(this.currentProjectPath,'/'), '');
        path = path.replace('tsv2_res' + nPath.sep, '');
        callback(path);
    }
}

export function getCurrentProjectPath() {
    return currentProjectPath;
}

export function handleOpenProject() {
    var filepaths = dialog.showOpenDialog({
        properties: [ 'openDirectory' ]
    });

    if(filepaths && filepaths[0]) {
        currentProjectPath = filepaths[0];
        localStorage.setItem('lastOpenProject', currentProjectPath);
        updateTitle();
        eventDispatcher.dispatchEvent(new WOZLLA.event.Event('openProject', false, {
            projectPath: currentProjectPath
        }));
    }
}

var dataObserver;
export function handleOpenFile(filepath?:string) {
    if(!currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    if(!filepath) {
        var filepaths = dialog.showOpenDialog({
            defaultPath: currentProjectPath,
            properties: [ 'openFile' ],
            filters: [
              { name: 'Custom File Type', extensions: ['json'] }
            ]
        });
        filepath = filepaths[0];
    }

    if(filepath) {
        if(fileData && dataObserver) {
            jsonpatch.unobserve(fileData, dataObserver);
        }
        fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        jsonpatch.observe(fileData, (changes) => {
            setSavable(true);
            eventDispatcher.dispatchEvent(new WOZLLA.event.Event('dataChange', false, {
                changes: changes
            }));
        });
        eventDispatcher.dispatchEvent(new WOZLLA.event.Event('openFile', false, {
            fileData: fileData
        }));
        currentOpenFile = filepath.replace(currentProjectPath + '/', '');
        updateTitle();
    }
}

export function handleNewSceneFile(dirPath?:string) {
    if(!currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    dialog.showSaveDialog({
        defaultPath: dirPath || currentProjectPath,
        filters: [
          { name: 'Custom File Type', extensions: ['json'] }
        ]
    }, (filename) => {
        fs.writeFileSync(filename, JSON.stringify(template.sceneFileTemplate, null, '  '), 'utf8');
    });
}

export function handleNewUIFile(dirPath?:string) {
    if(!currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    dialog.showSaveDialog({
        defaultPath: dirPath || currentProjectPath,
        filters: [
          { name: 'Custom File Type', extensions: ['json'] }
        ]
    }, (filename) => {
        fs.writeFileSync(filename, JSON.stringify(template.uiFileTemplate, null, '  '), 'utf8');
    });
}

export function handleTreeNodeSelect(node){
    eventDispatcher.dispatchEvent(new WOZLLA.event.Event('nodeSelect', false, {
        node:node
    }));
}

export function handleAddComponent(name) {
    eventDispatcher.dispatchEvent(new WOZLLA.event.Event('componentAdd', false, {
        name: name
    }));
}

//http://stackoverflow.com/questions/24356713/node-js-readfile-error-with-utf8-encoded-file-on-windows
export function getSpriteAtlasFileContents(filepath) {
    var data = fs.readFileSync(currentProjectPath + '/tsv2_res/' + filepath, 'utf8');
    return data.toString('utf8').replace(/^\uFEFF/, '');
}

export function getSpriteAtlasImagePath(filepath) {
    return 'file://' + currentProjectPath + '/tsv2_res/' + filepath.replace('.json', '.png');
}

export function reloadCustomComponents(callback) {
    if(!currentProjectPath) {
        callback && callback();
        return;
    }
    var configData;
    var configFilePath = currentProjectPath + '/IDEConfig.json';
    if(!fs.existsSync(configFilePath)) {
        callback && callback();
        return;
    }
    try {
        configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    } catch(e) {
        callback && callback();
        alert('配置错误.');
        return;
    }

    if(!configData || !configData.tsFiles || configData.tsFiles.length === 0) {
        callback && callback();
        return;
    }

    let tsFiles = configData.tsFiles.slice(0);

    tsFiles.forEach((file, idx) => {
        tsFiles[idx] = currentProjectPath + '/' + file;
    });

    var code = compileTs(tsFiles, {
        declarationFiles: false,
        target: ts.ScriptTarget.ES5,
        out: currentProjectPath + '/.IDE/comps.js',
        experimentalDecorators: true,
        noEmitOnError: true
    });

    if(fs.existsSync(currentProjectPath + '/.IDE/comps.js')) {
        callback && callback(currentProjectPath + '/.IDE/comps.js');
    } else {
        alert('编译失败');
        callback && callback();
    }
}

function compileTs(fileNames: string[], options): number {
    var program = ts.createProgram(fileNames, options);
    var emitResult = program.emit();

    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach((diagnostic) => {
        var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    return emitResult.emitSkipped ? 1 : 0;
}

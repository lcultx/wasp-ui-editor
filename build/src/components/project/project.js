var global = window;
var ts = require('typescript');
var watchjs = require('watchjs');
var jsonpatch = require('fast-json-patch');
var remote = require('remote');
var fs = require('fs');
var nPath = require('path');
var app = remote.require('app');
var dialog = remote.require('dialog');
var template = require('./template');
var $ = require('jquery');
var WOZLLA = require('wozllajs');
exports.currentProjectPath = localStorage.getItem('lastOpenProject') || '';
exports.currentOpenFile = '';
exports.savable = false;
function updateTitle() {
    var title = exports.currentProjectPath + ' - ' + exports.currentOpenFile;
    if (exports.savable) {
        title = '[未保存] ' + title;
    }
    document.getElementsByTagName('title')[0].innerHTML = title;
    $('.prj-title').text(title);
}
if (exports.currentProjectPath) {
    updateTitle();
}
exports.eventDispatcher = new WOZLLA.event.EventDispatcher();
function setSavable(value) {
    if (value === void 0) { value = true; }
    exports.savable = value;
    updateTitle();
}
exports.setSavable = setSavable;
function save() {
    if (exports.currentOpenFile) {
        fs.writeFileSync(exports.currentProjectPath + '/' + exports.currentOpenFile, JSON.stringify(exports.fileData, null, '  '), 'utf8');
    }
    exports.savable = false;
    updateTitle();
}
exports.save = save;
global.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey) {
        if (e.keyCode === 83) {
            save();
        }
    }
});
function showProjectFileChooser(callback) {
    var filepaths = dialog.showOpenDialog({
        defaultPath: exports.currentProjectPath,
        properties: ['openFile']
    });
    if (filepaths && filepaths[0]) {
        var path = filepaths[0].replace(nPath.join(this.currentProjectPath, '/'), '');
        path = path.replace('tsv2_res' + nPath.sep, '');
        callback(path);
    }
}
exports.showProjectFileChooser = showProjectFileChooser;
function getCurrentProjectPath() {
    return exports.currentProjectPath;
}
exports.getCurrentProjectPath = getCurrentProjectPath;
function handleOpenProject() {
    var filepaths = dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (filepaths && filepaths[0]) {
        exports.currentProjectPath = filepaths[0];
        localStorage.setItem('lastOpenProject', exports.currentProjectPath);
        updateTitle();
        exports.eventDispatcher.dispatchEvent(new WOZLLA.event.Event('openProject', false, {
            projectPath: exports.currentProjectPath
        }));
    }
}
exports.handleOpenProject = handleOpenProject;
var dataObserver;
function handleOpenFile(filepath) {
    if (!exports.currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    if (!filepath) {
        var filepaths = dialog.showOpenDialog({
            defaultPath: exports.currentProjectPath,
            properties: ['openFile'],
            filters: [
                { name: 'Custom File Type', extensions: ['json'] }
            ]
        });
        filepath = filepaths[0];
    }
    if (filepath) {
        if (exports.fileData && dataObserver) {
            jsonpatch.unobserve(exports.fileData, dataObserver);
        }
        exports.fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        jsonpatch.observe(exports.fileData, function (changes) {
            setSavable(true);
            exports.eventDispatcher.dispatchEvent(new WOZLLA.event.Event('dataChange', false, {
                changes: changes
            }));
        });
        exports.eventDispatcher.dispatchEvent(new WOZLLA.event.Event('openFile', false, {
            fileData: exports.fileData
        }));
        exports.currentOpenFile = filepath.replace(exports.currentProjectPath + '/', '');
        updateTitle();
    }
}
exports.handleOpenFile = handleOpenFile;
function handleNewSceneFile(dirPath) {
    if (!exports.currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    dialog.showSaveDialog({
        defaultPath: dirPath || exports.currentProjectPath,
        filters: [
            { name: 'Custom File Type', extensions: ['json'] }
        ]
    }, function (filename) {
        fs.writeFileSync(filename, JSON.stringify(template.sceneFileTemplate, null, '  '), 'utf8');
    });
}
exports.handleNewSceneFile = handleNewSceneFile;
function handleNewUIFile(dirPath) {
    if (!exports.currentProjectPath) {
        alert('请先打开一个项目');
        return;
    }
    dialog.showSaveDialog({
        defaultPath: dirPath || exports.currentProjectPath,
        filters: [
            { name: 'Custom File Type', extensions: ['json'] }
        ]
    }, function (filename) {
        fs.writeFileSync(filename, JSON.stringify(template.uiFileTemplate, null, '  '), 'utf8');
    });
}
exports.handleNewUIFile = handleNewUIFile;
function handleTreeNodeSelect(node) {
    exports.eventDispatcher.dispatchEvent(new WOZLLA.event.Event('nodeSelect', false, {
        node: node
    }));
}
exports.handleTreeNodeSelect = handleTreeNodeSelect;
function handleAddComponent(name) {
    exports.eventDispatcher.dispatchEvent(new WOZLLA.event.Event('componentAdd', false, {
        name: name
    }));
}
exports.handleAddComponent = handleAddComponent;
function getSpriteAtlasFileContents(filepath) {
    var data = fs.readFileSync(exports.currentProjectPath + '/tsv2_res/' + filepath, 'utf8');
    return data.toString('utf8').replace(/^\uFEFF/, '');
}
exports.getSpriteAtlasFileContents = getSpriteAtlasFileContents;
function getSpriteAtlasImagePath(filepath) {
    return 'file://' + exports.currentProjectPath + '/tsv2_res/' + filepath.replace('.json', '.png');
}
exports.getSpriteAtlasImagePath = getSpriteAtlasImagePath;
function reloadCustomComponents(callback) {
    if (!exports.currentProjectPath) {
        callback && callback();
        return;
    }
    var configData;
    var configFilePath = exports.currentProjectPath + '/IDEConfig.json';
    if (!fs.existsSync(configFilePath)) {
        callback && callback();
        return;
    }
    try {
        configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    }
    catch (e) {
        callback && callback();
        alert('配置错误.');
        return;
    }
    if (!configData || !configData.tsFiles || configData.tsFiles.length === 0) {
        callback && callback();
        return;
    }
    var tsFiles = configData.tsFiles.slice(0);
    tsFiles.forEach(function (file, idx) {
        tsFiles[idx] = exports.currentProjectPath + '/' + file;
    });
    var code = compileTs(tsFiles, {
        declarationFiles: false,
        target: ts.ScriptTarget.ES5,
        out: exports.currentProjectPath + '/.IDE/comps.js',
        experimentalDecorators: true,
        noEmitOnError: true
    });
    if (fs.existsSync(exports.currentProjectPath + '/.IDE/comps.js')) {
        callback && callback(exports.currentProjectPath + '/.IDE/comps.js');
    }
    else {
        alert('编译失败');
        callback && callback();
    }
}
exports.reloadCustomComponents = reloadCustomComponents;
function compileTs(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    var emitResult = program.emit();
    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach(function (diagnostic) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
    });
    return emitResult.emitSkipped ? 1 : 0;
}
//# sourceMappingURL=project.js.map
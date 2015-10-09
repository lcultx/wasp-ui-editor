console.log('code in vs !!!!!!!!!!!!!!!!!!!!!!!!!!!!');
var mainPanelView_1 = require('./atom/views/mainPanelView');
var atomUtils = require("./atom/atomUtils");
function activate(state) {
    var _this = this;
    console.log('activate');
    atom.commands.add('.tree-view .file .name[data-name$=\\.cson]', 'wasp-ui-editor:openfile', function (e) {
        _this.openfile(e);
    });
    atomUtils.registerOpener({
        commandSelector: 'atom-workspace',
        commandName: 'typescript:dependency-view',
        uriProtocol: mainPanelView_1.waspUIEditorURI,
        getData: function () {
            return {
                filePath: atomUtils.getCurrentPath()
            };
        },
        onOpen: function (data) {
            return new mainPanelView_1.WaspUIEditorView(data.filePath);
        }
    });
}
exports.activate = activate;
function openfile(e) {
    console.log(e);
    var filePath = e.target.dataset.path;
    console.log(filePath);
    atom.workspace.open(atomUtils.uriForPath(mainPanelView_1.waspUIEditorURI, this.filePath), { searchAllPanes: true });
}
exports.openfile = openfile;
function deactivate() {
    console.log('deactivate');
}
exports.deactivate = deactivate;
function serialize() {
    console.log('serialize');
}
exports.serialize = serialize;
function toggle() {
    console.log('toggle');
}
exports.toggle = toggle;
//# sourceMappingURL=waspUIEditor.js.map
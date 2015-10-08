var fsu = require("../utils/fsUtil");
var url = require('url');
function getCurrentPath() {
    var editor = atom.workspace.getActiveTextEditor();
    return fsu.consistentPath(editor.getPath());
}
exports.getCurrentPath = getCurrentPath;
function uriForPath(uriProtocol, filePath) {
    return uriProtocol + "//" + filePath;
}
exports.uriForPath = uriForPath;
function registerOpener(config) {
    atom.commands.add(config.commandSelector, config.commandName, function (e) {
        var uri = uriForPath(config.uriProtocol, getCurrentPath());
        atom.workspace.open(uri, config.getData());
    });
    atom.workspace.addOpener(function (uri, data) {
        try {
            var protocol = url.parse(uri).protocol;
        }
        catch (error) {
            return;
        }
        if (protocol !== config.uriProtocol) {
            return;
        }
        return config.onOpen(data);
    });
}
exports.registerOpener = registerOpener;
//# sourceMappingURL=atomUtils.js.map
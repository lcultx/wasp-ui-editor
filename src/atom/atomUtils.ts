import * as fsu from "../utils/fsUtil";
import url = require('url');
import path = require('path');

/** Gets the consisten path for the current editor */
export function getCurrentPath() {
    var editor = atom.workspace.getActiveTextEditor();
    return fsu.consistentPath(editor.getPath());
}

/**
 * Uri for filepath based on protocol
 */
export function uriForPath(uriProtocol: string, filePath: string) {
    return uriProtocol + "//" + filePath;
}

export function registerOpener<T>(config:any) {
    atom.commands.add(config.commandSelector, config.commandName, (e) => {

        var uri = uriForPath(config.uriProtocol, getCurrentPath());

        atom.workspace.open(uri, config.getData());
    });

    atom.workspace.addOpener(function(uri, data: T) {
        try {
            var {protocol} = url.parse(uri);
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

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

export function loadScript(url,callback) {
  var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  var  script;
  var  options;

  if (typeof url === "object") {
    options = url;
    url = undefined;
  }
  var s = options || {};
  url = url || s.url;
  callback = callback || s.success;
  script = document.createElement("script");
  script.async = s.async || false;
  script.type = "text/javascript";
  if (s.charset) {
    script.charset = s.charset;
  }
  if(s.cache === false){
    url = url+( /\?/.test( url ) ? "&" : "?" )+ "_=" +(new Date()).getTime();
  }
  script.src = url;
  head.insertBefore(script, head.firstChild);
  if(callback){
    document.addEventListener ? script.addEventListener("load", callback, false) : script.onreadystatechange = function() {
      if (/loaded|complete/.test(script.readyState)) {
        script.onreadystatechange = null
        callback()
      }
    }
  }
}

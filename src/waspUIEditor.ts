
console.log('code in vs !!!!!!!!!!!!!!!!!!!!!!!!!!!!');
import {$} from "atom-space-pen-views";
import url = require('url');
import {WaspUIEditorView,waspUIEditorURI} from './atom/views/mainPanelView';
import atomUtils = require("./atom/atomUtils");
export interface PackageState {
}



export function activate(state: PackageState) {
  console.log('activate')
    atom.commands.add('.tree-view .file .name[data-name$=\\.cson]', 'wasp-ui-editor:openfile', (e) => {
      this.openfile(e);
    });

    atomUtils.registerOpener({
        commandSelector: 'atom-workspace',
        commandName: 'typescript:dependency-view',
        uriProtocol: waspUIEditorURI,
        getData: () => {
            return {
                filePath: atomUtils.getCurrentPath()
            };
        },
        onOpen: (data) => {
            return new WaspUIEditorView(data.filePath);
        }
    });


}






export function openfile(e){
  console.log(e);
  var filePath = e.target.dataset.path;
  console.log(filePath)
  atom.workspace.open(atomUtils.uriForPath(waspUIEditorURI, this.filePath), {searchAllPanes: true});
}

export function deactivate(){
  console.log('deactivate');
}

export function serialize(){
  console.log('serialize')
}

export function toggle(){
  console.log('toggle')
}

import sp = require('atom-space-pen-views');
import atomUtils = require('../atomUtils');
export var waspUIEditorURI = "ts-dependency:";
var prefix = '../../../..';


export class WaspUIEditorView<Options> extends sp.ScrollView {



  static content() {
        return this.div({ class: 'wasp-ui-editor' }, () => {
        });
    }

    get $(): JQuery {
        return <any>this;
    }

    constructor(public filePath) {
        super();
        this.init();
    }
    init() {
      console.log('wasp-ui-editor start render');
      var rootElement = this.$[0];
      rootElement.innerHTML = `
      <application>
            <div class="loading">
              Loading...
            </div>
      </application>
      <script>alert('a')</script>



      `;
      startMain();

    }



    getURI = () => atomUtils.uriForPath(waspUIEditorURI, this.filePath);
    getTitle = () => 'WaspUIEditor'
    getIconName = () => 'git-compare'

}

/*
<script src="./library/CanvasTextWrapper.js"></script>
<script src="./library/traceur-runtime@0.0.87.js"></script>
<script src="./library/system@0.16.11.js"></script>
<script src="./config.js"></script>

<script src="./library/Reflect.js"></script>
<script src="./library/ace/ace.js"></script>
<script src="./library/ace/mode-json.js"></script>
<script src="./library/ace/theme-terminal.js"></script>
<script>
  System.import('build/src/main');
</script>

*/
export function startMain(){

  var prefix = '../../../..';

  require(prefix + '/library/CanvasTextWrapper');

  require(prefix + '/library/traceur-runtime@0.0.87');
  require(prefix + '/library/es6-module-loader@0.16.6');
   require(prefix + '/library/system@0.16.11');
  require(prefix + '/library/angular2.prepare');
  // require(prefix + '/library/ace/ace');
  // require(prefix + '/library/ace/mode-json');
  // require(prefix + '/library/ace/theme-terminal');
  //require(prefix + '/config.js');

  require(prefix + '/build/src/main');
}

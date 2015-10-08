
declare module 'atom-space-pen-views' {
    import atom = require('atom');
    export class SelectListView extends atom.SelectListView { }
    export class ScrollView extends atom.ScrollView { }
    export class View extends atom.View { }
    export var $: JQueryStatic;
}

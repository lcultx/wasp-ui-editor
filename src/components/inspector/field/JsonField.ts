import $ = require('jquery');
import {Component, View, coreDirectives, formDirectives} from 'angular2/angular2';
import ng2 = require('angular2/angular2');
import ng2Helper = require('../../ng2-library/ng2Helper');
import {JsonDialog, IJsonProvider} from '../../dark-ui/dialog/JsonDialog';
import {
    showProjectFileChooser
} from '../../project/project';

@Component({
  selector: 'json-field',
  properties: ['property', 'value', 'compdata']
})
@View({
  template: `
    <input readonly="true" value="[Json]" (click)="onClick()">
    <json-dialog [title]="getTitle()" [jsonprovider]="getDataProvider()" show-action="before:click"></json-dialog>
  `,
  styles: [],
  directives: [coreDirectives, formDirectives, JsonDialog]
})
class JsonField {

    compdata:any;
    value:string;
    property:string;

    jsonProvider;

    getTitle():string {
        return this.compdata.name + ' - ' + this.property;
    }

    getDataProvider():any {
        this.jsonProvider = this.jsonProvider || new JsonProvider(this.compdata, this.property);
        return this.jsonProvider;
    }

    constructor() {
    }

    onClick() {

    }

}

class JsonProvider implements IJsonProvider {

    get data():any {
        return this.compdata.properties[this.property];
    }

    set data(value:any) {
        this.compdata.properties[this.property] = value;
    }

    constructor(public compdata, public property) {}
}

export = JsonField;

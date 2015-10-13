import {ExecTimeService as execTime} from '../exec-time/service';

import ng = require('angular2/angular2');
import $ = require('jquery');
import project = require('../project/project');
var fs = require('fs');


import {FileTree,Menu,Item} from '../dark-ui/ui';
import {ExplorerService} from './service';


//import fs = require('fs');
@ng.Component({
  selector:'explorer',
})
@ng.View({
  template:require('./explorer.html'),
  styles:[require('./explorer.css')],
  directives:[FileTree,Menu,Item,ng.coreDirectives],
  encapsulation:ng.ViewEncapsulation.NONE
})
export class Explorer{
  data:any;

  $element:JQuery;

  explorerService:ExplorerService;

  constructor(private el:ng.ElementRef,@ng.Inject(ExplorerService) explorerService:ExplorerService){
    this.$element = $(el.nativeElement);
    execTime.step('Explorer Init');
    explorerService.getDataAsync((data)=>{
      execTime.step('explorerService.getDataAsync success')
      this.data = data;
    });
    this.explorerService = explorerService;
  }

  onFilterCheckboxChange(){
    var unExpectList = [];

    var filterItems = this.$element.find('.filter').find('item');
    filterItems.each((index,item)=>{
      var $item = $(item);
      var checked = $item.find('input').is(':checked');
      if(!checked){
        unExpectList.push( $item.find('input').val());
      }
    });

    this.explorerService.updateHideFileTypeList(unExpectList);
    console.log(this);
  }


  onSelectNode(ev){

    if(!ev.is_dir){
        var fileData = JSON.parse(fs.readFileSync(ev.path, 'utf8'));
        project.handleOpenFile(ev.path);
    }else{
      this.explorerService.openDir(ev);
    }


  }

  onAddNode(ev){

  }

  onRemoveNode(ev){

  }

  noCopyNode(ev){

  }

  noNodeDropped(ev){

  }

  onNodeClick(ev){
    if(ev.is_dir){
        this.explorerService.openDir(ev);
    }
  }

  onNodeDblClick(ev){
    console.log('onNodeDblClick',ev);
  }

  toggleFitterListCheckbox(){

    var menu = this.$element.find('.toolbar>.filter').find('menu');
    var status = menu.css('display');
    if(status == "none"){
      menu.show();
    }else{
      menu.hide();
    }

  }


}

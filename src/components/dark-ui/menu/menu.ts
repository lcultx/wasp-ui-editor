import ng = require('angular2/angular2');
import $ = require('jquery');

const css = require('./menu.css');

var hoverOpenMenuList = [];

@ng.Component({
  selector:'menu'
})

@ng.View({
  template:`
  <ul>
    <ng-content></ng-content>
  </ul>

  `,styles:[css],encapsulation:ng.ViewEncapsulation.NONE
})

export class Menu{
  $element:JQuery;

  constructor(private el:ng.ElementRef){

    this.$element = $(el.nativeElement);
    var showAction = this.$element.attr('show-action');
    if(showAction == "parent:hover"){
      var parent = this.$element.parent();
      parent.hover((e)=>{
        Menu.closeAlHoverMenu();
        var offset = parent.offset();
        this.$element.css({
          position:'fixed',top:offset.top,left:offset.left + parent[0].scrollWidth
        });
        this.open();
        hoverOpenMenuList.push(this);
      },(e)=>{
        //this.$element.hide()
      })
    }

  }

  open(){
    this.$element.show();
  }

  close(){
    this.$element.hide();
  }

  static closeAlHoverMenu(){
    for(var i in hoverOpenMenuList){
      var menu = hoverOpenMenuList[i];
      menu.close();
    }
  }
}

@ng.Component({
  selector:'item'
})

@ng.View({
  template:`
  <li>
    <ng-content></ng-content>
  </li>
  `,
  directives:[]
})
export class Item{
    $element:JQuery;
  constructor(private el:ng.ElementRef){
    this.$element = $(el.nativeElement);

  }
}

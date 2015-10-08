import ng = require('angular2/angular2');
import $ = require('jquery');

var openingContextmenu = null;

@ng.Component({
  selector:'contextmenu'
})

@ng.View({
  template:require('./contextmenu.html'),styles:[require('./contextmenu.css')],
  encapsulation:ng.ViewEncapsulation.NONE
})

export class Contextmenu{
  $element:JQuery;
    constructor(private el:ng.ElementRef){
      this.$element = $(el.nativeElement);
      var $parent = this.$element.parent();

      $parent.on('contextmenu',(e)=>{
        this.draw(e.pageX,e.pageY);
      })

    }

    open(top,left){
      var contentmenu = this.$element.children('.contextmenu');
      contentmenu.show();
      contentmenu.css({
        position:'fixed',left:left,top:top
      });
    }

    close(){
      this.$element.children('.contextmenu').hide();
    }

    static closeAll(){
      if(openingContextmenu){
        openingContextmenu.close()
      }
    }

    draw(pageX,pageY){
      if(openingContextmenu){
        openingContextmenu.close();
      }
      openingContextmenu = this;
      openingContextmenu.open(pageY,pageX);
    }
}

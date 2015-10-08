
import angular2 = require('angular2/angular2');
//因为issue1831 parent无法直接注入到子类，但可以通过辅助方法由viewContrainer取出
//https://github.com/angular/angular/issues/1831
export function getParentFromViewContainer(viewContainer:angular2.ViewContainerRef):any{
  return (<any>viewContainer.element.parentView)._view.context;
}

export function getJQueryElementFromViewContainer(viewContainer:angular2.ViewContainerRef){
    var ngElement =viewContainer.element;
    var domElement:HTMLElement = (<any>ngElement).nativeElement;
    var $elem = $(domElement);
    return $elem;
}

export function getTemplateUrlByComponentName(componentName){
  return 'src/components/' + componentName + '/' + componentName  + '.html';
}

export function getTemplateUrlByComponentPath(componentPath){
  return './src/components/' + componentPath + '.html';
}

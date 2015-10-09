//因为issue1831 parent无法直接注入到子类，但可以通过辅助方法由viewContrainer取出
//https://github.com/angular/angular/issues/1831
function getParentFromViewContainer(viewContainer) {
    return viewContainer.element.parentView._view.context;
}
exports.getParentFromViewContainer = getParentFromViewContainer;
function getJQueryElementFromViewContainer(viewContainer) {
    var ngElement = viewContainer.element;
    var domElement = ngElement.nativeElement;
    var $elem = $(domElement);
    return $elem;
}
exports.getJQueryElementFromViewContainer = getJQueryElementFromViewContainer;
function getTemplateUrlByComponentName(componentName) {
    return 'src/components/' + componentName + '/' + componentName + '.html';
}
exports.getTemplateUrlByComponentName = getTemplateUrlByComponentName;
function getTemplateUrlByComponentPath(componentPath) {
    return './src/components/' + componentPath + '.html';
}
exports.getTemplateUrlByComponentPath = getTemplateUrlByComponentPath;
//# sourceMappingURL=ng2Helper.js.map
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
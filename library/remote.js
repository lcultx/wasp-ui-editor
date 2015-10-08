
exports.fetch = function(load, fetch) {
  //console.log('remote fetch');
  return '';
}

exports.translate = function(load) {
  //console.log('remote translate');
  return 'module.exports = null';
}

exports.instantiate = function(load) {
  //console.log(' remote instantiate',load);
  var split = load.address.split('/');
  var name = split.pop().split('.remote')[0];
  var _module = window.require('remote').require(name);
  return _module;
};

 exports.bundle = function(loads, opts) {
   console.log(' remote bundle');
 };


var pathConfig = {
    "*":"*.js",
    "jquery":"./library/jquery-1.11.3.js",
    "angular2/*":"./library/angular2.a39.js",//min.js is 2.0.0-alpha.34 , master is build by github master branch
    "angular2/router":"./library/router.a39.dev.js",//@2.0.0-alpha.34
    "wozllajs":"./Engine/WOZLLA.js",
    "eventemitter3":'./node_modules/eventemitter3/index.js',
    "exec-time":"./library/exec-time.js"
  }

var Module = require("module");
var path = require("path");
var fs = require("fs");
var oldResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent){
  

  if(request == 'angular2/angular2'){
    return path.join(__dirname,pathConfig["angular2/*"]);
  }
  
  if(request == "angular2/router"){
    return path.join(__dirname,pathConfig["angular2/router"]);
  }
  
  var path = oldResolve.apply(this,arguments);
  
  if(!fs.existsSync(path)){
   // console.log(request, parent,path);
  };
  return path;


}

require()

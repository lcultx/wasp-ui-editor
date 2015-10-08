System.config({
  "paths":{
    "*":"*.js",
    "jquery":"./library/jquery-1.11.3.js",
    "angular2/*":"./library/angular2.min.js",//min.js is 2.0.0-alpha.34 , master is build by github master branch
    "angular2/router":"./library/router.dev.js",//@2.0.0-alpha.34
    "wozllajs":"./Engine/WOZLLA.js",
    "eventemitter3":'./node_modules/eventemitter3/index.js',
    "exec-time":"./library/exec-time.js"
  },
  map: {
    "remote": "library/remote"
  }
});

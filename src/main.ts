/// <reference path="./tsd.d.ts"/>
var prefix = '../../';
require(prefix + '/fix_module_load');
import {bootstrap} from 'angular2/angular2';
import router = require('angular2/router');

console.log('load angular success!')

import Application = require('./components/application/Application');
 import {DBService} from './components/db/DBService';
 import {ExplorerService} from './components/explorer/service';
 import {ExecTimeService as execTime} from './components/exec-time/service';
 import {EventService} from './components/event/service';
 //require('./components/webworks/service');
export function main() {
  execTime.beginProfiling();
  execTime.step('main()');

  bootstrap(Application,[router.routerInjectables,
     DBService,
     ExplorerService,
     EventService
  ]);
  console.log('exec main function')
}



main();

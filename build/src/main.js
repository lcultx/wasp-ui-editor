var angular2_1 = require('angular2/angular2');
var router = require('angular2/router');
var Application = require('./components/application/Application');
var DBService_1 = require('./components/db/DBService');
var service_1 = require('./components/explorer/service');
var service_2 = require('./components/exec-time/service');
var service_3 = require('./components/event/service');
function main() {
    service_2.ExecTimeService.beginProfiling();
    service_2.ExecTimeService.step('main()');
    angular2_1.bootstrap(Application, [router.routerInjectables,
        DBService_1.DBService,
        service_1.ExplorerService,
        service_3.EventService
    ]);
}
exports.main = main;
main();
//# sourceMappingURL=main.js.map
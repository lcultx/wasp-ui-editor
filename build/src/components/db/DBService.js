var service_1 = require('../exec-time/service');
var electron_1 = require('../electron/electron');
var project = require('../project/project');
var Datastore = electron_1.remote.require('nedb');
var nPath = require('path');
var DBService = (function () {
    function DBService() {
        service_1.ExecTimeService.step('db.DBService init');
        this.db = new Datastore({ filename: nPath.join(project.currentProjectPath, '.IDE/tmp.db'), autoload: true });
    }
    DBService.prototype.getDb = function () {
        return this.db;
    };
    return DBService;
})();
exports.DBService = DBService;
//# sourceMappingURL=DBService.js.map
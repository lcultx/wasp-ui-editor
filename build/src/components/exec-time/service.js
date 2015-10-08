var execTime = require('exec-time'), profiler = new execTime('Wozlla IDE');
var ExecTimeService = (function () {
    function ExecTimeService() {
    }
    ExecTimeService.beginProfiling = function () {
        profiler.beginProfiling();
    };
    ExecTimeService.step = function (msg) {
        profiler.step(msg);
    };
    ExecTimeService.prototype.step = function (msg) {
        profiler.step(msg);
    };
    return ExecTimeService;
})();
exports.ExecTimeService = ExecTimeService;
window.ExecTimeService = ExecTimeService;
//# sourceMappingURL=service.js.map
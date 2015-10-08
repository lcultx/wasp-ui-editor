var EventEmitter = require('eventemitter3');
var EventService = (function () {
    function EventService() {
        this.eventEmitter = new EventEmitter();
    }
    EventService.prototype.emit = function (name, ev) {
        this.eventEmitter.emit(name, ev);
    };
    EventService.prototype.on = function (name, callback) {
        this.eventEmitter.on(name, function (ev) {
            callback(ev);
        });
    };
    return EventService;
})();
exports.EventService = EventService;
//# sourceMappingURL=service.js.map
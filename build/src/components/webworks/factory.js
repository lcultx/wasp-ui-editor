var WozllaWorker = (function () {
    function WozllaWorker(task) {
        var global = window;
        global.URL = global.URL || global.webkitURL;
        var response = "onmessage=function(event){(" + task + ")(event.data,postMessage);}";
        console.log(response);
        var blob;
        try {
            blob = new Blob([response], { type: 'application/javascript' });
        }
        catch (e) {
            var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder;
            blob = new BlobBuilder();
            blob.append(response);
            blob = blob.getBlob();
        }
        this.worker = new Worker(URL.createObjectURL(blob));
    }
    WozllaWorker.prototype.run = function (data, callback) {
        this.worker.onmessage = function (e) {
            callback(null, e.data);
        };
        this.worker.onerror = function (e) {
            callback(e);
            return false;
        };
        this.worker.postMessage(data);
    };
    return WozllaWorker;
})();
exports.WozllaWorker = WozllaWorker;
//# sourceMappingURL=factory.js.map
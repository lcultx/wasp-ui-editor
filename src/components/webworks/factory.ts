// based off of http://stackoverflow.com/a/10372280/938089

export class WozllaWorker {
  private worker:Worker;
  constructor(task:(data:any,callback:(result)=>any)=>any){
    let global:any = <any>window;
    global.URL = global.URL || global.webkitURL;

    var response = "onmessage=function(event){(" + task + ")(event.data,postMessage);}";
    console.log(response);
    var blob;
    try {
        blob = new Blob([response], {type: 'application/javascript'});
    } catch (e) { // Backwards-compatibility
        let BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder;
        blob = new BlobBuilder();
        blob.append(response);
        blob = blob.getBlob();
    }
    this.worker = new Worker(URL.createObjectURL(blob));
  }

  run(data,callback:(err,result?:any)=>any){

    this.worker.onmessage = function(e) {
        callback(null, e.data);
    };
    this.worker.onerror = function(e) {
        callback(e);
        return false;
    };
    this.worker.postMessage(data);
  }
}

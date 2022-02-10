class TimePromise extends Promise {

  constructor(callback, timeout){

    const status = {
      "resolved": false,
      "pending": true,
      "rejected": false,
      "timedout": false
    };

    let res, rej;

    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      return callback(res, rej, status);
    });
    this.resolve = res;
    this.reject = rej;
    this.status = status;

/*
    this.then(
      () => {
        this.status.pending = false;
        this.status.resolved = true;
      },
      () => {
        this.status.pending = false;
        this.status.rejected = true;
      }
    );
*/

    if(timeout !== undefined){
      this.timeout = setTimeout(() => {
        if(!this.status.pending) return;
        this.status.timedout = true;
        this.status.pending = false;
        this.resolve(null);
      }, timeout);
    }
  }
}

/*
function TimePromise(callback, timeout){

}
*/

module.exports = TimePromise;
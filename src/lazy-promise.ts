
export default class LazyPromise<T> extends Promise<T> {

    private _isSent = false;

    get isSent() { return this._isSent; }

    private _resolve;
    private _reject;

    constructor(private _callback: () => Promise<any>) {
        super((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    then(onFulfilled?, onRejected?) {
        if (!this._isSent) {
            this.send();
        }
        return super.then(onFulfilled, onRejected);
    }

    send() {
        this._callback().then(
            (...params) => this._resolve(...params),
            (...params) => this._reject(...params)
        );
        this._isSent = true;
    }
}

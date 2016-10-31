
export default class LazyPromise<T> extends Promise<T> {

    private _sent = false;
    get sent() { return this._sent; }

    private _resolve;
    private _reject;

    constructor(private _callback: () => Promise<any>) {
        super((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    then(onFulfilled?, onRejected?) {
        if (!this._sent) {
            this.send();
        }
        return super.then(onFulfilled, onRejected);
    }

    send() {
        this._sent = true;
        return this._callback().then(
            (...params) => this._resolve(...params),
            (...params) => this._reject(...params)
        );
    }
}

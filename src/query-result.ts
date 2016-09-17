import LazyPromise from "./lazy-promise";
import { createUnsafeSQL } from './utils';


export default class QueryResult<T> extends LazyPromise<T> {

    constructor(callback: () => Promise<T>, private _processedQuery) {
        super(callback);
    }

    toSQL() {
        return this._processedQuery;
    }

    toUnsafeSQL() {
        return createUnsafeSQL(this._processedQuery);
    }
}

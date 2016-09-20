import LazyPromise from "../lazy-promise";
import QueryProcessor from "../query-processor";


export default class QueryResult<T> extends LazyPromise<T> {

    constructor(private _queryProcessor: QueryProcessor, private _query) {
        super(() => _queryProcessor.execute(_query));
    }

    toParameterizedSQL() {
        return this._queryProcessor.convertToParameterizedSQL(this._query);
    }

    toSQL() {
        return this._queryProcessor.convertToSQL(this._query);
    }

    toStream() {
        return this._queryProcessor.executeAsStream(this._query);
    }
}

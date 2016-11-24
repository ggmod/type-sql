import QueryProcessor from "./query-processor";
import { convertQueryToParameterizedSQL } from './converter/parameterized-converter';
import { convertQueryToSQL } from './converter/sql-converter';


export interface QueryProcessorOptions {
    lineBreaks?: boolean,
    parameterized?: boolean
}

export default class DefaultQueryProcessor implements QueryProcessor {

    constructor(private _options = <QueryProcessorOptions>{}) {}

    private _sql: string;
    get sql() { return this._sql; }

    private _params: any[];
    get params() { return this._params; }

    execute<T>(query): Promise<T> {
        if (this._options.parameterized) {
            let result = convertQueryToParameterizedSQL(query, this._options.lineBreaks);
            this._sql = result.sql;
            this._params = result.params;
        } else {
            this._sql = convertQueryToSQL(query, this._options.lineBreaks);
        }
        return Promise.resolve();
    }
}

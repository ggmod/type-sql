import QueryProcessor from "./query-processor";
import { convertQueryToParameterizedSQL } from './converter/parameterized-converter';
import { convertQueryToSQL } from './converter/sql-converter';
import {QueryOptions} from "./converter/query-converter";

// TODO default options, Partial<>

export interface QueryProcessorOptions {
    lineBreaks?: boolean,
    parameterized?: boolean
}

export default class DefaultQueryProcessor implements QueryProcessor {

    private _queryOptions: QueryOptions;

    constructor(private _options = <QueryProcessorOptions>{}) {
        this._queryOptions = {
            lineBreak: _options.lineBreaks ? '\n' : ' ',
            nameEscape: '"'
        }
    }

    private _sql: string;
    get sql() { return this._sql; }

    private _params: any[];
    get params() { return this._params; }

    execute<T>(query: any): Promise<T> {
        if (this._options.parameterized) {
            let result = convertQueryToParameterizedSQL(query, this._queryOptions);
            this._sql = result.sql;
            this._params = result.params;
        } else {
            this._sql = convertQueryToSQL(query, this._queryOptions);
        }
        return Promise.resolve({}) as any;
    }
}

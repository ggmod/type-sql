import QueryProcessor from "../query-processor";
import { convertQueryToParameterizedSQL } from '../converter/parameterized-converter';
import { convertQueryToSQL } from '../converter/sql-converter';
import {QueryOptions} from "../converter/query-converter";
import {convertResult} from "./result-converter";

// TODO default options, Partial<>

export interface QueryProcessorOptions {
    lineBreaks?: boolean,
    parameterized?: boolean
}

export default class PgQueryProcessor implements QueryProcessor {

    private _queryOptions: QueryOptions;

    constructor(private client: any, private _options = <QueryProcessorOptions>{}) {
        this._queryOptions = {
            lineBreak: _options.lineBreaks ? '\n' : ' ',
            nameEscape: '"'
        }
    }

    execute<T>(query: any): Promise<T> {
        if (this._options.parameterized) {
            let { sql, params } = convertQueryToParameterizedSQL(query, this._queryOptions);
            return this.client.query(sql, params).then((result: any) => {
                return convertResult(query, result);
            });
        } else {
            let sql = convertQueryToSQL(query, this._queryOptions);
            return this.client.query(sql).then((result: any) => {
                return convertResult(query, result);
            });
        }
    }
}

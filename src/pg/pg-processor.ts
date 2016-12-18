import QueryProcessor from "../query-processor";
import {convertQueryToParameterizedSQL} from '../converter/parameterized-converter';
import {convertQueryToSQL} from '../converter/sql-converter';
import {QueryOptions} from "../converter/query-converter";
import {convertResult} from "./result-converter";
import debug = require('debug');

const log = debug('ts-sql');

export interface QueryProcessorOptions {
    lineBreaks?: boolean,
    parameterized?: boolean,
    logging?: boolean,
    logger?: (sql: string, params?: any[]) => void
}

const DEFAULT_OPTIONS: QueryProcessorOptions = {
    lineBreaks: false,
    parameterized: true,
    logging: true
};

export default class PgQueryProcessor implements QueryProcessor {

    private _queryOptions: QueryOptions;
    private _options: QueryProcessorOptions;

    constructor(private client: any, options: QueryProcessorOptions = {}) {
        this._options = Object.assign({}, DEFAULT_OPTIONS, options);

        this._queryOptions = {
            lineBreak: this._options.lineBreaks ? '\n' : ' ',
            nameEscape: '"'
        }
    }

    execute(query: any): Promise<any> {
        if (this._options.parameterized) {
            let { sql, params } = convertQueryToParameterizedSQL(query, this._queryOptions);

            if (this._options.logging) log(sql);
            if (this._options.logger) this._options.logger(sql, params);

            return this.client.query(sql, params).then((result: any) => {
                return convertResult(query, result);
            });
        } else {
            let sql = convertQueryToSQL(query, this._queryOptions);

            if (this._options.logging) log(sql);
            if (this._options.logger) this._options.logger(sql);

            return this.client.query(sql).then((result: any) => {
                return convertResult(query, result);
            });
        }
    }
}

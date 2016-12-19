import {convertQueryToParameterizedSQL} from '../converter/parameterized-converter';
import {convertQueryToSQL} from '../converter/sql-converter';
import {QueryOptions} from "../converter/query-converter";
import {convertResult} from "./result-converter";
import debug = require('debug');

const log = debug('ts-sql');

export type QueryProcessor = (query: any) => Promise<any>;

export type QueryEngine = 'pg' | 'mysql';

export interface QueryProcessorOptions {
    lineBreaks?: boolean,
    parameterized?: boolean,
    logging?: boolean,
    logger?: (sql: string, params?: any[]) => void,
    identifierQuote?: string
}

const DEFAULT_OPTIONS: QueryProcessorOptions = {
    lineBreaks: false,
    parameterized: true,
    logging: true,
    identifierQuote: '"'
};

function preprocessorMysqlResult(result: any) {
    return {
        rows: result, // TODO create a shallow copy to remove non-Array fields?
        rowCount: result.affectedRows || result.changedRows
    }
}

export function createQueryProcessor(client: any, _options: QueryProcessorOptions = {}, engine: QueryEngine = 'pg'): QueryProcessor {

    let options: QueryProcessorOptions = Object.assign({}, DEFAULT_OPTIONS, _options);

    let queryOptions: QueryOptions = {
        lineBreak: options.lineBreaks ? '\n' : ' ',
        nameEscape: _options.identifierQuote || (engine === 'mysql' ? '`' : '"')
    };

    let parameterizedConverter = engine === 'mysql' ? ((index: number) => '?') : ((index: number) => '$' + index);
    let preprocessResult = engine === 'mysql' ? preprocessorMysqlResult : (result: any) => result;

    function processSql(query: any, sql: string, params: any[] | undefined, callback: any): Promise<any> {
        if (options.logging) log(sql);
        if (options.logger) options.logger(sql, params);

        return new Promise((resolve, reject) => {
            callback(sql, params, (err: any, result: any) => {
                if (err) reject(err);
                else resolve(convertResult(query, preprocessResult(result)));
            });
        });
    }

    return (query: any) => {
        if (options.parameterized) {
            let { sql, params } = convertQueryToParameterizedSQL(query, queryOptions, parameterizedConverter);
            return processSql(query, sql, params, (sql: string, params: any[], cb: any) => client.query(sql, params, cb));
        } else {
            let sql = convertQueryToSQL(query, queryOptions);
            return processSql(query, sql, undefined, (sql: string, params: undefined, cb: any) => client.query(sql, cb));
        }
    };
}


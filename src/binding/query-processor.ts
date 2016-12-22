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

function mySqlTypeCast(field: any, next: any) {
    if (field.type == 'TINY' && field.length == 1) { // Boolean
        let value = field.string();
        if (value == '1') return true;
        if (value == '0') return false;
        return null;
    } else if (field.type == 'JSON') {
        let value = field.string();
        return value == null ? null : JSON.parse(value);
    }
    return next();
}

// node mysql doesn't have an typeCast equivalent solution for the other direction
// node-postgres: https://github.com/brianc/node-postgres/issues/442
function convertParam(param: any) {
    if (typeof param === 'object' && !(param == null || param instanceof String || param instanceof Number ||
        param instanceof Boolean || param instanceof Date)) {
        return JSON.stringify(param);
    }
    return param;
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

    function executeSql(sql: string, params: any[] | undefined, cb: any) {
        if (params) params = params.map(convertParam);
        if (engine === 'pg') {
            client.query(sql, params || cb, params ? cb : undefined);
        } else if (engine === 'mysql') {
            client.query({
                sql,
                values: params,
                typeCast: mySqlTypeCast
            }, cb);
        } else throw new Error('Unknown DB engine: ' + engine);
    }

    return (query: any) => {
        if (options.parameterized) {
            let { sql, params } = convertQueryToParameterizedSQL(query, queryOptions, parameterizedConverter);
            return processSql(query, sql, params, (sql: string, params: any[], cb: any) => executeSql(sql, params, cb));
        } else {
            let sql = convertQueryToSQL(query, queryOptions);
            return processSql(query, sql, undefined, (sql: string, params: undefined, cb: any) => executeSql(sql, undefined, cb));
        }
    };
}


import QueryProcessor from "./query-processor";
import { convertQueryToParameterizedSQL } from './converter/parameterized-converter';
import { convertQueryToSQL } from './converter/sql-converter';


export default class DefaultQueryProcessor implements QueryProcessor {

    constructor(private _options: any = {}) {}

    execute<T>(query): Promise<T> { throw "Not supported"; }

    executeAsStream<T>(query) { throw "Not supported"; }

    convertToSQL(query): string {
        return convertQueryToSQL(query, this._options.lineBreaks);
    }

    convertToParameterizedSQL(query): { sql: string, params: any[] } {
        return convertQueryToParameterizedSQL(query);
    }
}

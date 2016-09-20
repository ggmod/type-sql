import QueryProcessor from "./query-processor";
import { substituteQueryParams } from './converter/utils';
import { convertQuery } from './converter/query-converter';


export default class DefaultQueryProcessor implements QueryProcessor {

    execute<T>(query): Promise<T> { throw "Not supported"; }

    executeAsStream<T>(query) { throw "Not supported"; }

    convertToSQL(query): string {
        return substituteQueryParams(convertQuery(query));
    }

    convertToParameterizedSQL(query): { sql: string, params: any[] } {
        return convertQuery(query);
    }
}

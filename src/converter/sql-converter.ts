import {createQueryConverter, QueryOptions} from "./query-converter";
import {convertParam} from './param-converter';

export function convertQueryToSQL(query: any, options: QueryOptions): string {
    return createQueryConverter((param: any) => convertParam(param), options)(query);
}

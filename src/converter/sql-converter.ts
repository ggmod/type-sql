import {createQueryConverter, QueryOptions} from "./query-converter";
import {convertParam} from './param-converter';
import {QueryEngine} from "../binding/query-processor";

export function convertQueryToSQL(query: any, options: QueryOptions, engine: QueryEngine): string {
    return createQueryConverter((param: any) => convertParam(param), options, engine)(query);
}

import {createQueryConverter} from "./query-converter";
import {convertSubstitutionParam} from './param-converter';
import {QueryEngine, ConverterOptions} from "./types";

export function convertQueryToSQL(query: any, options: ConverterOptions, engine: QueryEngine): string {
    return createQueryConverter((param: any) => convertSubstitutionParam(param), options, engine)(query);
}

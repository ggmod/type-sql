import {createQueryConverter} from "./query-converter";
import {convertEscapedParam} from './param-converter';
import {QueryEngine, ConverterOptions} from "./types";

let pgParamConverter = (index: number) => '$' + index;
let mySqlParamConverter = (index: number) => '?';

function convertSingleParam(param: any, params: any[], paramConverter: (param: any) => string): string {
    params.push(convertEscapedParam(param));
    return paramConverter(params.length);
}

export function convertQueryToParameterizedSQL(query: any, options: ConverterOptions, engine: QueryEngine) {
    let params: any[] = [];

    let paramConverter = engine === 'mysql' ? mySqlParamConverter : pgParamConverter;
    let sql = createQueryConverter((param: any) => convertSingleParam(param, params, paramConverter), options, engine)(query);

    return { sql, params };
}

import {createQueryConverter, QueryOptions} from "./query-converter";


function convertSingleParam(param: any, params: any[], paramConverter: (param: any) => string): string {
    params.push(param);
    return paramConverter(params.length);
}

export function convertQueryToParameterizedSQL(query: any, options: QueryOptions, paramConverter: (param: any) => string) {
    let params: any[] = [];

    let sql = createQueryConverter((param: any) => convertSingleParam(param, params, paramConverter), options)(query);

    return { sql, params };
}

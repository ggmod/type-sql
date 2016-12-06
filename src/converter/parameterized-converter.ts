import {createQueryConverter, QueryOptions} from "./query-converter";


function convertSingleParam(param: any, params: any[]): string {
    params.push(param);
    return '$' + params.length;
}

export function convertQueryToParameterizedSQL(query: any, options: QueryOptions) {
    let params: any[] = [];

    let sql = createQueryConverter((param: any) => convertSingleParam(param, params), options)(query);

    return { sql, params };
}

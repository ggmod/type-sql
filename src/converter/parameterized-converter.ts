import { createQueryConverter } from "./query-converter";


function convertSingleParam(param: any, params: any[]): string {
    params.push(param);
    return '$' + params.length;
}

export function convertQueryToParameterizedSQL(query: any, lineBreaks: boolean) {
    let params: any[] = [];

    let sql = createQueryConverter((param: any) => convertSingleParam(param, params), lineBreaks)(query);

    return { sql, params };
}

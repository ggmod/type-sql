import { convertQuery } from "./query-converter";


function convertSingleParam(param, params) {
    params.push(param);
    return '$' + params.length;
}

export function convertQueryToParameterizedSQL(query, lineBreaks: boolean) {
    let params = [];

    let sql = convertQuery(query, param => {
        return convertSingleParam(param, params);
    }, lineBreaks);

    return { sql, params };
}

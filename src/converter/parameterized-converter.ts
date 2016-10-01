import { convertQuery } from "./query-converter";


export function convertQueryToParameterizedSQL(query) {
    let params = [];

    let sql = convertQuery(query, param => {
        params.push(param);
        return '$' + params.length;
    });

    return { sql, params };
}

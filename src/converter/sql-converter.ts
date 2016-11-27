import { convertQuery } from "./query-converter";


function escapeString(param) {
    return param.replace(/'/g, "''");
}

function convertSingleParam(param) {
    if (typeof param === 'string' || param instanceof String) {
        return `'${escapeString(param)}'`;
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
        return param ? 'TRUE': 'FALSE';
    } else if (param instanceof Date) {
        return `'${param.toISOString()}'`;
    }
    return param;
}

export function convertQueryToSQL(query, lineBreaks: boolean) {
    return convertQuery(query, param => convertSingleParam(param), lineBreaks);
}

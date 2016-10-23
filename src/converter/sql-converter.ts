import { convertQuery } from "./query-converter";

// TODO escaping sql injection

function convertSingleParam(param) {
    if (typeof param === 'string' || param instanceof String) {
        return `'${param}'`;
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
        return param ? 'TRUE': 'FALSE';
    } else if (param instanceof Date) {
        return `'${param.toISOString()}'`;
    }
    return param;
}

export function convertQueryToSQL(query, lineBreaks: boolean) {
    return convertQuery(query, param => {
        return convertSingleParam(param);
    }, lineBreaks);
}

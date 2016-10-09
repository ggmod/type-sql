import { convertQuery } from "./query-converter";

// TODO escaping sql injection

function convertSingleParam(param) {
    if (typeof param === 'string' || param instanceof String) {
        return `'${param}'`;
    }
    return param;
}

export function convertQueryToSQL(query) {
    return convertQuery(query, param => {
        if (Array.isArray(param)) {
            return param.map(p => convertSingleParam(p)).join(', ');
        }
        return convertSingleParam(param);
    });
}

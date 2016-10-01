import { convertQuery } from "./query-converter";

// TODO escaping sql injection

export function convertQueryToSQL(query) {
    return convertQuery(query, param => {
        if (typeof param === 'string' || param instanceof String) {
            return `'${param}'`;
        }
        return param;
    });
}

import {createQueryConverter, QueryOptions} from "./query-converter";


function escapeString(param: string): string {
    return param.replace(/'/g, "''");
}

function convertSingleParam(param: any): string {
    if (typeof param === 'string' || param instanceof String) {
        return `'${escapeString(String(param))}'`;
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
        return String(param).toUpperCase();
    } else if (param instanceof Date) {
        return `'${param.toISOString()}'`;
    } else if (typeof param === 'number' || param instanceof Number) {
        return String(param);
    }
    return `'${escapeString(JSON.stringify(param))}'`; // TODO should this remain a general fallback or create a json column type?
}

export function convertQueryToSQL(query: any, options: QueryOptions): string {
    return createQueryConverter((param: any) => convertSingleParam(param), options)(query);
}

import { convertQuery } from "./query-converter";


function escapeString(param: string): string {
    return param.replace(/'/g, "''");
}

function convertSingleParam(param: any): string {
    if (typeof param === 'string' || param instanceof String) {
        return `'${escapeString(<string>param)}'`;
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
        return param ? 'TRUE': 'FALSE';
    } else if (param instanceof Date) {
        return `'${param.toISOString()}'`;
    } else if (typeof param === 'number' || param instanceof Number) {
        return String(param);
    }
    return `'${escapeString(JSON.stringify(param))}'`; // TODO should this remain a general fallback or create a json column type?
}

export function convertQueryToSQL(query: any, lineBreaks: boolean): string {
    return convertQuery(query, (param: any) => convertSingleParam(param), lineBreaks);
}

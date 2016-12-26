
export function convertSubstitutionParam(param: any): string {
    if (param == null) return 'NULL';
    if (typeof param === 'string' || param instanceof String) {
        return `'${String(param)}'`;
    } else if (typeof param === 'boolean' || param instanceof Boolean) {
        return String(param).toUpperCase();
    } else if (param instanceof Date) {
        return `'${param.toISOString()}'`;
    } else if (typeof param === 'number' || param instanceof Number) {
        return String(param);
    }
    return `'${JSON.stringify(param)}'`;
}

// node mysql doesn't have an typeCast equivalent solution for the other direction
// node-postgres: https://github.com/brianc/node-postgres/issues/442
export function convertEscapedParam(param: any) {
    if (typeof param === 'object' && !(param == null || param instanceof String || param instanceof Number ||
        param instanceof Boolean || param instanceof Date)) {
        return JSON.stringify(param);
    }
    return param;
}

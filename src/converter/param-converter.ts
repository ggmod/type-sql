
export function convertParam(param: any): string {
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

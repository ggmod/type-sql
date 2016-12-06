
export function number(param: any): number {
    let result = Number(param);
    if (Number.isNaN(result)) throw new Error('Invalid number parameter in SQL query: ' + param);
    return result;
}

export function boolean(param: any): boolean {
    if (typeof param === 'boolean') return param;
    if (param instanceof Boolean) return param.valueOf();
    if (param === 'true') return true;
    if (param === 'false') return false;
    throw new Error('Invalid boolean parameter in SQL query: ' + param);
}

export function date(param: any): Date {
    if (param instanceof Date) return param;
    if (typeof param === 'number' || param instanceof Number) return new Date(param);
    if (typeof param === 'string' || param instanceof String) {
        if (Number.isNaN(Date.parse(String(param)))) throw new Error('Invalid date parameter in SQL query: ' + param);
        return new Date(param);
    }
    throw new Error('Invalid date parameter in SQL query: ' + param);
}

export function string(param: any): string {
    if (typeof param === 'string') return param;
    if (param instanceof String) return param.valueOf();
    throw new Error('Invalid string parameter in SQL query: ' + param);
}

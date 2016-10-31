
export function number(param) {
    let result = Number(param);
    if (Number.isNaN(result)) throw new Error('Invalid number parameter in SQL query: ' + param);
    return result;
}

export function boolean(param) {
    if (typeof param === 'boolean' || param instanceof Boolean) return param;
    if (param === 'true') return true;
    if (param === 'false') return false;
    throw new Error('Invalid boolean parameter in SQL query: ' + param);
}

export function date(param) {
    if (param instanceof Date) return param;
    if (typeof param === 'number' || param instanceof Number) return new Date(param);
    if (typeof param === 'string' || param instanceof String) {
        if (Number.isNaN(Date.parse(<string>param))) throw new Error('Invalid date parameter in SQL query: ' + param);
        return new Date(param);
    }
    throw new Error('Invalid date parameter in SQL query: ' + param);
}

export function string(param) {
    if (typeof param === 'string' || param instanceof String) return param;
    throw new Error('Invalid string parameter in SQL query: ' + param);
}

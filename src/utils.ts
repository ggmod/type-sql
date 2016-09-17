

export function createUnsafeSQL(processedQuery) {
    let {sql, params} = processedQuery;
    let result = '';
    let paramIndex = 0;

    for (let i = 0; i < sql.length; i++) {
        if (sql[i] === '?') {
            result = result.concat(params[paramIndex++]);
        } else {
            result += sql[i];
        }
    }
    return result;
}

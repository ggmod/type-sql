
export function convertResult(query: any, result: any): any {
    if (query._action === 'select') {
        if (query._columns && query._columns.length === 1) {
            if (result.rows.length == 0) return [];
            let columnName = Object.keys(result.rows[0])[0]; // ugly, but more reliable than reverse engineering from the column modifiers
            return result.rows.map((row: any) => row[columnName]);
        } else {
            return result.rows;
        }
    } else if (query._action === 'delete') {
        return result.rowCount;
    } else {
        return result;
    }
}

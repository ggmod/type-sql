
export function convertResult(query: any, result: any): any {
    if (query._action === 'select') {
        if (query._columns && query._columns.length === 1) {
            return result.rows.map((row: any) => row[query._columns[0]._name]);
        } else {
            return result.rows;
        }
    } else {
        return result;
    }
}

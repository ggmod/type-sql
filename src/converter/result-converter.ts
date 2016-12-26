import {QueryEngine} from "./types";

export function convertResult(query: any, result: any, engine: QueryEngine): any {
    let rows = engine === 'pg' ? result.rows : result;
    let rowCount = engine === 'pg' ? result.rowCount : result.affectedRows || result.changedRows;

    if (query._action === 'select') return convertSelectResult(query, rows);
    if (query._action === 'delete') return rowCount;
    if (query._action === 'update') return rowCount;
    if (query._action === 'insert') return convertInsertResult(result, engine);
    throw new Error('Unknown query type:' + query._action);
}

function convertInsertResult(result: any, engine: QueryEngine): any {
    if (engine === 'mysql') return result.insertId > 0 ? result.insertId : undefined; // mysql returns 0 for tables that have a non-autoincrement ID
    if (engine === 'pg' && result.rows && result.rows.length === 1) {
        let columnName = Object.keys(result.rows[0])[0];
        return result.rows[0][columnName];
    }
}

function convertSelectResult(query: any, rows: any[]): any {
    if (query._columns && query._columns.length === 1 &&
        !(query._columns[0]._name === '*' && query._columns[0]._modifiers.length === 0)) {
        if (rows.length == 0) return [];
        let columnName = Object.keys(rows[0])[0]; // easier than reverse engineering from the column modifiers
        let values = rows.map((row: any) => row[columnName]);

        if (query._columns[0]._name === '*' && query._columns[0]._modifiers.some((m: any) => m.name === 'count')) {
            return values.map((value: any) => Number(value)); // string to number conversion for PG count values
        }
        return values;
    } else {
        convertAliasFields(query, rows);
        return rows;
    }
}

function convertAliasFields(query: any, rows: any[]): void {
    let aliasByName = getColumnAliasesByName(query);
    if (Object.keys(aliasByName).length === 0) return;

    rows.forEach((row: any) => {
        Object.keys(row).forEach((name: string) => {
            if (aliasByName[name]) {
                row[aliasByName[name]] = row[name];
                delete row[name];
            }
        });
    });
}

function getColumnAliasesByName(query: any): any {
    let aliasByName = {} as any;

    if (query._columns && query._columns.length > 0) {
        query._columns.forEach((column: any) => {
            if (column._name && column._name.alias && column._modifiers.length === 0) {
                aliasByName[column._name.name] = column._name.alias;
            } else if (column._name === '*' && column._modifiers.length === 0) {
                getAliasColumnsOfTable(column._table).forEach((column: any) => {
                    aliasByName[column._name.name] = column._name.alias;
                });
            }
        });
    } else {
        let tables = query._table ? [query._table] : query._tables;
        tables.forEach((table: any) => {
            getAliasColumnsOfTable(table).forEach((column: any) => {
                aliasByName[column._name.name] = column._name.alias;
            });

            let joinTable = table._parent;
            while (joinTable) {
                getAliasColumnsOfTable(joinTable).forEach((column: any) => {
                    aliasByName[column._name.name] = column._name.alias;
                });
                joinTable = joinTable._parent;
            }
        });
    }

    return aliasByName;
}

function getAliasColumnsOfTable(table: any): any[] {
    return Object.keys(table).map(key => table[key]).filter((column: any) => column && column._name && column._name.alias);
}

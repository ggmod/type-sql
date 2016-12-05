import { string, number, date, boolean } from './utils';

export type ParamConverter = (param: any) => string;

export function convertQuery(query: any, paramConverter: ParamConverter, lineBreaks = false): string {
    let separator = lineBreaks ? '\n' : ' ';

    if (query._action === 'select') return convertSelectQuery(query, paramConverter, separator);
    else if (query._action === 'delete') return convertDeleteQuery(query, paramConverter, separator);
    else if (query._action === 'update') return convertUpdateQuery(query, paramConverter, separator);
    else if (query._action === 'insert') return convertInsertQuery(query, paramConverter, separator);
}

function convertDeleteQuery(query: any, paramConverter: ParamConverter, separator: string): string {
    let s = 'DELETE FROM ' + convertTable(query._table);
    s += convertConditions(query._conditions, separator, paramConverter);
    return s;
}

function convertUpdateQuery(query: any, paramConverter: ParamConverter, separator: string): string {
    let s = 'UPDATE ' + convertTable(query._table) + ' SET ';
    s += convertUpdateSetters(query._table, query._entity, paramConverter);
    s += convertConditions(query._conditions, separator, paramConverter);
    return s;
}

function convertUpdateSetters(table: any, entity: any, paramConverter: ParamConverter): string {
    return Object.keys(entity).sort().map(key => {
        let value = entity[key];
        let column = table[key];
        return convertColumn(column) + ' = ' + convertParam(column, value, paramConverter);
    }).join(', ');
}

function convertInsertQuery(query: any, paramConverter: ParamConverter, separator: string): string {
    let items: any[] = Array.isArray(query._entity) ? query._entity : [query._entity];
    let keySet: Set<string> = items.reduce((set: Set<string>, item: any) => {
        Object.keys(item).forEach(key => set.add(key)); return set;
    }, new Set<string>());
    let keys = Array.from(keySet).sort();

    let s = 'INSERT INTO ' + convertTable(query._table) + ' ';
    s += '(' + keys.map(key => '"' + key + '"').join(', ') + ')';
    s += separator + 'VALUES ';
    s += items.map((item: any) => convertInsertItem(query._table, item, paramConverter, keys))
        .map((row: string) => '(' + row + ')').join(', ');
    return s;
}

function convertInsertItem(table: any, entity: any, paramConverter: ParamConverter, keys: string[]): string {
    return keys.map(key => {
        let value = entity[key];
        let column = table[key];
        return convertParam(column, value, paramConverter);
    }).join(', ');
}

function convertSelectQuery(query: any, paramConverter: ParamConverter, separator: string): string {
    let s = 'SELECT ';
    if (query._distinct) {
        s += 'DISTINCT ';
    }

    if (query._columns == null || query._columns.length === 0) {
        s += '*'
    } else {
        s += query._columns.map((column: any) => convertColumn(column)).join(', ');
    }

    s += separator + 'FROM ';
    if (query._tables) {
        s+= query._tables.map((table: any) => table._parent ? convertJoin(table) : convertTable(table)).join(', ');
    } else {
        s+= convertTable(query._table);
    }

    s += convertConditions(query._conditions, separator, paramConverter);

    if (query._groupBy && query._groupBy.length > 0) {
        s += separator + 'GROUP BY ';
        s += query._groupBy.map((column: any) => convertColumn(column)).join(', ');
    }
    s += convertConditions(query._having, separator, paramConverter, 'HAVING');

    if (query._orderings && query._orderings.length > 0) {
        s += separator + 'ORDER BY ';
        s += query._orderings.map((ordering: any) => convertOrdering(ordering)).join(', ');
    }
    if (query._offset != null) {
        s += separator + 'OFFSET ' + number(query._offset);
    }
    if (query._limit != null) {
        s += separator + 'LIMIT ' + number(query._limit);
    }
    return s;
}

function convertConditions(conditions: any, separator: string, paramConverter: ParamConverter, keyword = 'WHERE'): string {
    let s = '';
    if (conditions && conditions.length > 0) {
        s += separator + keyword + ' ';
        preprocessConditions(conditions, paramConverter);
        s += conditions.map((condition: any) => convertCondition(condition, true)).join(' AND ');
    }
    return s;
}

function convertJoin(joinChain: any): string {
    let items: any[] = [];
    while (joinChain) {
        items.push(joinChain);
        joinChain = joinChain._parent;
    }

    let root = items[items.length - 1];
    let s = convertTable(root);

    for (let i = items.length - 2; i >= 0; i-= 2) {
        let table = items[i]._table;
        let modifier = items[i]._modifier;
        let condition = items[i - 1]._condition;
        let param = getConditionParam(condition, null);
        s += ' ' + modifier.toUpperCase() + ' JOIN ' + convertTable(table) + ' ON ' +
            convertColumnCondition(condition, param);
    }

    return s;
}

function convertOrdering(ordering: any): string {
    if (ordering._column) {
        let s = convertColumn(ordering._column);

        if (ordering._direction === 'ASC') s += ' ASC';
        if (ordering._direction === 'DESC') s += ' DESC';
        if (ordering._nullsPosition === 'FIRST') s += ' NULLS FIRST';
        if (ordering._nullsPosition === 'LAST') s += ' NULLS LAST';

        return s;
    } else {
        return convertColumn(ordering);
    }
}

function convertTable(table: any): string {
    return '"' + table.$name + '"';
}

function convertColumn(column: any): string {
    let s = convertTable(column._table) + '.';
    s += column._params === '*' ? column._params : '"' + column._params + '"';
    if (column._modifiers) {
        column._modifiers.forEach((modifier: any) => {
            let name = modifier.name;
            if (name === 'lower') s = 'LOWER(' + s + ')';
            else if (name === 'upper') s = 'UPPER(' + s + ')';
            else if (name === 'count') s = 'COUNT(' + s + ')';
            else if (name === 'sum') s = 'SUM(' + s + ')';
            else if (name === 'avg') s = 'AVG(' + s + ')';
            else if (name === 'min') s = 'MIN(' + s + ')';
            else if (name === 'max') s = 'MAX(' + s + ')';
            else if (name === 'as') s = s + ' AS "' + modifier.params + '"';
        });
    }
    return s + '';
}

function preprocessConditions(conditions: any, paramConverter: ParamConverter): void {
    conditions.forEach((condition: any) => {
        if (conditions.length > 1 && condition._sibling) {
            condition._parenthesis = true;
        }
        preprocessParams(condition, paramConverter);
    });
}

// this is only needed, so that the $1, $2... numbering is not reversed
function preprocessParams(condition: any, paramConverter: ParamConverter): void {
    if (condition._sibling) {
        preprocessParams(condition._sibling, paramConverter);
    }
    if (!condition._sibling && !condition._child) {
        condition.__param = getConditionParam(condition, paramConverter);
    }
    if (condition._child) {
        preprocessParams(condition._child, paramConverter);
    }
}

function convertCondition(condition: any, root = false): string {
    if (!condition._sibling && !condition._child) {
        return convertColumnCondition(condition, condition.__param);
    }

    let s = '';
    if (condition._child) {
        s += convertCondition(condition._child);
    }
    if (condition._sibling) {
        s = convertCondition(condition._sibling, root) + ' ' + condition._chainType.toUpperCase() + ' ' + s;
    }
    if (condition._parenthesis || ((!root || condition._negation) && condition._child)) {
        s = '( ' + s + ' )';
    }
    if (condition._negation) {
        s = 'NOT ' + s;
    }
    return s;
}

function convertColumnCondition(condition: any, param: string): string {
    let s = convertColumn(condition._column);
    s += getConditionString(condition, param);
    return s;
}

function getConditionString(condition: any, param: string): string {
    switch (condition._type) {
        case 'eq': return ' = ' + param;
        case 'ne': return ' <> ' + param;
        case 'lt': return ' < ' + param;
        case 'gt': return ' > ' + param;
        case 'lte': return ' <= ' + param;
        case 'gte': return ' >= ' + param;
        case 'is-null': return ' IS NULL';
        case 'is-not-null': return ' IS NOT NULL';
        case 'like': return ' LIKE ' + param;
        case 'not-like': return ' NOT LIKE ' + param;
        case 'in': return ' IN (' + param + ')';
        case 'not-in': return ' NOT IN (' + param + ')';
        case 'between': return ' BETWEEN ' + param;
        case 'not-between': return ' NOT BETWEEN ' + param;
        default: return '';
    }
}

function getConditionParam(condition: any, paramConverter: ParamConverter): string {
    let param = '';
    if (condition._otherColumn) {
        param = convertColumn(condition._otherColumn);
    } else {
        let _convertParam = (param: any) => convertParam(condition._column, param, paramConverter);

        if (condition._type === 'in' || condition._type === 'not-in') {
            param = condition._values.map((value: any) => _convertParam(value)).join(', ');
        } else if (condition._type === 'between' || condition._type === 'not-between') {
            param = _convertParam(condition._values[0]) + ' AND ' + _convertParam(condition._values[1]);
        } else if (condition._type !== 'is-null' && condition._type !== 'is-not-null') {
            param = _convertParam(condition._values[0]);
        }
    }
    return param;
}

function convertParam(column: any, param: any, paramConverter: ParamConverter): string {
    if (param == null) return 'NULL';
    return paramConverter(getTypedParam(column._type, param));
}

function getTypedParam(type: string, param: any): any {
    if (type === 'number') return number(param);
    else if (type === 'boolean') return boolean(param);
    else if (type === 'date') return date(param);
    else if (type === 'string') return string(param);
    return param;
}

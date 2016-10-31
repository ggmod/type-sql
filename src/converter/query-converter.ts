import { string, number, date, boolean } from './utils';


export function convertQuery(query: any, paramConverter, lineBreaks = false) {
    let separator = lineBreaks ? '\n' : ' ';

    let s = '';
    if (query._columns || query._singleColumn) {
        s += 'SELECT ';
        if (query._distinct) {
            s += 'DISTINCT ';
        }
        if (query._singleColumn === 'count') {
            s += 'COUNT(*)';
        } else {
            if (query._columns.length === 0) {
                s += '*'
            } else {
                s += query._columns.map(column => convertColumn(column)).join(', ');
            }
        }
    }
    s += separator + 'FROM ' + query._tables.map(table => convertTable(table)).join(', ');

    if (query._conditions.length > 0) {
        s += separator + 'WHERE ';
        preprocessConditions(query._conditions);
        s += query._conditions.map(condition => convertCondition(condition, paramConverter, true)).join(' AND ');
    }
    if (query._orderings.length > 0) {
        s += separator + 'ORDER BY ';
        s += query._orderings.map(ordering => convertOrdering(ordering)).join(', ');
    }
    if (query._offset != null) {
        s += separator + 'OFFSET ' + number(query._offset);
    }
    if (query._limit != null) {
        s += separator + 'LIMIT ' + number(query._limit);
    }
    return s;
}

function convertOrdering(ordering: any) {
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

function convertTable(table: any) {
    return '"' + table.$name + '"';
}

function convertColumn(column: any) {
    let s = convertTable(column._table) + '.';
    s += column._params.special ? column._params.special : '"' + column._params.name + '"';
    if (column._modifiers) {
        column._modifiers.forEach(modifier => {
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

function preprocessConditions(conditions) {
    if (conditions.length > 1) {
        conditions.forEach(condition => {
            if (condition._sibling) {
                condition._parenthesis = true;
            }
        });
    }
}

function convertCondition(condition, paramConverter, root = false) {
    if (!condition._sibling && !condition._child) {
        return convertColumnCondition(condition, paramConverter);
    }

    let s = '';
    if (condition._child) {
        s += convertCondition(condition._child, paramConverter);
    }
    if (condition._sibling) {
        s = convertCondition(condition._sibling, paramConverter, root) + ' ' + condition._chainType + ' ' + s;
    }
    if (condition._parenthesis || ((!root || condition._negation) && condition._child)) {
        s = '( ' + s + ' )';
    }
    if (condition._negation) {
        s = 'NOT ' + s;
    }
    return s;
}

function convertColumnCondition(condition, paramConverter) {
    let s = convertColumn(condition._column);

    let convertParam = param => paramConverter(getTypedParam(condition._column._type, param));

    let param = '';
    if (condition._otherColumn) {
        param = convertColumn(condition._otherColumn);
    } else if (condition._type === 'in' || condition._type === 'not-in') {
        param = condition._values.map(value => convertParam(value)).join(', ');
    } else if (condition._type === 'between' || condition._type === 'not-between') {
        param = convertParam(condition._values[0]) + ' AND ' + convertParam(condition._values[1]);
    } else if (condition._type !== 'is-null' && condition._type !== 'is-not-null') {
        param = convertParam(condition._values[0]);
    }

    if (condition._type === 'eq') s += ' = ' + param;
    else if (condition._type === 'ne') s += ' <> ' + param;
    else if (condition._type === 'lt') s += ' < ' + param;
    else if (condition._type === 'gt') s += ' > ' + param;
    else if (condition._type === 'lte') s += ' <= ' + param;
    else if (condition._type === 'gte') s += ' >= ' + param;
    else if (condition._type === 'is-null') s += ' IS NULL';
    else if (condition._type === 'is-not-null') s += ' IS NOT NULL';
    else if (condition._type === 'like') s += ' LIKE ' + param;
    else if (condition._type === 'not-like') s += ' NOT LIKE ' + param;
    else if (condition._type === 'in') s += ' IN (' + param + ')';
    else if (condition._type === 'not-in') s += ' NOT IN (' + param + ')';
    else if (condition._type === 'between') s += ' BETWEEN ' + param;
    else if (condition._type === 'not-between') s += ' NOT BETWEEN ' + param;

    return s;
}

function getTypedParam(type, param) {
    if (type === 'number') return number(param);
    else if (type === 'boolean') return boolean(param);
    else if (type === 'date') return date(param);
    else if (type === 'string') return string(param);
    return param;
}

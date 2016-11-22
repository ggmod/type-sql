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
    s += separator + 'FROM ' + query._tables
        .map(table => table._parent ? convertJoin(table) : convertTable(table)).join(', ');

    if (query._conditions.length > 0) {
        s += separator + 'WHERE ';
        preprocessConditions(query._conditions, paramConverter);
        s += query._conditions.map(condition => convertCondition(condition, true)).join(' AND ');
    }
    if (query._groupBy.length > 0) {
        s += separator + 'GROUP BY ';
        s += query._groupBy.map(column => convertColumn(column)).join(', ');
    }
    if (query._having.length > 0) {
        s += separator + 'HAVING ';
        preprocessConditions(query._having, paramConverter);
        s += query._having.map(condition => convertCondition(condition, true)).join(' AND ');
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

function convertJoin(joinChain) {
    let items = [];
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

function preprocessConditions(conditions, paramConverter) {
    conditions.forEach(condition => {
        if (conditions.length > 1 && condition._sibling) {
            condition._parenthesis = true;
        }
        preprocessParams(condition, paramConverter);
    });
}

// this is only needed, so that the $1, $2... numbering is not reversed
function preprocessParams(condition, paramConverter) {
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

function convertCondition(condition, root = false) {
    if (!condition._sibling && !condition._child) {
        return convertColumnCondition(condition, condition.__param);
    }

    let s = '';
    if (condition._child) {
        s += convertCondition(condition._child);
    }
    if (condition._sibling) {
        s = convertCondition(condition._sibling, root) + ' ' + condition._chainType + ' ' + s;
    }
    if (condition._parenthesis || ((!root || condition._negation) && condition._child)) {
        s = '( ' + s + ' )';
    }
    if (condition._negation) {
        s = 'NOT ' + s;
    }
    return s;
}

function convertColumnCondition(condition, param) {
    let s = convertColumn(condition._column);
    s += getConditionString(condition, param);
    return s;
}

function getConditionString(condition, param) {
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

function getConditionParam(condition, paramConverter) {
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
    return param;
}

function getTypedParam(type, param) {
    if (type === 'number') return number(param);
    else if (type === 'boolean') return boolean(param);
    else if (type === 'date') return date(param);
    else if (type === 'string') return string(param);
    return param;
}

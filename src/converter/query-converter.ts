
export function convertQuery(query: any, paramConverter) {
    let s = '';
    if (query._columns) {
        s += 'SELECT ';
        if (query._columns.length === 0) {
            s += '*'
        } else {
            s += query._columns.map(column => convertColumn(column)).join(', ');
        }
    }
    s += ' FROM ' + query._tables.map(table => convertTable(table)).join(', ');

    if (query._conditions.length > 0) {
        s += ' WHERE ';
        preprocessConditions(query._conditions);
        s += query._conditions.map(condition => convertCondition(condition, paramConverter)).join(' AND ');
    }
    if (query._orderings.length > 0) {
        s += ' ORDER BY ';
        s += query._orderings.map(ordering => convertOrdering(ordering)).join(', ');
    }
    if (query._offset != null) {
        s += ' OFFSET ' + Number(query._offset);
    }
    if (query._limit != null) {
        s += ' LIMIT ' + Number(query._limit);
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
            if (modifier === 'lower') s = 'LOWER(' + s + ')';
            else if (modifier === 'upper') s = 'UPPER(' + s + ')';
            else if (modifier === 'count') s = 'COUNT(' + s + ')';
            else if (modifier === 'sum') s = 'SUM(' + s + ')';
            else if (modifier === 'avg') s = 'AVG(' + s + ')';
            else if (modifier === 'min') s = 'MIN(' + s + ')';
            else if (modifier === 'max') s = 'MAX(' + s + ')';
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

function convertCondition(condition, paramConverter) {
    if (!condition._sibling && !condition._child) {
        return convertColumnCondition(condition, paramConverter);
    }

    let s = '';
    if (condition._child) {
        let child = convertCondition(condition._child, paramConverter);
        if (condition._child._sibling || condition._child._child) {
            child = '( ' + child + ' )';
        }
        s += child;
    }
    if (condition._sibling) {
        s = convertCondition(condition._sibling, paramConverter) + ' ' + condition._chainType + ' ' + s;
        if (condition._parenthesis) {
            s = '( ' + s + ' )';
        }
    }
    return s;
}

function convertColumnCondition(condition, paramConverter) {
    let s = convertColumn(condition._column);

    let param = '';
    if (condition._type !== 'is-null' && condition._type !== 'is-not-null') {
        param = paramConverter(condition._value);
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

    return s;
}

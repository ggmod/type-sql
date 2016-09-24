
export function convertQuery(query: any) {
    let s = '';
    let params = [];
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
        let where = query._conditions.map(condition => convertConditions(condition));
        s += where.map(w => w.sql).join(' AND ');
        params = params.concat(...where.map(w => w.params)); // flatMap
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
    return {
        sql: s,
        params
    };
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
    let s = convertTable(column._table) + '."' + column._params.name + '"';
    if (column._modifiers) {
        column._modifiers.forEach(modifier => {
            if (modifier === 'lower') s = 'LOWER(' + s + ')';
            else if (modifier === 'upper') s = 'UPPER(' + s + ')';
        });
    }
    return s + '';
}

function convertConditions(condition) {
    let s = convertColumn(condition._column);

    if (condition._type === 'eq') s += ' = ?';
    else if (condition._type === 'ne') s += ' <> ?';
    else if (condition._type === 'lt') s += ' < ?';
    else if (condition._type === 'gt') s += ' > ?';
    else if (condition._type === 'lte') s += ' <= ?';
    else if (condition._type === 'gte') s += ' >= ?';

    return {
        sql: s,
        params: [condition._value]
    };
}

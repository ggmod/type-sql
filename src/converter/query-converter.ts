import { string, number, date, boolean } from './type-converter';
import { QueryEngine, ConverterOptions } from "./types";


export function createQueryConverter(paramConverter: (param: any) => string, options: ConverterOptions, engine: QueryEngine) {

    return convertQuery;

    function convertQuery(query: any): string {
        if (query._action === 'select') return convertSelectQuery(query);
        if (query._action === 'delete') return convertDeleteQuery(query);
        if (query._action === 'update') return convertUpdateQuery(query);
        if (query._action === 'insert') return convertInsertQuery(query);
        throw new Error('Unknown query type:' + query._action);
    }

    function convertDeleteQuery(query: any): string {
        let s = 'DELETE FROM ' + convertTable(query._table);
        s += convertConditions(query._conditions);
        return s;
    }

    function convertUpdateQuery(query: any): string {
        let s = 'UPDATE ' + convertTable(query._table) + ' SET ';
        s += convertUpdateSetters(query._table, query._entity);
        s += convertConditions(query._conditions);
        return s;
    }

    function convertUpdateSetters(table: any, entity: any): string {
        return Object.keys(entity).sort().map(key => {
            let value = entity[key];
            let column = table[key];
            return convertColumnName(column) + ' = ' + convertParam(column, value);
        }).join(', ');
    }

    function convertInsertQuery(query: any): string {
        let items: any[] = Array.isArray(query._entity) ? query._entity : [query._entity];
        let keySet: Set<string> = items.reduce((set: Set<string>, item) => {
            Object.keys(item).forEach(key => set.add(key)); return set;
        }, new Set<string>());
        let keys = Array.from(keySet).sort();

        let s = 'INSERT INTO ' + convertTable(query._table) + ' ';
        s += '(' + keys.map(key => convertColumnName(query._table[key])).join(', ') + ')';
        s += options.lineBreak + 'VALUES ';
        s += items.map(item => convertInsertItem(query._table, item, keys))
            .map((row: string) => '(' + row + ')').join(', ');

        s += getPgInsertReturningIfNeeded(query);
        return s;
    }


    function getPgInsertReturningIfNeeded(query: any): string {
        if (engine === 'pg' && query._action === 'insert' && !Array.isArray(query._entity) &&
            query._table.$id && query._table.$id._table && query._table.$id._name) {
            return ' RETURNING ' + convertColumnName(query._table.$id);
        }
        return '';
    }

    function convertInsertItem(table: any, entity: any, keys: string[]): string {
        return keys.map(key => {
            let value = entity[key];
            let column = table[key];
            return convertParam(column, value);
        }).join(', ');
    }

    function convertSelectQuery(query: any): string {
        let s = 'SELECT ';
        if (query._distinct) {
            s += 'DISTINCT ';
        }

        if (query._columns == null || query._columns.length === 0) {
            s += '*'
        } else {
            s += query._columns.map((column: any) => convertColumn(column)).join(', ');
        }

        s += options.lineBreak + 'FROM ';
        if (query._tables) {
            s+= query._tables.map((table: any) => table._parent ? convertJoin(table) : convertTable(table)).join(', ');
        } else {
            s+= convertTable(query._table);
        }

        s += convertConditions(query._conditions);

        if (query._groupBy && query._groupBy.length > 0) {
            s += options.lineBreak + 'GROUP BY ';
            s += query._groupBy.map((column: any) => convertColumn(column)).join(', ');
        }
        s += convertConditions(query._having, 'HAVING');

        if (query._orderings && query._orderings.length > 0) {
            s += options.lineBreak + 'ORDER BY ';
            s += query._orderings.map((ordering: any) => convertOrdering(ordering)).join(', ');
        }
        if (query._limit != null) {
            s += options.lineBreak + 'LIMIT ' + number(query._limit);
        }
        if (query._offset != null) {
            s += options.lineBreak + 'OFFSET ' + number(query._offset);
        }
        return s;
    }

    function convertConditions(conditions: any[], keyword = 'WHERE'): string {
        let s = '';
        if (conditions && conditions.length > 0) {
            s += options.lineBreak + keyword + ' ';
            preprocessConditions(conditions);
            s += conditions.map(condition => convertCondition(condition, true)).join(' AND ');
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
            let param = convertColumn(condition._otherColumn);
            s += ' ' + modifier.toUpperCase() + ' JOIN ' + convertTable(table) + ' ON ' +
                convertColumnCondition(condition, param);
        }

        return s;
    }

    function convertOrdering(ordering: any): string {
        if (ordering._column) {
            let s = convertColumn(ordering._column);

            if (ordering._nullsPosition != null) { // "NULLS FIRST" only exists in PG, this is the general solution
                s += ' IS NULL ' + (ordering._nullsPosition === 'FIRST' ? 'DESC' : 'ASC') + ', ' + s;
            }

            if (ordering._direction === 'ASC') s += ' ASC';
            if (ordering._direction === 'DESC') s += ' DESC';

            return s;
        } else {
            return convertColumn(ordering);
        }
    }

    function convertTable(table: any): string {
        return options.nameEscape + table._$name + options.nameEscape;
    }

    function convertColumn(column: any): string {
        let s = '';
        if (!(column._name === '*' && column._modifiers.length > 0 && column._modifiers[0].name === 'count')) {
            s += convertTable(column._table) + '.';
        }
        s += convertColumnName(column);
        return convertColumnModifiers(s, column);
    }

    function convertColumnModifiers(s: string, column: any): string {
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
                else if (name === 'as') s = s + ' AS ' + options.nameEscape + modifier.params + options.nameEscape;
            });
        }
        return s + '';
    }

    function convertColumnName(column: any): string {
        if (column._name === '*') return column._name;
        let name = typeof column._name === 'string' ? column._name : column._name.name;
        return options.nameEscape + name + options.nameEscape;
    }

    function preprocessConditions(conditions: any[]): void {
        conditions.forEach(condition => {
            if (conditions.length > 1 && condition._sibling) {
                condition._parenthesis = true;
            }
            preprocessParams(condition);
        });
    }

    // this is only needed, so that the $1, $2... numbering is not reversed
    function preprocessParams(condition: any): void {
        if (condition._sibling) {
            preprocessParams(condition._sibling);
        }
        if (!condition._sibling && !condition._child) {
            condition.__param = getConditionParam(condition);
        }
        if (condition._child) {
            preprocessParams(condition._child);
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

    function getConditionParam(condition: any): string {
        let param = '';
        if (condition._otherColumn) {
            param = convertColumn(condition._otherColumn);
        } else {
            let _convertParam = (param: any) => convertParam(condition._column, param);

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

    function convertParam(column: any, param: any): string {
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
}

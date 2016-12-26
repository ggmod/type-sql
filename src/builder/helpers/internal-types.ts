
// query:

export type QueryAction = 'select' | 'insert' | 'update' | 'delete';

// columns:

export type ColumnModifierType = 'as' | 'count' | 'min' | 'min' | 'max' | 'sum' | 'avg' | 'lower' | 'upper';

export interface ColumnModifier {
    name: ColumnModifierType,
    params?: any
}

export type ColumnName = string | { name: string, alias: string };

export type ColumnType = 'boolean' | 'number' | 'string' | 'date'; // FIXME use this in the columns, but it causes type errors

// conditions:

export type ConditionChainType = 'or' | 'and';

export type ConditionType = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'not-in' | 'between' | 'not-between'
    | 'like' | 'not-like' | 'is-null' | 'is-not-null';

// joins:

export type JoinType = 'inner' | 'left' | 'right' | 'full';

// processor:

export type QueryProcessor = (query: any) => Promise<any>;

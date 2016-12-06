
// query:

export type QueryAction = 'select' | 'insert' | 'update' | 'delete';

// columns:

export type ColumnModifierType = 'as' | 'count' | 'min' | 'min' | 'max' | 'sum' | 'avg' | 'lower' | 'upper';

export interface ColumnModifier {
    name: ColumnModifierType,
    params?: any
}

export type ColumnParams = string; // TODO I planned for more params than just the name

export type ColumnType = 'boolean' | 'number' | 'string' | 'date'; // FIXME TS bug

// conditions:

export type ConditionChainType = 'or' | 'and';

export type ConditionType = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'not-in' | 'between' | 'not-between'
    | 'like' | 'not-like' | 'is-null' | 'is-not-null';

// joins:

export type JoinType = 'inner' | 'left' | 'right' | 'full';

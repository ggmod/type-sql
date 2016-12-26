import QueryCondition from "../condition/query-condition";
import QueryOrdering from "../other/query-ordering";
import QueryTable from "../query-table";
import QueryColumn from "../column/query-column";
import { QueryProcessor, QueryAction } from "../helpers/internal-types";


export default class SelectQuery<Entity, Table extends QueryTable<Entity, any>> {

    constructor(
        protected _queryProcessor: QueryProcessor,
        protected _tables: Table[]
    ) {}

    protected _distinct = false;
    protected _offset: number;
    protected _limit: number;
    protected _conditions: QueryCondition<Table>[] = [];
    protected _groupBy: QueryColumn<Table, any>[] = [];
    protected _having: QueryCondition<Table>[] = [];
    protected _orderings: (QueryColumn<Table, any> | QueryOrdering<Table>)[] = [];
    protected _columns: QueryColumn<Table, any>[] = [];
    protected _action: QueryAction;

    offset(offset: number): this {
        this._offset = offset;
        return this;
    }

    limit(limit: number): this {
        this._limit = limit;
        return this;
    }

    distinct(): this {
        this._distinct = true;
        return this;
    }

    where(...conditions: QueryCondition<Table>[]): this {
        this._conditions = conditions;
        return this;
    }

    groupBy(...columns: QueryColumn<Table, any>[]): this {
        this._groupBy = columns;
        return this;
    }

    having(...conditions: QueryCondition<Table>[]): this {
        this._having = conditions;
        return this;
    }

    orderBy(...orderings: (QueryColumn<Table, any> | QueryOrdering<Table>)[]): this {
        this._orderings = orderings;
        return this;
    }

    select(): Promise<Entity[]>
    select<T>(column: QueryColumn<Table, T>): Promise<T[]>
    select(...columns: QueryColumn<Table, any>[]): Promise<any[]>
    select(...columns: QueryColumn<Table, any>[]): Promise<any[]> {
        this._columns = columns;
        this._action = 'select';
        return this._queryProcessor(this);
    }
}

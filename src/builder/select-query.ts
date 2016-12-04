import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import QueryProcessor from "../query-processor";


export default class SelectQuery<Entity, Table extends QueryTable<Entity, any>> {

    constructor(queryProcessor: QueryProcessor, tables: Table[]) {
        this._queryProcessor = queryProcessor;
        this._tables = tables;
    }

    private _queryProcessor;

    private _tables;
    private _distinct = false;
    private _offset;
    private _limit;
    private _conditions = [];
    private _groupBy = [];
    private _having = [];
    private _orderings = [];
    private _columns = [];
    private _action: string;

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
        return this._queryProcessor.execute(this);
    }
}

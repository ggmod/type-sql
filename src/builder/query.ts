import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import QueryResult from "./query-result";
import QueryProcessor from "../query-processor";


export default class Query<Entity, Table extends QueryTable<Entity>> {

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
    private _orderings = [];
    private _columns = [];
    private _singleColumn;

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

    orderBy(...orderings: (QueryColumn<Table, any> | QueryOrdering<Table>)[]): this {
        this._orderings = orderings;
        return this;
    }

    select(): QueryResult<Entity[]>
    select<T>(column: QueryColumn<Table, T>): QueryResult<T[]>
    select(...columns: QueryColumn<Table, any>[]): QueryResult<any[]>
    select(...columns: QueryColumn<Table, any>[]): QueryResult<any[]> {
        this._columns = columns;
        return new QueryResult(this._queryProcessor, this);
    }

    count(): QueryResult<number> {
        this._singleColumn = 'count';
        return new QueryResult(this._queryProcessor, this);
    }
}

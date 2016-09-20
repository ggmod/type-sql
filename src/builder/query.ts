import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import QueryResult from "./query-result";
import QueryProcessor from "../query-processor";


export default class Query<Table extends QueryTable> {

    constructor(queryProcessor: QueryProcessor, table: Table) {
        this._table = table;
        this._queryProcessor = queryProcessor;
    }

    private _table;
    private _queryProcessor;
    private _distinct = false;
    private _offset;
    private _limit;
    private _conditions = [];
    private _orderings = [];
    private _columns = [];

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

    where(...conditions: QueryCondition<any, Table>[]): this {
        this._conditions = conditions;
        return this;
    }

    orderBy(...orderings: QueryOrdering<Table>[]): this {
        this._orderings = orderings;
        return this;
    }

    select(...columns: QueryColumn<any, Table>[]): QueryResult<any> {
        this._columns = columns;
        return new QueryResult(this._queryProcessor, this);
    }
}

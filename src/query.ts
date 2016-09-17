import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";
import DatabaseTable from "./database-table";
import DatabaseTableColumn from "./database-table-column";
import { processQuery } from "./query-processor";
import QueryResult from "./query-result";


function createResult(query: Query<any>) {
    let processedQuery = processQuery(query);
    // TODO send to query to the DB.
    return new QueryResult(() => Promise.resolve(), processedQuery);
}

export default class Query<T> {

    constructor(table: DatabaseTable) {
        this._table = table;
    }

    private _table;
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

    where(...conditions: QueryCondition<any>[]): this {
        this._conditions = conditions;
        return this;
    }

    orderBy(...orderings: QueryOrdering[]): this {
        this._orderings = orderings;
        return this;
    }

    select(...columns: DatabaseTableColumn<any>[]): QueryResult<any> {
        this._columns = columns;
        return createResult(this);
    }
}

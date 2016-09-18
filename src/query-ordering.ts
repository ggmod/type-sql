import QueryColumn from "./query-column";
import QueryTable from "./query-table";


export default class QueryOrdering<Table extends QueryTable> {

    private _column: QueryColumn<any, Table>;
    private _direction: 'ASC' | 'DESC';
    private _nullsPosition: 'FIRST' | 'LAST';

    constructor(column: QueryColumn<any, Table>, direction: 'ASC' | 'DESC') {
        this._column = column;
        this._direction = direction;
    }

    nullsFirst(): this {
        this._nullsPosition = 'FIRST';
        return this;
    }

    nullsLast(): this {
        this._nullsPosition = 'LAST';
        return this;
    }

}


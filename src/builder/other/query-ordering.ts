import QueryColumn from "../column/query-column";
import QueryTable from "../query-table";


export default class QueryOrdering<Table extends QueryTable<any, any>> {

    private _column: QueryColumn<Table, any>;
    private _direction: 'ASC' | 'DESC';
    private _nullsPosition: 'FIRST' | 'LAST';

    constructor(column: QueryColumn<Table, any>, direction: 'ASC' | 'DESC') {
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


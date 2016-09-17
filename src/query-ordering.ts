import DatabaseTableColumn from "./database-table-column";


export default class QueryOrdering {

    private _column: DatabaseTableColumn<any>;
    private _direction: 'ASC' | 'DESC';
    private _nullsPosition: 'FIRST' | 'LAST';

    constructor(column: DatabaseTableColumn<any>, direction: 'ASC' | 'DESC') {
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


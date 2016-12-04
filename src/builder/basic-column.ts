import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import NumberColumn from "./number-column";

// This file is only needed because the QueryColumn can't implement its count method b. of circular dependencies

export default class BasicQueryColumn<Table extends QueryTable<any, any>, T> extends QueryColumn<Table, T> {

    constructor(table: Table, params, modifiers = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }
}

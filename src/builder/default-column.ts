import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import NumberColumn from "./number-column";


export default class DefaultQueryColumn<Table extends QueryTable, T> extends QueryColumn<Table, T> {

    constructor(table: Table, params, modifiers = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat('count'));
    }
}

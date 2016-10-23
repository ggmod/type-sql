import QueryTable from "./query-table";
import NumberColumn from "./number-column";
import ValueColumn from "./value-column";


export default class BooleanColumn<Table extends QueryTable<any>> extends ValueColumn<Table, boolean> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }

}

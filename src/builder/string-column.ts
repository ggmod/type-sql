import QueryTable from "./query-table";
import ValueColumn from "./value-column";
import NumberColumn from "./number-column";


export default class StringColumn<Table extends QueryTable> extends ValueColumn<Table, string> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    lower(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat('lower'));
    }

    upper(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat('upper'));
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat('count'));
    }
}

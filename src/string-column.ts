import QueryColumn from "./query-column";
import QueryTable from "./query-table";


export default class StringColumn<Table extends QueryTable> extends QueryColumn<string, Table> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    lower(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat('lower'));
    }

    upper(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat('upper'));
    }

}

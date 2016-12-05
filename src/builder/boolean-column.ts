import QueryTable from "./query-table";
import NumberColumn from "./number-column";
import ValueColumn from "./value-column";
import {ColumnModifier, ColumnParams} from "./internal-types";


export default class BooleanColumn<Table extends QueryTable<any, any>> extends ValueColumn<Table, boolean> {

    protected _type = 'boolean';

    constructor(table: Table, params: ColumnParams, modifiers: ColumnModifier[] = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }

}

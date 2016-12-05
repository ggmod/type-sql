import QueryTable from "./query-table";
import ComparableColumn from "./comparable-column";
import {ColumnModifier, ColumnParams} from "./internal-types";


export default class NumberColumn<Table extends QueryTable<any, any>> extends ComparableColumn<Table, number> {

    protected _type = 'number';

    constructor(table: Table, params: ColumnParams, modifiers: ColumnModifier[] = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }

    sum(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'sum' }));
    }

    avg(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'avg' }));
    }
}

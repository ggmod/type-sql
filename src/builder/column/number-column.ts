import QueryTable from "../query-table";
import ComparableColumn from "./comparable-column";
import {ColumnModifier, ColumnName} from "../helpers/internal-types";


export default class NumberColumn<Table extends QueryTable<any, any>> extends ComparableColumn<Table, number> {

    protected _type = 'number';

    constructor(table: Table, name: ColumnName, modifiers: ColumnModifier[] = []) {
        super(table, name, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._name, this._modifiers.concat({ name: 'count' }));
    }

    sum(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._name, this._modifiers.concat({ name: 'sum' }));
    }

    avg(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._name, this._modifiers.concat({ name: 'avg' }));
    }
}

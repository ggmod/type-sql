import QueryTable from "../query-table";
import NumberColumn from "./number-column";
import ValueColumn from "./value-column";
import {ColumnModifier, ColumnName} from "../helpers/internal-types";


export default class BooleanColumn<Table extends QueryTable<any, any>> extends ValueColumn<Table, boolean> {

    protected _type = 'boolean';

    constructor(table: Table, name: ColumnName, modifiers: ColumnModifier[] = []) {
        super(table, name, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._name, this._modifiers.concat({ name: 'count' }));
    }

}

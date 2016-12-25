import QueryTable from "../query-table";
import QueryColumn from "./query-column";
import NumberColumn from "./number-column";
import {ColumnModifier, ColumnName} from "../helpers/internal-types";

// This file is only needed because the QueryColumn can't implement its count method b. of circular dependencies

export default class BasicColumn<Table extends QueryTable<any, any>, T> extends QueryColumn<Table, T> {

    constructor(table: Table, name: ColumnName, modifiers: ColumnModifier[] = []) {
        super(table, name, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._name, this._modifiers.concat({ name: 'count' }));
    }
}

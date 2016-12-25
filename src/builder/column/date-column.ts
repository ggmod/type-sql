import QueryTable from "../query-table";
import ComparableColumn from "./comparable-column";
import NumberColumn from "./number-column";
import {ColumnModifier, ColumnName} from "../helpers/internal-types";


export default class DateColumn<Table extends QueryTable<any, any>> extends ComparableColumn<Table, Date> {

    protected _type = 'date';

    constructor(table: Table, name: ColumnName, modifiers: ColumnModifier[] = []) {
        super(table, name, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._name, this._modifiers.concat({ name: 'count' }));
    }

}

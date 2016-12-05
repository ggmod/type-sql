import QueryTable from "./query-table";
import ComparableColumn from "./comparable-column";
import NumberColumn from "./number-column";
import {ColumnModifier, ColumnParams} from "./internal-types";


export default class DateColumn<Table extends QueryTable<any, any>> extends ComparableColumn<Table, Date> {

    protected _type = 'date';

    constructor(table: Table, params: ColumnParams, modifiers: ColumnModifier[] = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }

}

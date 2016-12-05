import QueryTable from "./query-table";
import ComparableColumn from "./comparable-column";
import NumberColumn from "./number-column";
import QueryColumnCondition from "./query-column-condition";
import {ColumnModifier, ColumnParams} from "./internal-types";


export default class StringColumn<Table extends QueryTable<any, any>> extends ComparableColumn<Table, string> {

    protected _type = 'string';

    constructor(table: Table, params: ColumnParams, modifiers: ColumnModifier[] = []) {
        super(table, params, modifiers);
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }

    lower(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat({ name: 'lower' }));
    }

    upper(): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat({ name: 'upper' }));
    }

    contains(value: string) {
        return this.like('%' + value + '%');
    }

    startsWith(value: string) {
        return this.like(value + '%');
    }

    endsWith(value: string) {
        return this.like('%' + value);
    }

    like(value: string) {
        return new QueryColumnCondition<Table, string>(this, 'like', value);
    }

    notLike(value: string) {
        return new QueryColumnCondition<Table, string>(this, 'not-like', value);
    }
}

import QueryCondition from "./query-condition";
import QueryTable from "./query-table";
import ValueColumn from "./value-column";


export default class NumberColumn<Table extends QueryTable> extends ValueColumn<Table, number> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    lt(value: number) {
        return new QueryCondition<Table, number>(this, 'lt', value);
    }

    gt(value: number) {
        return new QueryCondition<Table, number>(this, 'gt', value);
    }

    lte(value: number) {
        return new QueryCondition<Table, number>(this, 'lte', value);
    }

    gte(value: number) {
        return new QueryCondition<Table, number>(this, 'gte', value);
    }

    sum(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat('sum'));
    }

    avg(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat('avg'));
    }

    min(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat('min'));
    }

    max(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat('max'));
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat('count'));
    }
}

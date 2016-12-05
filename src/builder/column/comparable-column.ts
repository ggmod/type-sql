import QueryColumnCondition from "../condition/query-column-condition";
import QueryTable from "../query-table";
import ValueColumn from "./value-column";
import {ColumnModifier, ColumnParams} from "../internal-types";


abstract class ComparableColumn<Table extends QueryTable<any, any>, T> extends ValueColumn<Table, T> {

    constructor(table: Table, params: ColumnParams, modifiers: ColumnModifier[] = []) {
        super(table, params, modifiers);
    }

    lt(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'lt', value);
    }

    gt(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'gt', value);
    }

    lte(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'lte', value);
    }

    gte(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'gte', value);
    }

    in(values: T[]) {
        return new QueryColumnCondition<Table, T>(this, 'in', ...values);
    }

    notIn(values: T[]) {
        return new QueryColumnCondition<Table, T>(this, 'not-in', ...values);
    }

    between(value1: T, value2: T) {
        return new QueryColumnCondition<Table, T>(this, 'between', value1, value2);
    }

    notBetween(value1: T, value2: T) {
        return new QueryColumnCondition<Table, T>(this, 'not-between', value1, value2);
    }

    // min/max exists for text columns too, not just numeric and date

    min(): this {
        return (<any>this.constructor)(this._table, this._params, this._modifiers.concat({ name: 'min' }));
    }

    max(): this {
        return (<any>this.constructor)(this._table, this._params, this._modifiers.concat({ name: 'max' }));
    }
}

export default ComparableColumn;

import QueryColumnCondition from "./query-column-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";


abstract class ValueColumn<Table extends QueryTable<any>, T> extends QueryColumn<Table, T> {

    constructor(table: Table, params, modifiers = []) {
        super(table, params, modifiers);
    }

    asc() {
        return new QueryOrdering<Table>(this, 'ASC');
    }

    desc() {
        return new QueryOrdering<Table>(this, 'DESC');
    }

    eq(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'eq', value);
    }

    ne(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'ne', value);
    }

    isNull() {
        return new QueryColumnCondition<Table, T>(this, 'is-null', null);
    }

    isNotNull() {
        return new QueryColumnCondition<Table, T>(this, 'is-not-null', null);
    }

    in(values: T[]) {
        return new QueryColumnCondition<Table, T[]>(this, 'in', values);
    }
}

export default ValueColumn;

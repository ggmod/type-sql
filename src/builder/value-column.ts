import QueryColumnCondition from "./query-column-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";
import QueryCondition from "./query-condition";
import QueryJoinCondition from "./query-join-condition";


abstract class ValueColumn<Table extends QueryTable<any, any>, T> extends QueryColumn<Table, T> {

    constructor(table: Table, params, modifiers = []) {
        super(table, params, modifiers);
    }

    asc() {
        return new QueryOrdering<Table>(this, 'ASC');
    }

    desc() {
        return new QueryOrdering<Table>(this, 'DESC');
    }

    eq<Table2 extends QueryTable<any, any>>(value: QueryColumn<Table2, T>): QueryJoinCondition<Table, Table2, T>;
    eq(value: T): QueryColumnCondition<Table, T>;
    eq<Table2 extends QueryTable<any, any>>(value: any): QueryCondition<any> {
        if (value instanceof QueryColumn) {
            return new QueryJoinCondition<Table, Table2, T>(this, 'eq', value);
        } else {
            return new QueryColumnCondition<Table, T>(this, 'eq', value);
        }
    }

    ne(value: T) {
        return new QueryColumnCondition<Table, T>(this, 'ne', value);
    }
}

export default ValueColumn;

import QueryColumnCondition from "../condition/query-column-condition";
import QueryOrdering from "../other/query-ordering";
import QueryTable from "../query-table";
import QueryColumn from "./query-column";
import QueryCondition from "../condition/query-condition";
import QueryJoinCondition from "../condition/query-join-condition";
import {ColumnModifier, ColumnName} from "../helpers/internal-types";


abstract class ValueColumn<Table extends QueryTable<any, any>, T> extends QueryColumn<Table, T> {

    constructor(table: Table, name: ColumnName, modifiers: ColumnModifier[] = []) {
        super(table, name, modifiers);
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

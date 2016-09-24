import QueryCondition from "./query-condition";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";


export default class NumberColumn<Table extends QueryTable> extends QueryColumn<Table, number> {

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

}

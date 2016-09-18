import QueryCondition from "./query-condition";
import QueryTable from "./query-table";
import QueryColumn from "./query-column";


export default class NumberColumn<Table extends QueryTable> extends QueryColumn<number, Table> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    lt(value: number) {
        return new QueryCondition<number, Table>(this, 'lt', value);
    }

    gt(value: number) {
        return new QueryCondition<number, Table>(this, 'gt', value);
    }

    lte(value: number) {
        return new QueryCondition<number, Table>(this, 'lte', value);
    }

    gte(value: number) {
        return new QueryCondition<number, Table>(this, 'gte', value);
    }

}

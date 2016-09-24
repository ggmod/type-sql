import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";
import QueryTable from "./query-table";


export default class QueryColumn<Table extends QueryTable, T> {

    protected _params;
    protected _modifiers;
    protected _table: Table;

    constructor(table: Table, params, modifiers = []) {
        this._table = table;
        this._params = params;
        this._modifiers = modifiers;
    }

    asc() {
        return new QueryOrdering<Table>(this, "ASC");
    }

    desc() {
        return new QueryOrdering<Table>(this, "DESC");
    }

    eq(value: T) {
        return new QueryCondition<Table, T>(this, 'eq', value);
    }

    ne(value: T) {
        return new QueryCondition<Table, T>(this, 'ne', value);
    }
}

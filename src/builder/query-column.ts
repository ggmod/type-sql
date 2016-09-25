import QueryTable from "./query-table";
import NumberColumn from "./number-column";
import GenericsHelper from "./generics-helper";


abstract class QueryColumn<Table extends QueryTable<any>, T> {

    private _$type: GenericsHelper<T>;
    protected _params;
    protected _modifiers;
    protected _table: Table;

    constructor(table: Table, params, modifiers = []) {
        this._table = table;
        this._params = params;
        this._modifiers = modifiers;
    }

    abstract count(): NumberColumn<Table>; // TODO I had to copy-paste the implementation to every child class to avoid a circular dependency
}

export default QueryColumn;

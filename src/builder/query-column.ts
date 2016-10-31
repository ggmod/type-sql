import QueryTable from "./query-table";
import NumberColumn from "./number-column";
import GenericsHelper from "./generics-helper";
import QueryColumnCondition from "./query-column-condition";


abstract class QueryColumn<Table extends QueryTable<any>, T> {

    private _$type: GenericsHelper<T>;
    protected _params;
    protected _modifiers;
    protected _table: Table;
    protected _type: string;

    constructor(table: Table, params, modifiers = []) {
        this._table = table;
        this._params = params;
        this._modifiers = modifiers;
    }

    abstract count(): NumberColumn<Table>; // TODO I had to copy-paste the implementation to every child class to avoid a circular dependency

    as(alias: string): this {
        return new (<any>this.constructor)(this._table, this._params, this._modifiers.concat({ name: 'as', params: alias }));
    }

    isNull() {
        return new QueryColumnCondition<Table, T>(this, 'is-null', null);
    }

    isNotNull() {
        return new QueryColumnCondition<Table, T>(this, 'is-not-null', null);
    }
}

export default QueryColumn;

import QueryCondition from "./query-condition";
import QueryOrdering from "./query-ordering";


export default class DatabaseTableColumn<T> {

    protected _params;
    protected _modifiers;

    constructor(params, modifiers = []) {
        this._params = params;
        this._modifiers = modifiers;
    }

    // --------------

    asc() {
        return new QueryOrdering(this, "ASC");
    }

    desc() {
        return new QueryOrdering(this, "DESC");
    }

    eq(value: T) { return this.equals(value); }

    equals(value: T) {
        return new QueryCondition(this, 'eq', value);
    }

    ne(value: T) { return this.notEquals(value); }

    notEquals(value: T) {
        return new QueryCondition(this, 'ne', value);
    }
}

import DatabaseTableColumn from "./database-table-column";
import QueryCondition from "./query-condition";


export default class NumberColumn extends DatabaseTableColumn<number> {

    constructor(params, modifiers?) {
        super(params, modifiers);
    }

    lt(value: number) { return this.lessThan(value); }

    lessThan(value: number) {
        return new QueryCondition(this, 'lt', value);
    }

    gt(value: number) { return this.greaterThan(value); }

    greaterThan(value: number) {
        return new QueryCondition(this, 'gt', value);
    }

    lte(value: number) { return this.lessThanOrEquals(value); }

    lessThanOrEquals(value: number) {
        return new QueryCondition(this, 'lte', value);
    }

    gte(value: number) { return this.greaterThanOrEquals(value); }

    greaterThanOrEquals(value: number) {
        return new QueryCondition(this, 'gte', value);
    }

}

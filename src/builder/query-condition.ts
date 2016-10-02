import QueryTable from "./query-table";

// TODO create abstract class and QueryConditionChain, but then the circular dependency error would appear here too

export default class QueryCondition<Table extends QueryTable<any>> {

    protected _sibling: QueryCondition<any>;
    protected _child: QueryCondition<any>;
    protected _chainType: string;
    protected _parenthesis = false;

    constructor(sibling?: QueryCondition<any>, child?: QueryCondition<any>, chainType?: string) {
        this._sibling = sibling;
        this._child = child;
        this._chainType = chainType;
    }

    and<Table2 extends QueryTable<any>>(condition: QueryCondition<Table2>) {
        return new QueryCondition<Table | Table2>(this, condition, 'AND');
    }

    or<Table2 extends QueryTable<any>>(condition: QueryCondition<Table2>) {
        return new QueryCondition<Table | Table2>(this, condition, 'OR');
    }

    // TODO how to call this
    $() {
        this._parenthesis = true;
        return this;
    }
}

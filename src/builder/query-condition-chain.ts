import QueryTable from "./query-table";
import QueryCondition from "./query-condition";
import GenericsHelper from "./generics-helper";


export default class QueryConditionChain<Table extends QueryTable<any, any>> extends QueryCondition<Table> {

    private _$type: GenericsHelper<Table>;

    protected _sibling: QueryCondition<any>;
    protected _child: QueryCondition<any>;
    protected _chainType: string;
    protected _parenthesis = false;
    protected _negation = false;

    constructor(sibling: QueryCondition<any>, child: QueryCondition<any>, chainType: string) {
        super();
        this._sibling = sibling;
        this._child = child;
        this._chainType = chainType;
    }

    // TODO how to call this
    $() {
        this._parenthesis = true;
        return this;
    }

    not() {
        this._negation = true;
        return this;
    }

    and<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>) {
        return new QueryConditionChain<Table | Table2>(this, condition, 'AND');
    }

    or<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>) {
        return new QueryConditionChain<Table | Table2>(this, condition, 'OR');
    }
}

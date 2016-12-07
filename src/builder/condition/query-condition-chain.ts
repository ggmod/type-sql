import QueryTable from "../query-table";
import QueryCondition from "./query-condition";
import GenericsHelper from "../helpers/generics-helper";
import {ConditionChainType} from "../helpers/internal-types";


export default class QueryConditionChain<Table extends QueryTable<any, any>> extends QueryCondition<Table> {

    protected _$type: GenericsHelper<Table>;

    protected _sibling: QueryCondition<any>;
    protected _child: QueryCondition<any>;
    protected _chainType: ConditionChainType;
    protected _parenthesis = false;
    protected _negation = false;

    constructor(sibling: QueryCondition<any>, child: QueryCondition<any>, chainType: ConditionChainType) {
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

    and<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>): QueryConditionChain<Table | Table2>  {
        return new QueryConditionChain<Table | Table2>(this, condition, 'and');
    }

    or<Table2 extends QueryTable<any, any>>(condition: QueryCondition<Table2>): QueryConditionChain<Table | Table2>  {
        return new QueryConditionChain<Table | Table2>(this, condition, 'or');
    }
}

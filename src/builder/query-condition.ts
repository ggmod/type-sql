
// TODO create abstract class and QueryConditionChain, but then the circular dependency error would appear here too

export default class QueryCondition<Table> {

    protected _sibling: QueryCondition<any>;
    protected _child: QueryCondition<any>;
    protected _chainType: string;

    constructor(sibling?: QueryCondition<any>, child?: QueryCondition<any>, chainType?: string) {
        this._sibling = sibling;
        this._child = child;
        this._chainType = chainType;
    }

    and(condition: QueryCondition<any>) {
        return new QueryCondition(this, condition, 'AND');
    }

    or(condition: QueryCondition<any>) {
        return new QueryCondition(this, condition, 'OR');
    }
}

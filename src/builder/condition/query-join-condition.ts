import QueryColumn from "../column/query-column";
import QueryTable from "../query-table";
import QueryCondition from "./query-condition";
import QueryConditionChain from "./query-condition-chain";


export default class QueryJoinCondition<Table1 extends QueryTable<any, any>, Table2 extends QueryTable<any, any>, T> extends QueryCondition<Table1 | Table2> {

    protected _column: QueryColumn<Table1, T>;
    protected _type: string;
    protected _otherColumn: QueryColumn<Table2, T>;

    constructor(column: QueryColumn<Table1, T>, type: string, otherColumn: QueryColumn<Table2, T>) {
        super();
        this._column = column;
        this._type = type;
        this._otherColumn = otherColumn;
    }

    and<Table3 extends QueryTable<any, any>>(condition: QueryCondition<Table3>): QueryConditionChain<Table1 | Table2 | Table3>  {
        return new QueryConditionChain<Table1 | Table2 | Table3>(this, condition, 'and');
    }

    or<Table3 extends QueryTable<any, any>>(condition: QueryCondition<Table3>): QueryConditionChain<Table1 | Table2 | Table3>  {
        return new QueryConditionChain<Table1 | Table2 | Table3>(this, condition, 'or');
    }
}

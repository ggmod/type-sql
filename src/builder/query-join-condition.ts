import QueryColumn from "./query-column";
import QueryTable from "./query-table";
import QueryCondition from "./query-condition";


export default class QueryJoinCondition<Table1 extends QueryTable<any>, Table2 extends QueryTable<any>, T> extends QueryCondition<Table1 | Table2> {

    protected _column: QueryColumn<Table1, T>;
    protected _type: string;
    protected _otherColumn: QueryColumn<Table2, T>;

    constructor(column: QueryColumn<Table1, T>, type: string, otherColumn: QueryColumn<Table2, T>) {
        super();
        this._column = column;
        this._type = type;
        this._otherColumn = otherColumn;
    }
}

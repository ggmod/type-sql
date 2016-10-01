import QueryColumn from "./query-column";
import QueryTable from "./query-table";
import QueryCondition from "./query-condition";


export default class QueryColumnCondition<Table extends QueryTable<any>, T> extends QueryCondition<Table> {

    protected _column: QueryColumn<Table, T>;
    protected _type: string;
    protected _value: T;

    constructor(column: QueryColumn<Table, T>, type: string, value: T) {
        super();
        this._column = column;
        this._type = type;
        this._value = value;
    }
}

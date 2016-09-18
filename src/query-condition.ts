import QueryColumn from "./query-column";
import QueryTable from "./query-table";

export default class QueryCondition<T, Table extends QueryTable> {

    private _column: QueryColumn<T, Table>;
    private _type: string;
    private _value: T;

    constructor(column: QueryColumn<T, Table>, type: string, value: T) {
        this._column = column;
        this._type = type;
        this._value = value;
    }
}

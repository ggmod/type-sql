import QueryColumn from "./query-column";
import QueryTable from "./query-table";

export default class QueryCondition<Table extends QueryTable, T> {

    private _column: QueryColumn<Table, T>;
    private _type: string;
    private _value: T;

    constructor(column: QueryColumn<Table, T>, type: string, value: T) {
        this._column = column;
        this._type = type;
        this._value = value;
    }
}

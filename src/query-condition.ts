import DatabaseTableColumn from "./database-table-column";

export default class QueryCondition<T> {

    private _column: DatabaseTableColumn<T>;
    private _type: string;
    private _value: T;

    constructor(column: DatabaseTableColumn<T>, type: string, value: T) {
        this._column = column;
        this._type = type;
        this._value = value;
    }
}

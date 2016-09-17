import DatabaseTableColumn from "./database-table-column";

export default class StringColumn extends DatabaseTableColumn<string> {

    constructor(params, modifiers?) {
        super(params, modifiers);
    }

    lower(): this {
        return new (<any>this.constructor)(this._params, this._modifiers.concat('lower'));
    }

    upper(): this {
        return new (<any>this.constructor)(this._params, this._modifiers.concat('upper'));
    }

}

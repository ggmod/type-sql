import QueryTable from "./query-table";
import QueryProcessor from "../query-processor";
import QueryCondition from "./query-condition";


export default class TableConditionQuery<Entity, Table extends QueryTable<Entity, any>> {

    constructor(queryProcessor: QueryProcessor, table: Table, conditions: QueryCondition<Table>[]) {
        this._queryProcessor = queryProcessor;
        this._table = table;
        this._conditions = conditions;
    }

    private _queryProcessor;
    private _table: Table;
    private _conditions = [];
    private _action: string;

    protected _entity: Entity;

    update(entity: Entity) { // TODO Partial<Entity>
        this._entity = entity;
        this._action = 'update';
        return this._queryProcessor.execute(this);
    }

    delete() {
        this._action = 'delete';
        return this._queryProcessor.execute(this);
    }
}

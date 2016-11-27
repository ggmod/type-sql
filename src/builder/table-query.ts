import QueryTable from "./query-table";
import TableConditionQuery from "./table-condition-query";
import QueryCondition from "./query-condition";
import QueryProcessor from "../query-processor";


export default class TableQuery<Entity, Table extends QueryTable<Entity>> {

    constructor(queryProcessor: QueryProcessor, table: Table) {
        this._queryProcessor = queryProcessor;
        this._table = table;
    }

    private _queryProcessor;
    private _table: Table;
    private _entity: Entity | Entity[];
    private _action: string;

    where(...conditions: QueryCondition<Table>[]): TableConditionQuery<Entity, Table> {
        return new TableConditionQuery<Entity, Table>(this._queryProcessor, this._table, conditions);
    }

    insert(entity: Entity)
    insert(entities: Entity[])
    insert(param: any) {
        this._entity = param;
        this._action = 'insert';
        return this._queryProcessor.execute(this);
    }

    deleteAll() {
        this._action = 'delete';
        return this._queryProcessor.execute(this);
    }

    updateAll(entity: Entity) {
        this._entity = entity;
        this._action = 'update';
        return this._queryProcessor.execute(this);
    }
}

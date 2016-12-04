import QueryTable from "./query-table";
import TableConditionQuery from "./table-condition-query";
import QueryCondition from "./query-condition";
import QueryProcessor from "../query-processor";
import ValueColumn from "./value-column";
import QueryColumn from "./query-column";


export default class TableQuery<Entity, Id, Table extends QueryTable<Entity, Id>> {

    constructor(queryProcessor: QueryProcessor, table: Table) {
        this._queryProcessor = queryProcessor;
        this._table = table;
    }

    private _queryProcessor;
    private _table: Table;
    private _entity: Entity | Entity[];
    private _action: string;
    private _columns: QueryColumn<Table, any>[] = [];

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

    countAll() {
        this._columns = [this._table.$all.count()];
        this._action = 'select';
        return this._queryProcessor.execute(this);
    }

    delete(id: Id) {
        return this._whereId(id).delete();
    }

    update(id: Id, entity: Entity) {
        return this._whereId(id).update(entity);
    }

    get(id: Id): Promise<Entity> {
        let query = this._whereId(id);
        return this._queryProcessor.execute(Object.assign({ _action: 'select' }, query)); // TODO replace Object.assign
    }

    _whereId(id: Id): TableConditionQuery<Entity, Table> {
        let $id = (this._table as any).$id; // FIXME
        if ($id instanceof ValueColumn) {
            return this.where($id.eq(id));
        } else {
            return this.where(...Object.keys($id).map(key => this._table[key].eq(id[key])));
        }
    }
}

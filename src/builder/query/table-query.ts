import QueryTable from "../query-table";
import TableConditionQuery from "./table-condition-query";
import QueryCondition from "../condition/query-condition";
import ValueColumn from "../column/value-column";
import QueryColumn from "../column/query-column";
import { QueryProcessor, QueryAction } from "../helpers/internal-types";


export default class TableQuery<Entity, Id, Table extends QueryTable<Entity, Id>> {

    constructor(
        protected _queryProcessor: QueryProcessor,
        protected _table: Table
    ) {}

    protected _entity: Entity | Entity[] | Partial<Entity>;
    protected _action: QueryAction;
    protected _columns: QueryColumn<Table, any>[] = [];

    where(...conditions: QueryCondition<Table>[]) {
        return new TableConditionQuery<Entity, Table>(this._queryProcessor, this._table, conditions);
    }

    insert(entity: Entity): Promise<any> // returns the generated ID, but not other kinds of IDs, so the type is unknown (mysql limitations)
    insert(entities: Entity[]): Promise<void>
    insert(param: any): Promise<any> {
        this._entity = param;
        this._action = 'insert';
        return this._queryProcessor(this);
    }

    deleteAll(): Promise<number> {
        this._action = 'delete';
        return this._queryProcessor(this);
    }

    updateAll(entity: Partial<Entity>): Promise<number> {
        this._entity = entity;
        this._action = 'update';
        return this._queryProcessor(this);
    }

    countAll(): Promise<number> {
        this._columns = [this._table.$all.count()];
        this._action = 'select';
        return this._queryProcessor(this).then((rows: any[]) => rows[0]);
    }

    delete(id: Id): Promise<boolean> {
        return this._whereId(id).delete().then(count => count > 0);
    }

    update(id: Id, entity: Partial<Entity>): Promise<boolean> {
        return this._whereId(id).update(entity).then(count => count > 0);
    }

    get(id: Id): Promise<Entity | undefined> {
        let query = this._whereId(id);
        return this._queryProcessor({ _action: 'select', ...query })
            .then((rows: Entity[]) => rows[0]);
    }

    _whereId(id: Id): TableConditionQuery<Entity, Table> {
        // TODO remove assertions if $id typing is fixed
        let $id = (this._table as any).$id;
        if ($id instanceof ValueColumn) {
            return this.where($id.eq(id));
        } else {
            return this.where(...Object.keys($id).map(key => ((this._table as any)[key] as ValueColumn<Table, any>).eq((id as any)[key] as any)));
        }
    }
}

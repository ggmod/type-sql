import QueryTable from "../query-table";
import TableConditionQuery from "./table-condition-query";
import QueryCondition from "../condition/query-condition";
import QueryProcessor from "../../query-processor";
import ValueColumn from "../column/value-column";
import QueryColumn from "../column/query-column";
import {QueryAction} from "../internal-types";


export default class TableQuery<Entity, Id, Table extends QueryTable<Entity, Id>> {

    constructor(
        protected _queryProcessor: QueryProcessor,
        protected _table: Table
    ) {}

    protected _entity: Entity | Entity[];
    protected _action: QueryAction;
    protected _columns: QueryColumn<Table, any>[] = [];

    where(...conditions: QueryCondition<Table>[]) {
        return new TableConditionQuery<Entity, Table>(this._queryProcessor, this._table, conditions);
    }

    insert(entity: Entity): Promise<any>
    insert(entities: Entity[]): Promise<any>
    insert(param: any): Promise<any> {
        this._entity = param;
        this._action = 'insert';
        return this._queryProcessor.execute(this);
    }

    deleteAll(): Promise<any> {
        this._action = 'delete';
        return this._queryProcessor.execute(this);
    }

    updateAll(entity: Entity): Promise<any> {
        this._entity = entity;
        this._action = 'update';
        return this._queryProcessor.execute(this);
    }

    countAll(): Promise<number> {
        this._columns = [this._table.$all.count()];
        this._action = 'select';
        return this._queryProcessor.execute(this);
    }

    delete(id: Id): Promise<any> {
        return this._whereId(id).delete();
    }

    update(id: Id, entity: Entity): Promise<any> {
        return this._whereId(id).update(entity);
    }

    get(id: Id): Promise<Entity> {
        let query = this._whereId(id);
        return this._queryProcessor.execute(Object.assign({ _action: 'select' }, query)); // TODO replace Object.assign
    }

    _whereId(id: Id): TableConditionQuery<Entity, Table> {
        // FIXME assertions
        let $id = (this._table as any).$id;
        if ($id instanceof ValueColumn) {
            return this.where($id.eq(id));
        } else {
            return this.where(...Object.keys($id).map(key => ((this._table as any)[key] as ValueColumn<Table, any>).eq((id as any)[key] as any)));
        }
    }
}

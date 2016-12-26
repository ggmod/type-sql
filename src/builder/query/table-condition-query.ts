import QueryTable from "../query-table";
import QueryCondition from "../condition/query-condition";
import QueryColumn from "../column/query-column";
import { QueryProcessor, QueryAction } from "../helpers/internal-types";


export default class TableConditionQuery<Entity, Table extends QueryTable<Entity, any>> {

    constructor(
        protected _queryProcessor: QueryProcessor,
        protected _table: Table,
        protected _conditions: QueryCondition<Table>[]
    ) {}

    protected _columns: QueryColumn<Table, any>[] = [];
    protected _action: QueryAction;
    protected _entity: Entity | Partial<Entity>;

    update(entity: Partial<Entity>): Promise<number> {
        this._entity = entity;
        this._action = 'update';
        return this._queryProcessor(this);
    }

    delete(): Promise<number> {
        this._action = 'delete';
        return this._queryProcessor(this);
    }

    count(): Promise<number> {
        this._columns = [this._table.$all.count()];
        this._action = 'select';
        return this._queryProcessor(this).then((rows: number[]) => rows[0]);
    }
}

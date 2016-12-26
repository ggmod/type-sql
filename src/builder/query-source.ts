import QueryTable from './query-table';
import SelectQuery from './query/select-query';
import { QueryProcessor } from "./helpers/internal-types";
import JoinedTables from "./join/joined-tables";
import TableQuery from "./query/table-query";


export default class QuerySource {

    constructor(protected _queryProcessor: QueryProcessor) {}

    from<Entity, Table1 extends QueryTable<Entity, any>>(table1: Table1 & QueryTable<Entity, any>): SelectQuery<Entity, Table1>
    from<Tables extends QueryTable<any, any>>(tables: JoinedTables<Tables>): SelectQuery<any, Tables>
    from<Table1 extends QueryTable<any, any>, Table2 extends QueryTable<any, any>>(table1: Table1, table2: Table2): SelectQuery<any, Table1 | Table2>
    from<Table1 extends QueryTable<any, any>, Table2 extends QueryTable<any, any>, Table3 extends QueryTable<any, any>>(table1: Table1, table2: Table2, table3: Table3): SelectQuery<any, Table1 | Table2 | Table3>
    from<Entity, Table1 extends QueryTable<any, any>, Table2 extends QueryTable<any, any>, Table3 extends QueryTable<any, any>>(table1: any, table2?: any, table3?: any) {
        if (table3 != null) return new SelectQuery<any, Table1 | Table2 | Table3>(this._queryProcessor, [table1, table2, table3]);
        else if (table2 != null) return new SelectQuery<any, Table1 | Table2>(this._queryProcessor, [table1, table2]);
        return new SelectQuery<Entity, Table1>(this._queryProcessor, [table1]);
    }

    table<Entity, Id, Table extends QueryTable<Entity, Id>>(table: Table & QueryTable<Entity, Id>): TableQuery<Entity, Id, Table> {
        return new TableQuery<Entity, Id, Table>(this._queryProcessor, table);
    }
}

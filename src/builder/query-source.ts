import QueryTable from './query-table';
import SelectQuery from './select-query';
import QueryProcessor from "../query-processor";
import JoinedTables from "./joined-tables";
import TableQuery from "./table-query";


export default class QuerySource {

    constructor(protected _queryProcessor: QueryProcessor) {}

    from<Entity, Table1 extends QueryTable<Entity>>(table1: Table1 & QueryTable<Entity>): SelectQuery<Entity, Table1>
    from<Tables extends QueryTable<any>>(tables: JoinedTables<Tables>): SelectQuery<any, Tables>
    from<Table1 extends QueryTable<any>, Table2 extends QueryTable<any>>(table1: Table1, table2: Table2): SelectQuery<any, Table1 | Table2>
    from<Table1 extends QueryTable<any>, Table2 extends QueryTable<any>, Table3 extends QueryTable<any>>(table1: Table1, table2: Table2, table3: Table3): SelectQuery<any, Table1 | Table2 | Table3>
    from<Entity, Table1 extends QueryTable<any>, Table2 extends QueryTable<any>, Table3 extends QueryTable<any>>(table1: any, table2?: any, table3?: any) {
        if (table3 != null) return new SelectQuery<any, Table1 | Table2 | Table3>(this._queryProcessor, [table1, table2, table3]);
        else if (table2 != null) return new SelectQuery<any, Table1 | Table2>(this._queryProcessor, [table1, table2]);
        return new SelectQuery<Entity, Table1>(this._queryProcessor, [table1]);
    }

    table<Entity, Table extends QueryTable<Entity>>(table: Table & QueryTable<Entity>): TableQuery<Entity, Table> {
        return new TableQuery<Entity, Table>(this._queryProcessor, table);
    }
}

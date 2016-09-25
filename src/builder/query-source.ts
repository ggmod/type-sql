import QueryTable from './query-table';
import Query from './query';
import QueryProcessor from "../query-processor";


export default class QuerySource {

    constructor(private _queryProcessor: QueryProcessor) {}

    from<Entity, Table1 extends QueryTable<Entity>>(table1: Table1 & QueryTable<Entity>): Query<Entity, Table1>
    from<Table1 extends QueryTable<any>, Table2 extends QueryTable<any>>(table1: Table1, table2: Table2): Query<any, Table1 | Table2>
    from<Table1 extends QueryTable<any>, Table2 extends QueryTable<any>, Table3 extends QueryTable<any>>(table1: Table1, table2: Table2, table3: Table3): Query<any, Table1 | Table2 | Table3>
    from<Entity, Table1 extends QueryTable<any>, Table2 extends QueryTable<any>, Table3 extends QueryTable<any>>(table1: any, table2?: any, table3?: any) {
        if (table3 != null) return new Query<any, Table1 | Table2 | Table3>(this._queryProcessor, [table1, table2, table3]);
        else if (table2 != null) return new Query<any, Table1 | Table2>(this._queryProcessor, [table1, table2]);
        return new Query<Entity, Table1>(this._queryProcessor, [table1]);
    }
}

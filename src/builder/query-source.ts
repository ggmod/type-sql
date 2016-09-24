import QueryTable from './query-table';
import Query from './query';
import QueryProcessor from "../query-processor";


export default class QuerySource {

    constructor(private _queryProcessor: QueryProcessor) {}

    from<Table1 extends QueryTable>(table: Table1): Query<Table1>
    from<Table1 extends QueryTable, Table2 extends QueryTable>(table1: Table1, table2: Table2): Query<Table1 | Table2>
    from<Table1 extends QueryTable, Table2 extends QueryTable, Table3 extends QueryTable>(table1: Table1, table2: Table2, table3: Table3): Query<Table1 | Table2 | Table3>
    from<Table1 extends QueryTable, Table2 extends QueryTable, Table3 extends QueryTable>(table1: any, table2?: any, table3?: any) {
        if (table3 != null) return new Query<Table1 | Table2 | Table3>(this._queryProcessor, [table1, table2, table3]);
        else if (table2 != null) return new Query<Table1 | Table2>(this._queryProcessor, [table1, table2]);
        else return new Query<Table1>(this._queryProcessor, [table1]);
    }
}

import QueryTable from "./query-table";
import QueryJoinCondition from "./query-join-condition";
import JoinedTables from "./joined-tables";


export default class JoinedTablesChain<Tables extends QueryTable<any>> {

    constructor(
        protected _table: QueryTable<any>,
        protected _modifier = '',
        protected _parent: JoinedTables<Tables> | QueryTable<any>
    ) {}

    on(condition: QueryJoinCondition<Tables, Tables, any>): JoinedTables<Tables> {
        return new JoinedTables(condition, this);
    }
}
